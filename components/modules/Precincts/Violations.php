<?php
/**
 * @package        Precincts
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
 */
namespace cs\modules\Precincts;

use
	cs\Cache\Prefix,
	cs\Config,
	cs\Storage,
	cs\Trigger,
	cs\CRUD,
	cs\Singleton;

/**
 * @method static \cs\modules\Precincts\Violations instance($check = false)
 */
class Violations {
	use
		CRUD,
		Singleton;

	const STATUS_ADDED    = -1;
	const STATUS_APPROVED = 1;
	const STATUS_DECLINED = 0;

	/**
	 * @var Prefix
	 */
	protected $cache;
	/**
	 * @var Prefix
	 */
	protected $precincts_cache;
	protected $table      = '[prefix]precincts_violations';
	protected $data_model = [
		'id'           => 'int',
		'precinct'     => 'int',
		'user'         => 'int',
		'date'         => 'int',
		'text'         => 'text',
		'images'       => null, //Set in constructor, array of strings
		'video'        => 'string',
		'status'       => 'int',
		'location'     => null, //Set in constructor, array of floats (lat, lng)
		'device_model' => 'text'
	];

	protected function construct () {
		$this->cache                = new Prefix('precincts/violations');
		$this->precincts_cache      = new Prefix('precincts');
		$this->data_model['images'] = function ($images) {
			return _json_encode(
				array_values(array_filter($images, function ($image) {
					return preg_match("#^(http[s]?://)#", $image);
				}))
			);
		};
		$this->data_model['location'] = function ($location) {
			return _json_encode(
				_float($location)
			);
		};
		$this->data_model['video']  = function ($video) {
			if (preg_match('/ustream.tv\/(channel|embed)\/([0-9]+)/i', $video, $m)) {
				$video = "https://www.ustream.tv/embed/$m[2]";
			} elseif (preg_match('/ustream.tv\/(recorded|embed\/recorded)\/([0-9]+)/i', $video, $m)) {
				$video = "https://www.ustream.tv/embed/recorded/$m[2]";
			} elseif (preg_match('/(youtube.com\/embed\/|youtube.com\/watch\?v=)([0-9a-z\-]+)/i', $video, $m)) {
				$video = "https://www.youtube.com/embed/$m[2]";
			} else {
				$video = '';
			}
			return $video;
		};
	}
	protected function cdb () {
		return Config::instance()->module('Precincts')->db('precincts');
	}
	/**
	 * Add new violation
	 *
	 * @param         $precinct
	 * @param         $user
	 * @param         $text
	 * @param         $images
	 * @param         $video
	 * @param float[] $location
	 * @param string  $device_model
	 *
	 * @return bool|int
	 */
	function add ($precinct, $user, $text, $images, $video, $location = [], $device_model = '') {
		if (!is_array($location) || count($location) > 2) {
			return false;
		}
		$precinct = (int)$precinct;
		$id       = $this->create_simple([
			$precinct,
			$user,
			TIME,
			$text,
			$images,
			$video,
			self::STATUS_ADDED,
			$location,
			$device_model
		]);
		if ($id) {
			foreach ($images as $image) {
				Trigger::instance()->run(
					'System/upload_files/add_tag',
					[
						'tag' => "Precincts/violations/$id",
						'url' => $image
					]
				);
			}
			unset(
				$image,
				$this->cache->{"all_for_precincts/$precinct"},
				$this->precincts_cache->$precinct,
				$this->precincts_cache->all
			);
			Precincts::instance()->update_violations($precinct);
			return $id;
		}
		return false;
	}
	/**
	 * Get stream
	 *
	 * @param int|int[] $id
	 *
	 * @return array|array[]|bool
	 */
	function get ($id) {
		if (is_array($id)) {
			foreach ($id as &$i) {
				$i = $this->get($i);
			}
			return $id;
		}
		return $this->cache->get($id, function () use ($id) {
			$data             = $this->read_simple($id);
			if (!$data) {
				return false;
			}
			$data['images']   = _json_decode($data['images']);
			$data['id']       = (int)$data['id'];
			$data['precinct'] = (int)$data['precinct'];
			$data['user']     = (int)$data['user'];
			$data['date']     = (int)$data['date'];
			$data['status']   = (int)$data['status'];
			$data['location'] = _json_decode($data['location']);
			return $data;
		});
	}
	/**
	 * Delete violation
	 *
	 * @param int|int[] $id
	 *
	 * @return bool
	 */
	function del ($id) {
		if (is_array($id)) {
			foreach ($id as &$i) {
				$i = (int)$this->del($i);
			}
			return (bool)array_product($id);
		}
		$data = $this->read_simple($id);
		if (!$data) {
			return false;
		}
		if (!$this->delete_simple($id)) {
			return false;
		}
		Precincts::instance()->update_violations($data['precinct']);
		unset(
			$data['id'],
			$this->cache->{"all_for_precincts/$data[precinct]"},
			$this->precincts_cache->{$data['precinct']},
			$this->precincts_cache->all
		);
		foreach ($data['images'] as $image) {
			Trigger::instance()->run(
				'System/upload_files/del_tag',
				[
					'tag' => "Precincts/violations/$data[id]",
					'url' => $image
				]
			);
		}
		return true;
	}
	/**
	 * Get array of id of all violation for precinct
	 *
	 * @param int $precinct
	 *
	 * @return bool|int[]
	 */
	function get_all_for_precinct ($precinct) {
		return $this->cache->get("all_for_precincts/$precinct", function () use ($precinct) {
			return $this->db()->qfas([
				"SELECT `id`
				FROM `$this->table`
				WHERE
					`precinct`	= '%s' AND
					`status`	!= '%s'",
				$precinct,
				self::STATUS_DECLINED
			]);
		});
	}
	/**
	 * Approve added violation
	 *
	 * @param int $id
	 *
	 * @return bool
	 */
	function approve ($id) {
		$id             = (int)$id;
		$data           = $this->get($id);
		$data['status'] = self::STATUS_APPROVED;
		if ($this->update_simple($data)) {
			unset(
				$this->cache->$id,
				$this->cache->{"all_for_precincts/$data[precinct]"},
				$this->precincts_cache->all
			);
			return true;
		}
		return false;
	}
	/**
	 * Decline added violation
	 *
	 * @param int $id
	 *
	 * @return bool
	 */
	function decline ($id) {
		$data           = $this->get($id);
		$data['status'] = self::STATUS_DECLINED;
		if ($this->update_simple($data)) {
			Precincts::instance()->update_violations($data['precinct']);
			unset(
				$this->cache->$id,
				$this->cache->{"all_for_precincts/$data[precinct]"},
				$this->precincts_cache->all
			);
			return true;
		}
		return false;
	}
	/**
	 * Send violation to moderation
	 *
	 * @param int $id
	 *
	 * @return bool
	 */
	function to_moderation ($id) {
		$data           = $this->get($id);
		$data['status'] = self::STATUS_ADDED;
		if ($this->update_simple($data)) {
			Precincts::instance()->update_violations($data['precinct']);
			unset(
				$this->cache->$id,
				$this->cache->{"all_for_precincts/$data[precinct]"},
				$this->precincts_cache->all
			);
			return true;
		}
		return false;
	}
	/**
	 * Get last added violations
	 *
	 * @param int    $number  Max number of violations to return
	 * @param int    $last_id Id of oldest received violation
	 * @param string $search
	 *
	 * @return array[]|bool
	 */
	function last_violations ($number, $last_id, $search = '') {
		$number  = (int)$number;
		$last_id = (int)$last_id;
		$where   = [];
		if ($last_id) {
			$where[] = "`id` < $last_id";
		}
		if ($search) {
			$precincts = Precincts::instance()->search($search, false, 10000);
			if ($precincts) {
				$where[] = "`precinct` IN (".implode(',', $precincts).")";
			} else {
				return false;
			}
		}
		$where[] = '`status` != '.self::STATUS_DECLINED;
		if ($where) {
			$where = 'WHERE '.implode(' AND ', $where);
		} else {
			$where = '';
		}
		return $this->get(
			$this->db()->qfas(
				"SELECT `id`
				FROM `$this->table`
				$where
				ORDER BY `id` DESC
				LIMIT $number"
			)
		);
	}
	/**
	 * Get new violations
	 *
	 * @return bool|int[]
	 */
	function get_new () {
		return $this->db()->qfas([
			"SELECT `id`
			FROM `$this->table`
			WHERE `status` = '%s'
			ORDER BY `id` ASC
			LIMIT 100",
			self::STATUS_ADDED
		]);
	}
	/**
	 * Get approved violations
	 *
	 * @return bool|int[]
	 */
	function get_approved () {
		return $this->db()->qfas([
			"SELECT `id`
			FROM `$this->table`
			WHERE `status` = '%s'
			ORDER BY `id` DESC
			LIMIT 100",
			self::STATUS_APPROVED
		]);
	}
	/**
	 * Get declined violations
	 *
	 * @return bool|int[]
	 */
	function get_declined () {
		return $this->db()->qfas([
			"SELECT `id`
			FROM `$this->table`
			WHERE `status` = '%s'
			ORDER BY `id` DESC
			LIMIT 100",
			self::STATUS_DECLINED
		]);
	}
	/**
	 * Calculate user rating based on approved/declined messages
	 *
	 * @param int $user
	 *
	 * @return int
	 */
	function user_rating ($user) {
		return $this->db()->qfs([
			"SELECT SUM(CASE WHEN (`status` = '%s') THEN 1 ELSE -1 END) as `value`
			FROM `$this->table`
			WHERE
				`user`		= '%s' AND
				`status`	!= '%s'",
			self::STATUS_APPROVED,
			$user,
			self::STATUS_ADDED
		]) ?: 0;
	}
	/**
	 * Get array of id of new violations of specified user
	 *
	 * @param int $user
	 *
	 * @return bool|int[]
	 */
	function get_new_of_user ($user) {
		return $this->db()->qfas([
			"SELECT `id`
			FROM `$this->table`
			WHERE
				`user`		= '%s' AND
				`status`	= '%s'",
			$user,
			self::STATUS_ADDED
		]);
	}
}
