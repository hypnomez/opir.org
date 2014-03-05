// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    if (cs.module !== 'Streams') {
      return;
    }
    return ymaps.ready(function() {
      var clusterer, filter_streams, icons_shape, placemarks, streams_cache, streams_list;
      window.map = new ymaps.Map('map', {
        center: [50.45, 30.523611],
        zoom: 13,
        controls: ['typeSelector', 'zoomControl', 'fullscreenControl']
      });
      clusterer = new ymaps.Clusterer();
      clusterer.createCluster = function(center, geoObjects) {
        var cluster;
        cluster = ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects);
        cluster.options.set({
          icons: [
            {
              href: '/components/modules/Home/includes/img/cluster-46.png',
              size: [46, 46],
              offset: [-23, -23]
            }, {
              href: '/components/modules/Home/includes/img/cluster-58.png',
              size: [58, 58],
              offset: [-27, -27]
            }
          ]
        });
        return cluster;
      };
      map.geoObjects.add(clusterer);
      filter_streams = function(streams) {
        var tags;
        tags = $('.cs-stream-added-tags [data-id]');
        if (!tags.length) {
          return streams;
        }
        tags = tags.map(function() {
          return $(this).data('id');
        }).get();
        return streams.filter(function(stream) {
          var tag, _i, _len;
          for (_i = 0, _len = tags.length; _i < _len; _i++) {
            tag = tags[_i];
            if (stream.tags.indexOf(tag) === -1) {
              return true;
            }
          }
          return false;
        });
      };
      placemarks = [];
      icons_shape = new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([[[23 - 24, 56 - 58], [44 - 24, 34 - 58], [47 - 24, 23 - 58], [45 - 24, 14 - 58], [40 - 24, 7 - 58], [29 - 24, 0 - 58], [17 - 24, 0 - 58], [7 - 24, 6 - 58], [0 - 24, 18 - 58], [0 - 24, 28 - 58], [4 - 24, 36 - 58], [23 - 24, 56 - 58]]]));
      streams_cache = [];
      streams_list = $('.cs-stream-list');
      map.add_streams_on_map = function(streams) {
        var list_content, stream;
        streams = filter_streams(streams || streams_cache);
        placemarks = [];
        list_content = '';
        for (stream in streams) {
          stream = streams[stream];
          placemarks.push(new ymaps.Placemark([stream.lat, stream.lng], {
            balloonContentBody: "<p><iframe width=\"400\" height=\"240\" src=\"" + stream.stream_url + "\" frameborder=\"0\" scrolling=\"no\"></iframe></p>"
          }, {
            hasHint: false,
            iconLayout: 'default#image',
            iconImageHref: '/components/modules/Home/includes/img/events.png',
            iconImageSize: [59, 56],
            iconImageOffset: [-24, -56],
            iconImageClipRect: [[0, 56 * (28 - 1)], [59, 56 * 28]],
            iconImageShape: icons_shape
          }));
          list_content += "<iframe src=\"" + stream.stream_url + "\" frameborder=\"0\" scrolling=\"no\"></iframe>";
        }
        clusterer.removeAll();
        clusterer.add(placemarks);
        return streams_list.html(list_content);
      };
      $.ajax({
        url: 'api/Streams/streams',
        type: 'get',
        success: function(streams) {
          streams_cache = streams;
          map.add_streams_on_map(streams);
        },
        error: function() {}
      });
    });
  });

}).call(this);