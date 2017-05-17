/**
 * Created by rowthan on 2017/5/12.
 */
var NotificationHandler = {
    isNotificationSupported: 'Notification' in window,
    isPermissionGranted: function() {
        return Notification.permission === 'granted';
    },
    requestPermission: function() {
        if (!this.isNotificationSupported) {
            console.log('the current browser does not support Notification API');
            return;
        }

        Notification.requestPermission(function(status) {
            //status是授权状态，如果用户允许显示桌面通知，则status为'granted'
            console.log('status: ' + status);

            //permission只读属性
            var permission = Notification.permission;
            //default 用户没有接收或拒绝授权 不能显示通知
            //granted 用户接受授权 允许显示通知
            //denied  用户拒绝授权 不允许显示通知

            console.log('permission: ' + permission);
        });
    },
    showNotification: function() {
        if (!this.isNotificationSupported) {
            console.log('the current browser does not support Notification API');
            return;
        }
        if (!this.isPermissionGranted()) {
            console.log('the current page has not been granted for notification');
            return;
        }

        var n = new Notification("sir, you got a message", {
            icon: 'img/icon.png',
            body: 'you will have a meeting 5 minutes later.'
        });

        //onshow函数在消息框显示时会被调用
        //可以做一些数据记录及定时操作等
        n.onshow = function() {
            console.log('notification shows up');
            //5秒后关闭消息框
            setTimeout(function() {
                n.close();
            }, 5000);
        };

        //消息框被点击时被调用
        //可以打开相关的视图，同时关闭该消息框等操作
        n.onclick = function() {
            alert('open the associated view');
            //opening the view...
            n.close();
        };

        //当有错误发生时会onerror函数会被调用
        //如果没有granted授权，创建Notification对象实例时，也会执行onerror函数
        n.onerror = function() {
            console.log('notification encounters an error');
            //do something useful
        };

        //一个消息框关闭时onclose函数会被调用
        n.onclose = function() {
            console.log('notification is closed');
            //do something useful
        };
    }
};