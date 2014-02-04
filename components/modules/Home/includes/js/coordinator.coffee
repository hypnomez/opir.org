$ ->
	if !cs.home.automaidan_coord
		return
	ymaps.ready ->
		refresh_delay	= 5
		clusterer		= new ymaps.Clusterer(
			minClusterSize	: 1000
		)
		routes			= []
		check_event_id	= 0
		do ->
			init = setInterval (->
				if !window.map
					return
				clearInterval(init)
				map.geoObjects.add(clusterer)
				update_drivers			= ->
					$.ajax(
						url			: 'api/Home/drivers'
						type		: 'get'
						complete	: ->
							setTimeout(update_drivers, refresh_delay * 1000)
						success		: (drivers) ->
							placemarks	= []
							routes.length && map.geoObjects.remove(routes)
							routes	= []
							for driver, driver of drivers
								driver.busy	= parseInt(driver.busy)
								placemarks.push(
									new ymaps.Placemark(
										[driver.lat, driver.lng]
										{}
										{
											iconLayout			: 'default#image'
											iconImageHref		: '/components/modules/Home/includes/img/driver.png'
											iconImageSize		: [40, 38]
											iconImageOffset		: [-16, -38]
											iconImageClipRect	: [[40 * driver.busy, 0], [40 * (driver.busy + 1), 38]]
										}
									)
								)
								do (id = driver.id) ->
									if driver.busy
										for event, event of map.update_events.cache
											if event.assigned_to == id
												ymaps.route(
													[
														[driver.lat, driver.lng], [event.lat, event.lng]
													],
													{
														avoidTrafficJams	: true
													}
												).then (route) ->
													routes.push(route)
													route.getWayPoints().removeAll()
													map.geoObjects.add(route)
										return
									placemarks[placemarks.length - 1].events.add('click', ->
										check_event(id)
									)
							clusterer.removeAll()
							clusterer.add(placemarks)
							return
					)
					return
				update_drivers()
				cs.home.delete_event	= (id) ->
					if !confirm('Точно видалити?')
						return
					$.ajax(
						url			: "api/Home/events/#{id}"
						type		: 'delete'
						success		: ->
							update_drivers()
							return
					)
					return
			), 100
		$('#map').on(
			'click'
			'.cs-home-check-assign'
			->
				check_event_id	= $(@).data('id')
				alert 'Тепер оберіть вільного водія поблизу (синього кольору)'
		)
		check_event	= (driver) ->
			if !check_event_id
				return
			$.ajax(
				url		: "api/Home/events/#{check_event_id}/check"
				data	:
					driver	: driver
				type	: 'post'
				success	: ->
					map.balloon.close()
					check_event_id	= 0
					alert 'Водій отримав повідомлення про перевірку'
			)
