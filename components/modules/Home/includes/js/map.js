// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    return ymaps.ready(function() {
      var add_events_on_map, categories, clusterer, filter_events;
      window.map = new ymaps.Map('map', {
        center: [50.45, 30.523611],
        zoom: 13,
        controls: ['typeSelector', 'zoomControl'],
        type: 'yandex#hybrid'
      });
      categories = [];
      (function() {
        var category, _ref;
        _ref = cs.home.categories;
        for (category in _ref) {
          category = _ref[category];
          categories[category.id] = category.name;
        }
      })();
      clusterer = new ymaps.Clusterer;
      map.geoObjects.add(clusterer);
      filter_events = function(events) {
        var category, urgency;
        category = $('.cs-home-filter-category').data('id');
        urgency = $('.cs-home-filter-urgency').data('id');
        return events.filter(function(event) {
          return (!category || category === parseInt(event.category)) && (urgency === 'any' || urgency === event.urgency);
        });
      };
      add_events_on_map = function(events) {
        var category_name, event, placemarks, time, urgency, _fn;
        events = filter_events(events);
        placemarks = [];
        _fn = function(t, event) {
          var time;
          return time = t.getMinutes() + ':' + t.getHours() + ' ' + t.getDate() + '.' + t.getMonth() + '.' + t.getYear();
        };
        for (event in events) {
          event = events[event];
          category_name = categories[event.category];
          time = event.time;
          _fn(new Date(event.time * 1000), event);
          urgency = (function() {
            switch (event.urgency) {
              case 'unknown':
                return 0;
              case 'can-wait':
                return 1;
              case 'urgent':
                return 2;
            }
          })();
          placemarks.push(new ymaps.Placemark([event.lat, event.lng], {
            hintContent: event.category_name
          }, {
            iconLayout: 'default#image',
            iconImageHref: '/components/modules/Home/includes/img/events.png',
            iconImageSize: [59, 56],
            iconImageOffset: [-24, -56],
            iconImageClipRect: [[59 * urgency, 56 * (event.category - 1)], [59 * (urgency + 1), 56 * event.category]],
            balloonLayout: ymaps.templateLayoutFactory.createClass("<section class=\"cs-home-balloon-container\">\n	<header><h1>" + category_name + "</h1> <a class=\"uk-close\" onclick=\"map.balloon.close()\"></a></header>\n	<time>До " + time + "</time>\n	<p>" + event.text + "</p>\n</section>")
          }));
        }
        clusterer.removeAll();
        return clusterer.add(placemarks);
      };
      map.update_events = function(from_cache) {
        if (from_cache == null) {
          from_cache = false;
        }
        if (from_cache && map.update_events.cache) {
          add_events_on_map(map.update_events.cache);
        } else {
          $.ajax({
            url: 'api/Home/events',
            type: 'get',
            success: function(events) {
              map.update_events.cache = events;
              add_events_on_map(events);
            }
          });
        }
      };
      return map.update_events();
    });
  });

}).call(this);
