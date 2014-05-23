// Generated by CoffeeScript 1.4.0

/**
 * @package        Elections
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
*/


(function() {

  $(function() {
    var L, begin, loading, user_location;
    if (cs.module !== 'Elections') {
      return;
    }
    loading = function(mode) {
      if (mode === 'show') {
        return $("<div class=\"cs-elections-loading\">\n	<i class=\"uk-icon-spinner uk-icon-spin\"></i>\n</div>").hide().appendTo('body').slideDown();
      } else {
        return setTimeout((function() {
          return $('.cs-elections-loading').slideUp().remove();
        }), 200);
      }
    };
    loading('show');
    $('#map').show();
    user_location = null;
    L = cs.Language;
    ymaps.ready(function() {
      user_location = localStorage.getItem('coordinates');
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
            return localStorage.setItem('coordinates', JSON.stringify(user_location));
          });
        });
      }
    });
    return begin = function() {
      var add_districts_on_map, add_precincts_on_map, cluster_icons, districts_clusterer, districts_icons_shape, filter_precincts, precincts_clusterer, precincts_icons_shape;
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
        hasHint: false,
        maxZoom: 15
      });
      map.geoObjects.add(precincts_clusterer);
      (function() {
        var previous_zoom;
        previous_zoom = 15;
        return map.events.add('boundschange', function(e) {
          if ((previous_zoom < 13) === (e.get('newZoom') < 13)) {
            if (previous_zoom > 13) {
              setTimeout(add_precincts_on_map, 0);
            }
            return;
          }
          previous_zoom = e.get('newZoom');
          if (previous_zoom < 13) {
            map.geoObjects.remove(precincts_clusterer);
            return map.geoObjects.add(districts_clusterer);
          } else {
            map.geoObjects.remove(districts_clusterer);
            map.geoObjects.add(precincts_clusterer);
            return setTimeout(add_precincts_on_map, 0);
          }
        });
      })();
      districts_icons_shape = new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([[[0 - 40, 32 - 41], [11 - 40, 11 - 41], [31 - 40, 0 - 41], [47 - 40, 0 - 41], [68 - 40, 11 - 41], [79 - 40, 32 - 41], [78 - 40, 49 - 41], [67 - 40, 67 - 41], [52 - 40, 77 - 41], [31 - 40, 78 - 41], [11 - 40, 67 - 41], [0 - 40, 48 - 41], [0 - 40, 32 - 41]]]));
      precincts_icons_shape = new ymaps.shape.Polygon(new ymaps.geometry.pixel.Polygon([[[15 - 15, 37 - 36], [1 - 15, 22 - 36], [0 - 15, 16 - 36], [1 - 15, 10 - 36], [5 - 15, 5 - 36], [11 - 15, 1 - 36], [19 - 15, 1 - 36], [26 - 15, 5 - 36], [31 - 15, 14 - 36], [30 - 15, 22 - 36], [15 - 15, 37 - 36]]]));
      filter_precincts = function(precincts) {
        var bounds, lat, lng, precinct, result;
        bounds = map.getBounds();
        result = {};
        for (precinct in precincts) {
          precinct = precincts[precinct];
          lat = parseFloat(precinct.lat);
          lng = parseFloat(precinct.lng);
          if (lat > bounds[0][0] && lat < bounds[1][0] && lng > bounds[0][1] && lng < bounds[1][1]) {
            result[precinct.id] = precinct;
          }
        }
        return result;
      };
      add_precincts_on_map = function() {
        var placemarks, precinct, _fn, _ref;
        placemarks = [];
        _ref = filter_precincts(cs.elections.get_precincts());
        _fn = function(id) {
          return placemarks[placemarks.length - 1].events.add('click', function() {
            return $.ajax({
              url: "api/Precincts/" + id,
              data: null,
              type: 'get',
              success: function(precinct) {
                return cs.elections.open_precinct(id, precinct.address);
              }
            });
          });
        };
        for (precinct in _ref) {
          precinct = _ref[precinct];
          placemarks.push(new ymaps.Placemark([precinct.lat, precinct.lng], {
            hintContent: L.precint_number(precinct.number),
            balloonContentHeader: L.precint_number(precinct.number)
          }, {
            iconLayout: 'default#image',
            iconImageHref: '/components/modules/Elections/includes/img/map-precincts.png',
            iconImageSize: [38, 37],
            iconImageOffset: [-15, -36],
            iconImageClipRect: [[38 * (precinct.violations ? 1 : 0), 0], [38 * ((precinct.violations ? 1 : 0) + 1), 37]],
            iconImageShape: precincts_icons_shape
          }));
          _fn(precinct.id);
        }
        precincts_clusterer.removeAll();
        precincts_clusterer.add(placemarks);
        return loading('hide');
      };
      add_districts_on_map = function() {
        var district, districts, placemarks;
        districts = cs.elections.get_districts();
        placemarks = [];
        for (district in districts) {
          district = districts[district];
          placemarks.push(new ymaps.Placemark([district.lat, district.lng], {
            hasBalloon: false,
            hasHint: false,
            iconContent: '<div class="cs-elections-map-district-placemark-content' + (parseInt(district.violations) ? ' violations' : '') + '">' + cs.Language.district_map_content(district.district) + '</div>'
          }, {
            iconLayout: 'default#imageWithContent',
            iconImageHref: '/components/modules/Elections/includes/img/map-districts.png',
            iconImageSize: [81, 82],
            iconImageOffset: [-40, -41],
            iconImageClipRect: [[81 * (district.violations ? 1 : 0), 0], [81 * ((district.violations ? 1 : 0) + 1), 82]],
            iconImageShape: districts_icons_shape
          }));
        }
        districts_clusterer.removeAll();
        return districts_clusterer.add(placemarks);
      };
      if (!cs.elections.get_districts(true)) {
        $.ajax({
          url: 'api/Districts',
          type: 'get',
          data: null,
          success: function(loaded_districts) {
            var district, districts, _i, _len;
            districts = {};
            for (_i = 0, _len = loaded_districts.length; _i < _len; _i++) {
              district = loaded_districts[_i];
              districts[district.district] = district;
            }
            localStorage.setItem('districts', JSON.stringify(districts));
            return add_districts_on_map();
          },
          error: function() {
            return console.error('Districts loading error');
          }
        });
      } else {
        add_districts_on_map();
        $.ajax({
          url: 'api/Districts?fields=violations',
          type: 'get',
          data: null,
          success: function(violations_loaded) {
            var district, districts, update, _i, _len;
            districts = cs.elections.get_districts();
            update = false;
            for (_i = 0, _len = violations_loaded.length; _i < _len; _i++) {
              district = violations_loaded[_i];
              update = update || (districts[district.district].violations !== district.violations);
              if (update) {
                districts[district.district].violations = district.violations;
              }
            }
            if (update) {
              localStorage.setItem('districts', JSON.stringify(districts));
              return add_districts_on_map();
            }
          },
          error: function() {
            return console.error('Districts loading error');
          }
        });
      }
      if (!cs.elections.get_precincts(true)) {
        $.ajax({
          url: 'api/Precincts?flat',
          type: 'get',
          data: null,
          success: function(loaded_precincts) {
            var precinct, precincts, _i, _len, _ref;
            precincts = {};
            _ref = loaded_precincts.id;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              precinct = _ref[_i];
              precincts[precinct] = {
                id: precinct,
                lat: loaded_precincts.lat[precinct],
                lng: loaded_precincts.lng[precinct],
                number: loaded_precincts.number[precinct],
                violations: loaded_precincts.violations[precinct]
              };
            }
            localStorage.setItem('precincts', JSON.stringify(precincts));
            return add_precincts_on_map();
          },
          error: function() {
            return console.error('Precincts loading error');
          }
        });
      } else {
        add_precincts_on_map();
        $.ajax({
          url: 'api/Precincts?fields=violations&flat',
          type: 'get',
          data: null,
          success: function(violations_loaded) {
            var precinct, precincts, update, _i, _len, _ref;
            precincts = cs.elections.get_precincts();
            update = false;
            _ref = violations_loaded.id;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              precinct = _ref[_i];
              update = update || (precincts[precinct].violations !== violations_loaded.violations[precinct]);
              if (update) {
                precincts[precinct].violations = violations_loaded.violations[precinct];
              }
            }
            if (update) {
              localStorage.setItem('precincts', JSON.stringify(precincts));
              return add_precincts_on_map();
            }
          },
          error: function() {
            return console.error('Precincts loading error');
          }
        });
      }
    };
  });

}).call(this);
