/**
 * Created by rowthan on 2017/5/12.
 */
var timeout = NaN;

function clearCache(tab) {
    var clearTimes = parseInt(localStorage['clearTimes']);
    localStorage['clearTimes'] = clearTimes+1;
    var dataToRemove = JSON.parse(localStorage['data_to_remove']);
    var timeperiod = parseTimeperiod(localStorage['timeperiod']);
    var cookieSettings = JSON.parse(localStorage['cookie_settings']);
    var autorefresh = localStorage['autorefresh'] == 'true';
    if (dataToRemove.cookies && cookieSettings && cookieSettings.filters &&
        cookieSettings.filters.length > 0) {
        dataToRemove.cookies = false;
        removeCookies(cookieSettings.filters, cookieSettings.inclusive);
    }
    // new API since Chrome Dev 19.0.1055.1
    if (chrome['browsingData'] && chrome['browsingData']['removeAppcache']) {
        chrome.browsingData.remove({
            'since': timeperiod
        }, dataToRemove, function() {
            startTimeout(function() {
                chrome.browserAction.setBadgeText({
                    text: ""
                });
                chrome.browserAction.setPopup({
                    popup: ""
                });
            }, 500);
        });
        // new API since Chrome Dev 19.0.1049.3
    } else if (chrome['experimental'] && chrome['experimental'][
            'browsingData'
            ] && chrome.experimental['browsingData']['removeAppcache']) {
        chrome.experimental.browsingData.remove({
            'since': timeperiod
        }, dataToRemove, function() {
            startTimeout(function() {
                chrome.browserAction.setBadgeText({
                    text: ""
                });
                chrome.browserAction.setPopup({
                    popup: ""
                });
            }, 500);
        });

    } else if (chrome['experimental']['browsingData']) {
        // new API since Chrome Dev 19.0.1041.0
        chrome.experimental.browsingData.remove(timeperiod, dataToRemove,
            function() {
                startTimeout(function() {
                    chrome.browserAction.setBadgeText({
                        text: ""
                    });
                    chrome.browserAction.setPopup({
                        popup: ""
                    });
                }, 500);
            });

    } else if (chrome['experimental']) {
        // old API
        chrome['experimental'].clear.browsingData(timeperiod, dataToRemove,
            function() {
                startTimeout(function() {
                    chrome.browserAction.setBadgeText({
                        text: ""
                    });
                    chrome.browserAction.setPopup({
                        popup: ""
                    });
                }, 500);
            });
    } else {
        console.error(
            "No matching API found! (Really old browser version?)");
    }

    // reload current tab
    if (autorefresh && tab) {
        chrome.tabs.reload(tab.id);
    }
}

function refreshOne(dataToRemove){
   /* 通过以下api不能正确获取tab
   chrome.tabs.query({active: true}, function (tab){

    });
    */
   /* chrome.tabs.getCurrent(function (currentTab){
        tab = currentTab;
        console.log(tab.id);
    });*/
    var timeperiod = parseTimeperiod(localStorage['timeperiod']);
    var autorefresh = localStorage['autorefresh'] == 'true';
    chrome.browsingData.remove({
        'since': timeperiod
    }, dataToRemove, function() {
        startTimeout(function() {
            chrome.browserAction.setBadgeText({
                text: ""
            });
            chrome.browserAction.setPopup({
                popup: ""
            });
        }, 500);
    });
    if (autorefresh) {
        location.reload();
    }
}

/**
 * @param {Array.<String>} filters
 * @param {boolean} inclusive
 */
function removeCookies(filters, inclusive) {
    // only delete the domains in filters
    if (inclusive) {
        $.each(filters, function(filterIndex, filterValue) {
            chrome.cookies.getAll({
                "domain": filterValue
            }, function(cookies) {
                $.each(cookies, function(cookieIndex, cookie) {
                    removeCookie(cookie);
                });
            });
        });

        // delete all domains except filters
    } else {
        var filterMap = {};
        $.each(filters, function(filterIndex, filterValue) {
            var filterSegments = filterValue.split('.');
            if (filterValue.indexOf(".") != 0 && filterValue.indexOf("http") !=
                0 && filterValue != "localhost" && (filterSegments.length > 2 ||
                filterSegments[2] != 'local')) {
                filterValue = "." + filterValue;
            }
            filterMap[filterValue] = true;
        });

        chrome.cookies.getAll({}, function(cookies) {
            $.each(cookies, function(cookieIndex, cookie) {
                if (filterMap[cookie.domain]) {
                    return;
                }
                removeCookie(cookie);
            });
        });
    }
}

/**
 *
 * @param  {Object} cookie
 */
function removeCookie(cookie) {
    var protocol = cookie.secure ? "https://" : "http://";
    var cookieDetails = {
        "url": protocol + cookie.domain,
        "name": cookie.name
    }
    chrome.cookies.remove(cookieDetails, function(result) {
        //console.log( 'clear results', result );
    });
}

/**
 * @param {string} timeperiod
 * @return {number|string}
 */
function parseTimeperiod(timeperiod) {
    if (!chrome['browsingData'] && !chrome.experimental['browsingData'] && !(
        chrome.experimental['clear'] || chrome.experimental.clear[
            'localStorage'])) {
        return timeperiod;
    }

    switch (timeperiod) {
        case "last_hour":
            return (new Date()).getTime() - 1000 * 60 * 60;
        case "last_day":
            return (new Date()).getTime() - 1000 * 60 * 60 * 24;
        case "last_week":
            return (new Date()).getTime() - 1000 * 60 * 60 * 24 * 7;
        case "last_month":
            return (new Date()).getTime() - 1000 * 60 * 60 * 24 * 7 * 4;
        case "anyTime":
        default:
            return 0;
    }

}

function startTimeout(handler, delay) {
    stopTimeout();
    timeout = setTimeout(handler, delay);
}

function stopTimeout() {
    if (!isNaN(timeout)) {
        return;
    }
    clearTimeout(timeout);
}