// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var L, last_search_value, precincts_search_results, precints_search_timeout;
    if (cs.module !== 'Elections') {
      return;
    }
    precints_search_timeout = 0;
    last_search_value = '';
    precincts_search_results = $('.cs-elections-precincts-search-results');
    L = cs.Language;
    return $('.cs-elections-precincts-search').keydown(function() {
      var $this;
      $this = $(this);
      clearTimeout(precints_search_timeout);
      return precints_search_timeout = setTimeout((function() {
        var value;
        value = $this.val();
        if (value.length < 3) {
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
            last_search_value = value;
            content = '';
            for (precinct in precincts) {
              precinct = precincts[precinct];
              content += ("<article data-id=\"" + precinct.id + "\">\n<h3>") + L.precint_number(precinct.number) + ("</h3>\n	<p>" + precinct.address + "</p>\n</article>");
            }
            return precincts_search_results.html(content);
          },
          error: function() {
            return precincts_search_results.html(L.no_precincts_found);
          }
        });
      }), 300);
    });
  });

}).call(this);