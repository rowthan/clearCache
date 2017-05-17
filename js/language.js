/**
 * Created by rowthan on 2017/5/6.
 */
$('[data-i18n-content]').each(function() {
    var message = chrome.i18n.getMessage(this.getAttribute('data-i18n-content'));
    if(message){
        $(this).html(message);
    }
});
$('[data-i18n-value]').each(function() {
    var message = chrome.i18n.getMessage(this.getAttribute('data-i18n-value'));
    if(message){
        $(this).val(message);
    }
});
$('[data-i18n-title]').each(function() {
    var message = chrome.i18n.getMessage(this.getAttribute('data-i18n-title'));
    if(message){
        $(this).prop('title', message);
    }
});