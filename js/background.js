(function() {
  chrome.browserAction.onClicked.addListener(function(tab) {
    clearCache(tab);
  });
  function openOptions() {
    if (localStorage['first_run'] !== 'true') {
      return;
    }
    var optionsUrl = chrome.extension.getURL('options.html');
    chrome.tabs.create({
      url: optionsUrl + '#first-run'
    });
  }
  openOptions();
})();
