// Generated by CoffeeScript 1.4.0

/**
 * @package		CleverStyle CMS
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) 2011-2014, Nazar Mokrynskyi
 * @license		MIT License, see license.txt
*/


(function() {
  var __hasProp = {}.hasOwnProperty;

  $(function() {
    var L;
    L = cs.Language;
    cs.async_call([
      function() {
        window.session_id = cs.getcookie('session');
        return $.ajaxSetup({
          type: 'post',
          data: {
            session: session_id
          },
          error: function(xhr) {
            if (xhr.responseText) {
              return alert(cs.json_decode(xhr.responseText).error_description);
            } else {
              return alert(L.connection_error);
            }
          }
        });
      }, function() {
        var key, translation;
        for (key in L) {
          if (!__hasProp.call(L, key)) continue;
          translation = L[key];
          L[key] = (function(translation) {
            var result;
            result = function() {
              return vsprintf(translation, Array.prototype.slice.call(arguments));
            };
            result.toString = function() {
              return translation;
            };
            return result;
          })(translation);
        }
        L.get = function(key) {
          return L[key].toString();
        };
        L.format = function(key) {
          return L[key](arguments[1]);
        };
      }, function() {
        return $('form:not(.cs-no-ui)').addClass('uk-form');
      }, function() {
        return $('input:radio:not(.cs-no-ui)').cs().radio();
      }, function() {
        return $('input:checkbox:not(.cs-no-ui)').cs().checkbox();
      }, function() {
        return $('.cs-table').addClass('uk-table uk-table-condensed uk-table-hover');
      }, function() {
        return $(':button:not(.cs-no-ui), .cs-button, .cs-button-compact').addClass('uk-button').disableSelection();
      }, function() {
        return $('.cs-dialog').cs().modal();
      }, function() {
        return $('textarea:not(.cs-no-ui)').not('.cs-no-resize, .EDITOR, .SIMPLE_EDITOR').autosize({
          append: "\n"
        });
      }, function() {
        return $('.SIMPLEST_INLINE_EDITOR').prop('contenteditable', true);
      }, function() {
        return $('[data-title]').cs().tooltip();
      }, function() {
        return $('.cs-tabs').cs().tabs();
      }, function() {
        $('.cs-header-sign-in-slide').click(function() {
          $('.cs-header-guest-form').hide('medium');
          $('.cs-header-sign-in-form').show('medium');
          return $('.cs-header-sign-in-email').focus();
        });
        $('.cs-header-registration-slide').click(function() {
          $('.cs-header-guest-form').hide('medium');
          $('.cs-header-registration-form').show('medium');
          return $('.cs-header-registration-email').focus();
        });
        $('.cs-header-restore-password-slide').click(function() {
          $('.cs-header-sign-in-form, .cs-header-registration-form').hide('medium');
          $('.cs-header-restore-password-form').show('medium');
          return $('.cs-header-restore-password-email').focus();
        });
        $('.cs-header-sign-in-email, .cs-header-user-password').keyup(function(event) {
          if (event.which === 13) {
            return $('.cs-header-sign-in-process').click();
          }
        });
        $('.cs-header-registration-email').keyup(function(event) {
          if (event.which === 13) {
            return $('.cs-header-registration-process').click();
          }
        });
        $('.cs-header-sign-in-process').click(function() {
          return cs.sign_in($('.cs-header-sign-in-email').val(), $('.cs-header-user-password').val());
        });
        $('.cs-header-sign-out-process').click(function() {
          return cs.sign_out();
        });
        $('.cs-show-password').click(function() {
          var $this, pass_input;
          $this = $(this);
          pass_input = $this.parent().next().children('input');
          if (pass_input.prop('type') === 'password') {
            pass_input.prop('type', 'text');
            return $this.addClass('uk-icon-unlock-alt').removeClass('uk-icon-lock');
          } else {
            pass_input.prop('type', 'password');
            return $this.addClass('uk-icon-lock').removeClass('uk-icon-unlock-alt');
          }
        });
        $('#current_password').click(function() {
          var $this, password;
          $this = $(this);
          password = $('.cs-profile-current-password');
          if (password.prop('type') === 'password') {
            password.prop('type', 'text');
            return $this.addClass('uk-icon-unlock-alt').removeClass('uk-icon-lock');
          } else {
            password.prop('type', 'password');
            return $this.addClass('uk-icon-lock').removeClass('uk-icon-unlock-alt');
          }
        });
        $('#new_password').click(function() {
          var $this, password;
          $this = $(this);
          password = $('.cs-profile-new-password');
          if (password.prop('type') === 'password') {
            password.prop('type', 'text');
            return $this.addClass('uk-icon-unlock-alt').removeClass('uk-icon-lock');
          } else {
            password.prop('type', 'password');
            return $this.addClass('uk-icon-lock').removeClass('uk-icon-unlock-alt');
          }
        });
        $('.cs-header-registration-process').click(function() {
          var modal;
          if (!cs.rules_text) {
            cs.registration($('.cs-header-registration-email').val());
            return;
          }
          modal = $("<div title=\"" + L.rules_agree + "\">\n	<div>\n		" + cs.rules_text + "\n		<p class=\"cs-right\">\n			<button class=\"cs-registration-continue uk-button uk-button-primary\">" + L.yes + "</button>\n		</p>\n	</div>\n</div>").appendTo('body').cs().modal('show').on('uk.modal.hide', function() {
            return $(this).remove();
          });
          return modal.find('.cs-registration-continue').click(function() {
            modal.cs().modal('close').remove();
            return cs.registration($('.cs-header-registration-email').val());
          });
        });
        $('.cs-header-restore-password-process').click(function() {
          return cs.restore_password($('.cs-header-restore-password-email').val());
        });
        $('.cs-profile-change-password').click(function() {
          return cs.change_password($('.cs-profile-current-password').val(), $('.cs-profile-new-password').val());
        });
        return $('.cs-header-back').click(function() {
          $('.cs-header-guest-form').show('medium');
          return $('.cs-header-registration-form, .cs-header-sign-in-form, .cs-header-restore-password-form').hide('medium');
        });
      }, function() {
        if (cs.in_admin) {
          $('.cs-reload-button').click(function() {
            return location.reload();
          });
          $('#change_theme, #change_color_scheme, #change_language').click(function() {
            return $('#apply_settings').click();
          });
          $('#change_active_languages').change(function() {
            return $(this).find("option[value='" + $('#change_language').val() + "']").prop('selected', true);
          });
          $('#cs-system-license-open').click(function() {
            return $('#cs-system-license').cs().modal('show');
          });
          $('.cs-permissions-invert').click(function() {
            return $(this).parentsUntil('div').find(':radio:not(:checked)[value!=-1]').prop('checked', true).change();
          });
          $('.cs-permissions-allow-all').click(function() {
            return $(this).parentsUntil('div').find(':radio[value=1]').prop('checked', true).change();
          });
          $('.cs-permissions-deny-all').click(function() {
            return $(this).parentsUntil('div').find(':radio[value=0]').prop('checked', true).change();
          });
          $('#cs-users-search-columns').selectable({
            stop: function() {
              var li, result;
              result = [];
              li = $(this).children('li');
              li.filter('.uk-button-primary:not(.ui-selected)').removeClass('uk-button-primary');
              li.filter('.ui-selected').addClass('uk-button-primary').each(function() {
                return result.push($(this).text().trim());
              });
              return $('#cs-users-search-selected-columns').val(result.join(';'));
            }
          });
          $('#block_users_search').keyup(function(event) {
            if (event.which !== 13) {
              return;
            }
            $('.cs-block-users-changed').removeClass('cs-block-users-changed').appendTo('#cs-block-users-changed-permissions').each(function() {
              var found, id;
              id = $(this).find(':radio:first').attr('name');
              found = $('#cs-block-users-search-found');
              return found.val(found.val() + ',' + id.substring(6, id.length - 1));
            });
            return $.ajax({
              url: "" + cs.current_base_url + "/" + cs.route[0] + "/" + cs.route[1] + "/search_users",
              data: {
                found_users: $('#cs-block-users-search-found').val(),
                permission: $(this).attr('permission'),
                search_phrase: $(this).val()
              },
              success: function(result) {
                return $('#block_users_search_results').html(result).find(':radio').cs().radio().change(function() {
                  return $(this).parentsUntil('tr').parent().addClass('cs-block-users-changed');
                });
              }
            });
          }).keydown(function(event) {
            return event.which !== 13;
          });
          $('#cs-top-blocks-items, #cs-left-blocks-items, #cs-floating-blocks-items, #cs-right-blocks-items, #cs-bottom-blocks-items').disableSelection().sortable({
            connectWith: '.cs-blocks-items',
            items: 'li:not(:first)',
            cancel: ':first',
            stop: function() {
              return $('#cs-blocks-position').val(cs.json_encode({
                top: $('#cs-top-blocks-items').sortable('toArray'),
                left: $('#cs-left-blocks-items').sortable('toArray'),
                floating: $('#cs-floating-blocks-items').sortable('toArray'),
                right: $('#cs-right-blocks-items').sortable('toArray'),
                bottom: $('#cs-bottom-blocks-items').sortable('toArray')
              }));
            }
          });
          $('#cs-users-groups-list, #cs-users-groups-list-selected').disableSelection().sortable({
            connectWith: '#cs-users-groups-list, #cs-users-groups-list-selected',
            items: 'li:not(:first)',
            cancel: ':first',
            stop: function() {
              var selected;
              $('#cs-users-groups-list').find('.uk-alert-success').removeClass('uk-alert-success').addClass('uk-alert-warning');
              selected = $('#cs-users-groups-list-selected');
              selected.find('.uk-alert-warning').removeClass('uk-alert-warning').addClass('uk-alert-success');
              return $('#cs-user-groups').val(cs.json_encode(selected.sortable('toArray')));
            }
          });
          return $('#auto_translation_engine').find('select').change(function() {
            return $('#auto_translation_engine_settings').html(cs.base64_decode($(this).children(':selected').data('settings')));
          });
        }
      }, function() {
        var cookie, i;
        if (cookie = cs.getcookie('setcookie')) {
          for (i in cookie) {
            if (!__hasProp.call(cookie, i)) continue;
            $.post(cookie[i]);
          }
          return cs.setcookie('setcookie', '');
        }
      }
    ]);
  });

}).call(this);
