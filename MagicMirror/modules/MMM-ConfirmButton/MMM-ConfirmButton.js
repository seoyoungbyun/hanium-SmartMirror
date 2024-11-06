Module.register("MMM-ConfirmButton", {
    defaults: {
        buttonText: "촬영",
        message: "곧 촬영이 시작됩니다!"
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "confirm-button-wrapper";
        
        var button = document.createElement("button");
        button.innerHTML = this.config.buttonText;
        button.className = "confirm-button";
        button.onclick = () => {
            this.sendNotification("SHOW_ALERT", {type: "notification", message: this.config.message});
            this.sendSocketNotification("RUN_PYTHON_SCRIPT");
        };

        // 결과를 표시할 컨테이너 생성
        this.resultContainer = document.createElement("div");
        this.resultContainer.className = "result-container";
        this.resultContainer.style.display = "none"; // 처음에는 보이지 않도록 설정

        wrapper.appendChild(button);
        wrapper.appendChild(this.resultContainer);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "RESULT_DATA") {
            console.log("Received result data:", payload); // 디버깅용 콘솔 로그
            this.updateResult(payload);
        }
    },

    updateResult: function(resultData) {
        if (this.resultContainer) {
            this.resultContainer.innerHTML = resultData.replace(/\n/g, "<br>");
            this.resultContainer.style.display = "block"; // 결과가 있을 때만 표시
        }
    },

    getStyles: function() {
        return ["MMM-ConfirmButton.css"];
    },

    // 촬영이 끝난 후 결과를 요청
    notificationReceived: function(notification, payload, sender) {
        if (notification === "SHOW_ALERT") {
            // Python 스크립트 실행 후 결과 요청
            this.sendSocketNotification("GET_RESULT");
        }
    }
});
