###*
 * @package        Elections
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
###

$ ->
	$('.cs-elections-help-initiative').click ->
		$('.cs-elections-help-initiative-modal')
			.cs().modal('show')
