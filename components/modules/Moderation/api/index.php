<?php
/**
 * @package        Moderation
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
 */
namespace cs\modules\Precincts;

use
	cs\Config,
	cs\Index,
	cs\User;

$module_properties = Config::instance()->module('Moderation');
$User              = User::instance();
if (!$User->admin() && !in_array($module_properties->moderators_group ? : User::ADMIN_GROUP_ID, $User->get_groups())) {
	error_code(403);
	return;
}

$Index = Index::instance();

if (!isset($Index->route_path[1])) {
	$Index->route_path[1] = 'default';
}
