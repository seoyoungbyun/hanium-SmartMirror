Module.register("MMM-FileDisplay", {
    defaults: {
        filePath: "/home/mirror/result.txt",
        refreshInterval: 5000, //5초 간격
    },

    start: function() {
        this.scheduleUpdate();
    },

    scheduleUpdate: function() {
        this.updateDom();
        setInterval(() => {
            this.sendSocketNotification("GET_FILE_CONTENT", this.config.filePath);
        }, this.config.refreshInterval);
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = 'file-display'; // 모듈에 클래스를 추가하여 스타일링

        var result = document.createElement("div");
        result.id = "result";
        result.innerHTML = "로딩 중..."; // 초기 로딩 메시지
        wrapper.appendChild(result);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FILE_CONTENT") {
            var resultText;
            switch(payload.trim()) {
                case "largeTri":
                    resultText = "큰삼각형";
                    break;
                case "inverTri":
                    resultText = "역삼각형";
                    break;
                case "square":
                    resultText = "사각형";
                    break;
                default:
                    resultText = "null";
                    break;
            }
            document.getElementById("result").innerHTML = resultText;
        }
    },

    getStyles: function() {
        return ["MMM-FileDisplay.css"];
    }
});
