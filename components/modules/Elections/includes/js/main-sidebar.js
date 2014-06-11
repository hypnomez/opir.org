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
    var L, last_search_value, precincts_search_results, precints_search_timeout, show_timeout;
    if (cs.module !== 'Elections') {
      return;
    }
    precints_search_timeout = 0;
    last_search_value = '';
    precincts_search_results = $('.cs-elections-precincts-search-results');
    L = cs.Language;
    $('.cs-elections-precincts-search').keydown(function() {
      var $this;
      $this = $(this);
      clearTimeout(precints_search_timeout);
      return precints_search_timeout = setTimeout((function() {
        var value;
        value = $this.val();
        if (value.length < 3 && value != parseInt(value)) {
          precincts_search_results.html('');
          return;
        }
        if (value === last_search_value) {
          return;
        }
        return $.ajax({
          url: 'api/Precincts/search',
          data: {
            text: value,
            coordinates: JSON.parse(localStorage.getItem('coordinates'))
          },
          type: 'get',
          success: function(precincts) {
            var content, precinct;
            if (precincts.length) {
              last_search_value = value;
              content = '';
              for (precinct in precincts) {
                precinct = precincts[precinct];
                content += ("<article data-id=\"" + precinct.id + "\">\n<h3>") + L[precinct.number.length > 3 ? 'precint_number' : 'district_precint_number'](precinct.number) + ("</h3>\n	<p>" + precinct.address + "</p>\n</article>");
              }
              return precincts_search_results.html(content);
            } else {
              return precincts_search_results.html("<article>" + L.no_precincts_found + "</article>");
            }
          },
          error: function() {
            return precincts_search_results.html("<article>" + L.no_precincts_found + "</article>");
          }
        });
      }), 300);
    });
    show_timeout = 0;
    return precincts_search_results.on('mouseenter', '[data-id]', function() {
      var $this;
      clearTimeout(show_timeout);
      $this = $(this);
      return show_timeout = setTimeout((function() {
        var id, precinct;
        id = parseInt($this.data('id'));
        precinct = cs.elections.get_precincts()[id];
        return map.panTo([precinct.lat, precinct.lng]).then(function() {
          return map.zoomRange.get([precinct.lat, precinct.lng]).then(function(zoomRange) {
            return map.setZoom(zoomRange[1], {
              duration: 500
            });
          });
        });
      }), 200);
    }).on('mouseleave', '[data-id]', function() {
      return clearTimeout(show_timeout);
    });
  });

}).call(this);
