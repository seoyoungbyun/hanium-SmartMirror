Module.register("MMM-TextDisplay", {
    defaults: {
        updateInterval: 5000, // 업데이트 주기 (밀리초 단위)
        filePath: "/home/mirror/result.txt" // 텍스트 파일 경로
    },

    start: function() {
        this.content = "Loading...";
        this.getData();
        this.scheduleUpdate();
    },

    getData: function() {
        this.sendSocketNotification("GET_TEXT", this.config.filePath);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TEXT_CONTENT") {
            this.content = payload;
            this.updateDom();
        }
    },

    scheduleUpdate: function() {
        var self = this;
        setInterval(function() {
            self.getData();
        }, this.config.updateInterval);
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "MMM-TextDisplay";
        wrapper.innerHTML = this.content.replace(/\n/g, "<br>");
        return wrapper;
    }
});
