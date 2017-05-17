(function() {
  $(document).ready(function() {
    var timeperiod = localStorage['timeperiod'];
    var dataToRemove = JSON.parse(localStorage['data_to_remove']);
    var cookieSettings = JSON.parse(localStorage['cookie_settings']);
    var autorefresh = localStorage['autorefresh'] == 'true' || false;
    var numTimesOptionsViewed = parseInt(localStorage['num_times_options_viewed']);
    var shouldHideDonateMessage = numTimesOptionsViewed > 2 || localStorage['hide_donate_message'] == 'true';
    var isFirstRun = window.location.hash.indexOf('first-run') !== -1;
    var contextMenuSwitch = localStorage['contextMenuSwitch'];
    if(isFirstRun){
      alert("初次使用，多多关照！")
    }
    window.location.hash = '';
    localStorage['num_times_options_viewed'] = numTimesOptionsViewed + 1;

    /**
     * Hotfix: 'originBoundCertificates' is not supported any more
     */
    if (dataToRemove['originBoundCertificates']) {
      delete dataToRemove['originBoundCertificates'];
      saveSettings();
    }

    /**
     * Support for opening the extensions overview page
     */
    $(".extensions-link").click(function() {
      var url = event.currentTarget.href;
      if (url) {
        try {
          chrome.tabs.update({
            url: url
          });
        } catch (error) {
            console.log(error)
        }
      }
    });

    /**
     * Parse time periods
     */
    $("input[name='timeperiod']").each(function() {
      var element = $(this);
      var period = element.attr("value");
      element.prop('checked', period == timeperiod);
      element.change(function() {
        timeperiod = period;
        saveSettings();
      });
    });

    /**
     * Parse data_to_remove
     */
    $("input[name='data_to_remove']").each(function() {
      var element = $(this);
      var dataType = element.attr("value");
      element.prop('checked', dataToRemove[dataType]);
      element.change(function() {
        var value = element.prop('checked');
        dataToRemove[dataType] = value;
        saveSettings();
      });
    });

    /**
     * Parse autorefresh
     */
    $("input[name='autorefresh']")
      .prop('checked', autorefresh == true)
      .change(function() {
        var value = $(this).prop('checked');
        autorefresh = value;
        saveSettings();
      });

    /**contextMenu add**/
    $("input[name='contextMenuSwitch']").each(function () {
        var element = $(this);
        var switchValue = element.attr("value");
        element.prop("checked",switchValue==contextMenuSwitch);
        element.change(function () {
            contextMenuSwitch = switchValue;
            CreateContextMenus(contextMenuSwitch=='true');
            saveSettings();
        })
    });

      /***
       * cookie
       */
    $("a[href*='#cookie-filters'").click(function(event) {
      event.preventDefault();
      var listItem = $(this).closest("li");
      //在listItem中寻找aside
      var suboptions = $("aside", listItem);
      suboptions.slideToggle();
      return false;
    });
    $("a.toggle-setting").click(function (event) {
        event.preventDefault();
        var id = event.target.hash;
        $(id).slideToggle();
        return false;
    })

    /**
     * Add new cookie filter
     */
    $("#cookie-filters a.add").click(function(event) {
      event.preventDefault();
      addCookieFilter('', true);
      return false;
    });

    /**
     * Remove cookie filter
     */
    function removeCookieFilter(event) {
      event.preventDefault();
      var listItem = $(this).closest("li");
      listItem.addClass("hidden");
      saveFilters();
      listItem.closest("li").delay(200).slideUp(150, function() {
        $(this).remove();
      });
      return false;
    }

    $("#cookie-filters a.remove").click(removeCookieFilter);

    /**
     * Add cookie filter
     */
    function addCookieFilter(value, focus) {
      value = value || "";
      var list = $("#cookie-filters ol");
      var listItem = $('<li class="suboption hidden"><input type="text" value="' + value + '" placeholder="e.g. \'.domain.com\' or \'sub.domain.com\'" /><a href="#" class="remove">'+chrome.i18n.getMessage("remove")+'</a></li>');
      list.append(listItem);
      listItem.hide();
      listItem.fadeIn(100, function() {
        listItem.removeClass("hidden");
        if (focus) {
          $("input", listItem).focus();
        }
      });
      listItem.find('a.remove').click(removeCookieFilter);
      listItem.find("input[type='text']")
        .on('blur', {
          "validate": true
        }, saveFilters)
        .on('change', {
          "validate": true
        }, saveFilters)
        .on('keyup', {
          "validate": false
        }, saveFilters);
      return listItem;
    }

    /**
     * Save cookie filters
     */
    function saveFilters(event) {
      var filters = [];

      $("#cookie-filters input[type='text']").each(function() {

        // skip filters that are being removed
        if ($(this).closest("li").hasClass("hidden")) {
          return;
        }

        var filter = this.value;

        if (!filter || filter == '' || filter.length < 3) {
          return;
        }

        if (!event || event.data.validate) {
          $(this).removeClass("error");

          var segments = filter.split(".");

          // error
          if (segments.length <= 1 && filter != "localhost") {
            $(this).addClass("error");
            return;

            // success
          } else {

            if (segments.length == 2 && segments[1] != "local") {
              filter = "." + filter;
            }

            this.value = filter;
          }
        }

        filters.push(filter);

      });

      cookieSettings.filters = filters;
      saveSettings();
    }

    $("#cookies_filter_inclusive_yes, #cookies_filter_inclusive_no").change(function() {
      cookieSettings.inclusive = $("#cookies_filter_inclusive_yes").is(":checked");
      saveSettings();
    });

    $("a[href*='#hide-donation'").click(function(event){
      event.preventDefault();
      hideDonateMessage();
      return false;
    });


    /**
     * init
     */
    timeperiod = timeperiod || timeperiods[0];
    $("input[value='" + timeperiod + "']").prop('checked', true);

    $.each(cookieSettings.filters, function(index, value) {
      addCookieFilter(value);
    });

    if (cookieSettings.inclusive) {
      $("#cookies_filter_inclusive_yes").prop('checked', true);
    } else {
      $("#cookies_filter_inclusive_no").prop('checked', true);
    }

    /**
     * Helpers
     */
    function saveSettings() {
      localStorage['data_to_remove'] = JSON.stringify(dataToRemove);
      localStorage['timeperiod'] = timeperiod;
      localStorage['autorefresh'] = autorefresh;
      localStorage['hide_donate_message'] = shouldHideDonateMessage;
      localStorage['cookie_settings'] = JSON.stringify(cookieSettings);
      localStorage['contextMenuSwitch'] = contextMenuSwitch;
    }
    
    function hideDonateMessage() {
      shouldHideDonateMessage = true;
      saveSettings();
      $("#donate-message").slideUp(150);
    }

    /**
     * Based on http://daringfireball.net/2010/07/improved_regex_for_matching_urls
     */
    function validateUrl(url) {
      var regex = /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i;
      return url.match(regex);
    }
    $("button.refreshOne").click(function (event) {
        var value = event.currentTarget.value;
        var dataToRemove = {};
        dataToRemove[value] = true;
        refreshOne(dataToRemove);
    });
    
    function customStyle(style) {
        $("body").css({"background":style.backgroundColor || "#c8f28b"});
    }

    var backgroundColor = JSON.parse(localStorage["custom_style"]);
    customStyle(backgroundColor);
  });
})();
