/**
 * Created by rowthan on 2017/5/12.
 */
(function () {
    var  h2 = $("section[display!='none']>h2");
    $("#catalog").css({"position":"fixed","top":"200px","background":"#fff"});
    var html;
    h2.each(function () {
        html = html + renderCatalog($(this).text());
    });
    $("#catalog").html(html);
})();

function renderCatalog(text) {
    if(text){
        return "<li class='catalogItem'>"+text+"</li>";
    }
}