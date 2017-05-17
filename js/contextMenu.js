/**
 * Created by rowthan on 2017/5/12.
 */
function CreateContextMenus(enableContextMenu) {
    chrome.contextMenus.removeAll();
    if (enableContextMenu) {
        chrome.contextMenus.create({
            id: 'clear-cache',
            title: '刷新页面（清除缓存）',
            contexts: ['page']
        });
    }
    else{
        chrome.contextMenus.removeAll();
    }
}
CreateContextMenus(true);

chrome.contextMenus.onClicked.addListener((function (info) {
    if (info.menuItemId === 'clear-cache') {
        chrome.tabs.query({active: true}, function (tab){
            clearCache(tab);
        });
    }
}));