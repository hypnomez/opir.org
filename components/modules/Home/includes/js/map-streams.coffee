$ ->
	if cs.module != 'Streams'
		return
	ymaps.ready ->
		window.map				= new ymaps.Map 'map', {
			center				: [50.45, 30.523611]
			zoom				: 13
			controls			: ['typeSelector', 'zoomControl', 'fullscreenControl']
		}
		clusterer				= new ymaps.Clusterer()
		clusterer.createCluster	= (center, geoObjects) ->
			cluster	= ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects)
			cluster.options.set(
				icons	: [
					{
						href	: '/components/modules/Home/includes/img/cluster-46.png'
						size	: [46, 46]
						offset	: [-23, -23]
					}
					{
						href	: '/components/modules/Home/includes/img/cluster-58.png'
						size	: [58, 58]
						offset	: [-27, -27]
					}
				]
			)
			cluster
		map.geoObjects.add(clusterer)
		filter_streams		= (events) ->
			categories	= $('.cs-home-filter-category .active')
			events.filter (event) ->
				!categories.length || categories.filter("[data-id=#{event.category}]").length
		placemarks			= []
		icons_shape			= new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([
			[
				[23-24, 56-58],
				[44-24, 34-58],
				[47-24, 23-58],
				[45-24, 14-58],
				[40-24, 7-58],
				[29-24, 0-58],
				[17-24, 0-58],
				[7-24, 6-58],
				[0-24, 18-58],
				[0-24, 28-58],
				[4-24, 36-58],
				[23-24, 56-58]
			]
		]))
		add_streams_on_map	= (events) ->
			events						= filter_streams(events)
			placemarks					= []
			for event, event of events
				text	= """<p><iframe width="260" height="240" src="#{text}" frameborder="0" scrolling="no"></iframe></p>"""
				placemarks.push(
					new ymaps.Placemark(
						[event.lat, event.lng]
						{
							hintContent				: category_name
							balloonContentHeader	: category_name
							balloonContentBody		: """
								#{added}
								#{timeout}
								#{img}
								#{text}
							"""
							balloonContentFooter	: balloon_footer(event, is_streaming)
						}
						{
							iconLayout			: 'default#image'
							iconImageHref		: '/components/modules/Home/includes/img/events.png'
							iconImageSize		: [59, 56]
							iconImageOffset		: [-24, -56]
							iconImageClipRect	: [[0, 56 * (28 - 1)], [59, 56 * 28]]
							iconImageShape		: icons_shape
						}
					)
				)
			clusterer.removeAll()
			clusterer.add(placemarks)
		streams_cache	= []
		$.ajax(
			url			: 'api/Streams/streams'
			type		: 'get'
			success		: (events) ->
				streams_cache	= events
				add_streams_on_map(events)
				return
			error		: ->
		)
		return
