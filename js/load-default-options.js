(function(){
  localStorage['first_run'] = localStorage['timeperiod'] == null;
  localStorage['timeperiod'] = localStorage['timeperiod'] || "last_hour";
  localStorage['data_to_remove'] = localStorage['data_to_remove'] || JSON.stringify({"cache":true});
  localStorage['cookie_settings'] = localStorage['cookie_settings']  || JSON.stringify({"inclusive":true,"filters":[]});
  localStorage['num_times_options_viewed'] = parseInt(localStorage['num_times_options_viewed']) || 0;
  localStorage['contextMenuSwitch'] = localStorage['contextMenuSwitch'] || true;
  localStorage['clearTimes'] = localStorage['clearTimes'] || 0 ;
  localStorage['autorefresh'] = localStorage['autorefresh'] || true;
  localStorage['custom_style'] = localStorage['custom_style'] || JSON.stringify({"backgroundColor":"#c8f28b"});
})();