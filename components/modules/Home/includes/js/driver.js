// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    if (!cs.home.automaidan) {
      return;
      return (function() {
        var init;
        return init = setInterval((function() {
          var location_updating, my_location;
          if (!window.map) {
            return;
          }
          clearInterval(init);
          my_location = null;
          if (navigator.geolocation) {
            location_updating = function() {
              return navigator.geolocation.getCurrentPosition(function(position) {
                my_location && map.geoObjects.remove(my_location);
                my_location = new ymaps.Placemark([position.coords.latitude, position.coords.longitude], {}, {
                  iconLayout: 'default#image',
                  iconImageHref: '/components/modules/Home/includes/img/driver.png',
                  iconImageSize: [40, 38],
                  iconImageOffset: [-16, -38],
                  iconImageClipRect: [[0, 0], [40, 0]]
                });
                map.geoObjects.add(my_location);
                return $.ajax({
                  url: 'api/Home/driver_location',
                  type: 'put',
                  data: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  },
                  complete: function() {
                    return setTimeout(location_updating, 2 * 1000);
                  }
                });
              }, function() {
                return alert('Не вдалось отримати доступ до вашого місцеположення');
              }, {
                enableHighAccuracy: true,
                timeout: 30 * 1000
              });
            };
            location_updating();
          } else {
            alert('Потрібен доступ до вашого місцеположення, це потрібно диспетчеру');
          }
        }), 100);
      })();
    }
  });

}).call(this);
