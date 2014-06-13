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
    var L, data_loading, find_violations, last_search_value, last_violations_button, last_violations_content, last_violations_panel, last_violations_search, precincts_search_results, search_timeout;
    if (cs.module !== 'Elections') {
      return;
    }
    last_violations_button = $('.cs-elections-last-violations');
    last_violations_panel = $('.cs-elections-last-violations-panel');
    last_violations_content = last_violations_panel.children('section').masonry({
      columnWidth: 280,
      gutter: 20,
      itemSelector: 'article',
      transitionDuration: 0
    });
    last_violations_search = $('.cs-elections-precincts-search');
    precincts_search_results = $('.cs-elections-precincts-search-results');
    L = cs.Language;
    data_loading = false;
    last_violations_button.click(function() {
      if (!last_violations_button.is('.cs-elections-last-violations')) {
        precincts_search_results.html('');
        last_violations_button.removeClass('cs-elections-switch-to-map').addClass('cs-elections-last-violations');
        last_violations_panel.slideUp('fast', function() {
          return last_violations_content.html('').masonry('destroy').masonry({
            columnWidth: 280,
            gutter: 20,
            itemSelector: 'article',
            transitionDuration: 0
          });
        });
        return;
      }
      last_violations_button.removeClass('cs-elections-last-violations').addClass('cs-elections-switch-to-map');
      data_loading = false;
      return last_violations_panel.slideDown('fast', find_violations);
    });
    find_violations = function() {
      var last_id, search;
      if (data_loading) {
        return;
      }
      data_loading = true;
      last_id = last_violations_content.children('article:last').data('id') || 0;
      last_violations_content.children('p').remove();
      cs.elections.loading('show');
      search = last_violations_search.val();
      return $.ajax({
        url: ("api/Violations?number=20&last_id=" + last_id + "&search=") + (search.length < 3 ? '' : search),
        type: 'get',
        data: null,
        success: function(violations) {
          var ids;
          ids = [];
          (function() {
            var violation, _results;
            _results = [];
            for (violation in violations) {
              violation = violations[violation];
              _results.push(ids.push(violation.precinct));
            }
            return _results;
          })();
          ids = ids.join(',');
          return $.ajax({
            url: "api/Precincts?fields=address,district&id=" + ids,
            type: 'get',
            data: null,
            success: function(addresses_districts_loaded) {
              var addresses, appended, content, districts, images, precinct, precincts, text, time, video, violation, _i, _j, _len, _len1;
              addresses = {};
              districts = {};
              (function() {
                var p, _i, _len;
                for (_i = 0, _len = addresses_districts_loaded.length; _i < _len; _i++) {
                  p = addresses_districts_loaded[_i];
                  addresses[p.id] = p.address;
                  districts[p.id] = p.district;
                }
              })();
              content = '';
              precincts = cs.elections.get_precincts();
              for (_i = 0, _len = violations.length; _i < _len; _i++) {
                violation = violations[_i];
                precinct = precincts[violation.precinct];
                time = new Date(violation.date * 1000);
                time = (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes());
                text = violation.text ? "<p>" + violation.text + "</p>" : '';
                images = violation.images.length ? violation.images.map(function(image) {
                  return "<figure class=\"uk-vertical-align\"><img src=\"" + image + "\" alt=\"\" class=\"uk-vertical-align-middle\"></figure>";
                }).join('') : '';
                video = violation.video ? "<iframe src=\"" + violation.video + "\" frameborder=\"0\" scrolling=\"no\"></iframe>" : '';
                content += ("<article data-id=\"" + violation.id + "\">\n<h3>\n	" + time + "\n	<span data-id=\"" + precinct.id + "\">") + L[precinct.number.length > 3 ? 'precint_number' : 'district_precint_number'](precinct.number) + "</span>" + (precinct.number.length > 3 ? " (" + L.district + " " + districts[precinct.id] + ")" : '') + ("	</h3>\n	<p>" + addresses[precinct.id] + "</p>\n	" + text + "\n	" + images + "\n	" + video + "\n	<div class=\"cs-elections-social-links\" data-violation=\"" + violation.id + "\">\n		<a class=\"fb uk-icon-facebook\"></a>\n		<a class=\"vk uk-icon-vk\"></a>\n		<a class=\"tw uk-icon-twitter\"></a>\n	</div>\n</article>");
              }
              if (content) {
                (function() {
                  return last_violations_content.append(content);
                })();
                appended = [];
                for (_j = 0, _len1 = violations.length; _j < _len1; _j++) {
                  violation = violations[_j];
                  appended.push(last_violations_content.children("article[data-id=" + violation.id + "]")[0]);
                  $(".cs-elections-social-links[data-violation=" + violation.id + "]").data('violation', violation);
                }
                last_violations_content.masonry('reloadItems').masonry('layout');
                data_loading = false;
              } else if (!last_id) {
                last_violations_content.masonry('destroy').html("<p class=\"uk-text-center\">" + L.empty + "</p>");
                data_loading = false;
              }
              cs.elections.loading('hide');
              if (last_violations_panel[0].scrollHeight === last_violations_panel.outerHeight()) {
                return find_violations();
              }
            },
            error: function() {
              if (!last_id) {
                console.error('Precincts addresses loading error');
                data_loading = false;
              }
              return cs.elections.loading('hide');
            }
          });
        },
        error: function() {
          if (!last_id) {
            last_violations_content.masonry('destroy').html("<p class=\"uk-text-center\">" + L.empty + "</p>");
            data_loading = false;
          }
          return cs.elections.loading('hide');
        }
      });
    };
    (function() {
      var interval;
      return interval = setInterval((function() {
        if (cs.elections.get_precincts(true)) {
          clearInterval(interval);
          return last_violations_button.click();
        }
      }), 100);
    })();
    search_timeout = 0;
    last_search_value = '';
    last_violations_search.keydown(function() {
      if (last_violations_button.is('.cs-elections-last-violations')) {
        return;
      }
      clearTimeout(search_timeout);
      return search_timeout = setTimeout((function() {
        var value;
        value = last_violations_search.val();
        if (value === last_search_value || (value.length < 3 && last_search_value.length < 3)) {
          return;
        }
        last_search_value = value;
        last_violations_content.masonry('destroy').html('').masonry({
          columnWidth: 280,
          gutter: 20,
          itemSelector: 'article',
          transitionDuration: 0
        });
        data_loading = false;
        return find_violations();
      }), 300);
    });
    return last_violations_panel.on('click', 'img', function() {
      return $("<div>\n	<div style=\"text-align: center; width: 90%;\">\n		" + this.outerHTML + "\n	</div>\n</div>").appendTo('body').cs().modal('show').click(function() {
        return $(this).hide();
      }).on('uk.modal.hide', function() {
        return $(this).remove();
      });
    }).on('click', 'article[data-id] h3 span', function() {
      var id, precinct;
      id = $(this).data('id');
      cs.elections.open_precinct(id);
      precinct = cs.elections.get_precincts()[id];
      return map.panTo([precinct.lat, precinct.lng]).then(function() {
        return map.zoomRange.get([precinct.lat, precinct.lng]).then(function(zoomRange) {
          return map.setZoom(zoomRange[1], {
            duration: 500
          });
        });
      });
    }).scroll(function() {
      if (!data_loading && last_violations_panel[0].scrollHeight - last_violations_panel.outerHeight() - last_violations_panel.scrollTop() < 200) {
        return find_violations();
      }
    });
  });

}).call(this);
