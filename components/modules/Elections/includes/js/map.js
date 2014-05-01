// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var begin, user_location;
    if (cs.module !== 'Elections') {
      return;
    }
    user_location = null;
    ymaps.ready(function() {
      user_location = cs.getcookie('coordinates');
      if (user_location) {
        user_location = JSON.parse(user_location);
        return begin();
      } else {
        return ymaps.geolocation.get({
          autoReverseGeocode: false,
          provider: 'yandex'
        }).then(function(result) {
          user_location = result.geoObjects.get(0).geometry.getCoordinates();
          setTimeout(begin, 0);
          return ymaps.geolocation.get({
            autoReverseGeocode: false
          }).then(function(result) {
            user_location = result.geoObjects.get(0).geometry.getCoordinates();
            map.panTo(user_location);
            return cs.setcookie('coordinates', JSON.stringify(user_location));
          });
        });
      }
    });
    return begin = function() {
      var cluster_icons, districts_clusterer, districts_icons_shape, precincts_clusterer, precincts_icons_shape;
      window.map = new ymaps.Map('map', {
        center: user_location,
        zoom: 15,
        controls: ['typeSelector', 'zoomControl', 'fullscreenControl', 'rulerControl', 'trafficControl']
      }, {
        avoidFractionalZoom: false
      });
      cluster_icons = [
        {
          href: '/components/modules/Elections/includes/img/cluster-46.png',
          size: [46, 46],
          offset: [-23, -23]
        }, {
          href: '/components/modules/Elections/includes/img/cluster-58.png',
          size: [58, 58],
          offset: [-27, -27]
        }
      ];
      districts_clusterer = new ymaps.Clusterer({
        clusterIcons: cluster_icons,
        hasBalloon: false,
        hasHint: false
      });
      precincts_clusterer = new ymaps.Clusterer({
        clusterIcons: cluster_icons,
        hasHint: false
      });
      map.geoObjects.add(precincts_clusterer);
      (function() {
        var previous_zoom;
        previous_zoom = 15;
        return map.events.add('boundschange', function(e) {
          if ((previous_zoom < 14) === (e.get('newZoom') < 14)) {
            return;
          }
          previous_zoom = e.get('newZoom');
          if (previous_zoom < 14) {
            map.geoObjects.remove(precincts_clusterer);
            return map.geoObjects.add(districts_clusterer);
          } else {
            map.geoObjects.remove(districts_clusterer);
            return map.geoObjects.add(precincts_clusterer);
          }
        });
      })();
      districts_icons_shape = new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([[[0 - 81, 32 - 82], [11 - 81, 11 - 82], [31 - 81, 0 - 82], [47 - 81, 0 - 82], [68 - 81, 11 - 82], [79 - 81, 32 - 82], [78 - 81, 49 - 82], [67 - 81, 67 - 82], [52 - 81, 77 - 82], [31 - 81, 78 - 82], [11 - 81, 67 - 82], [0 - 81, 48 - 82], [0 - 81, 32 - 82]]]));
      precincts_icons_shape = new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([[[15 - 15, 37 - 36], [1 - 15, 22 - 36], [0 - 15, 16 - 36], [1 - 15, 10 - 36], [5 - 15, 5 - 36], [11 - 15, 1 - 36], [19 - 15, 1 - 36], [26 - 15, 5 - 36], [31 - 15, 14 - 36], [30 - 15, 22 - 36], [15 - 15, 37 - 36]]]));
      $.ajax({
        url: 'api/Districts',
        type: 'get',
        data: null,
        success: function(districts) {
          var district, placemarks;
          placemarks = [];
          for (district in districts) {
            district = districts[district];
            placemarks.push(new ymaps.Placemark([district.lat, district.lng], {
              hasBalloon: false,
              hasHint: false,
              iconContent: '<div class="cs-elections-map-district-placemark-content' + (district.violations ? ' violations' : '') + '">' + cs.Language.district_map_content(district.district) + '</div>'
            }, {
              iconLayout: 'default#imageWithContent',
              iconImageHref: '/components/modules/Elections/includes/img/map-districts.png',
              iconImageSize: [81, 82],
              iconImageOffset: [-40, -41],
              iconImageClipRect: [[81 * district.violations, 0], [81 * (district.violations + 1), 0]],
              iconImageShape: districts_icons_shape
            }));
          }
          return districts_clusterer.add(placemarks);
        },
        error: function() {
          return console.error('Districts loading error');
        }
      });
      $.ajax({
        url: 'api/Precincts',
        type: 'get',
        data: null,
        success: function(precincts) {
          var placemarks, precinct;
          placemarks = [];
          for (precinct in precincts) {
            precinct = precincts[precinct];
            placemarks.push(new ymaps.Placemark([precinct.lat, precinct.lng], {
              hintContent: "Дільниця №" + precinct.number,
              balloonContentHeader: "Дільниця №" + precinct.number
            }, {
              iconLayout: 'default#image',
              iconImageHref: '/components/modules/Elections/includes/img/map-precincts.png',
              iconImageSize: [38, 37],
              iconImageOffset: [-15, -36],
              iconImageClipRect: [[38 * precinct.violations, 0], [38 * (precinct.violations + 1), 0]],
              iconImageShape: precincts_icons_shape
            }));
          }
          return precincts_clusterer.add(placemarks);
        },
        error: function() {
          return console.error('Precincts loading error');
        }
      });
    };
  });

}).call(this);
