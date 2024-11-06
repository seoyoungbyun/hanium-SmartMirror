Module.register("MMM-Photo", {
    defaults: {
        message: "사진을 전송 후 눌러주세요."
    },

    start: function() {
        this.photo = null;
        this.season = '';
        this.mood = '';
        this.type = '';
        this.photoSent = false;
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // "사진전송" 버튼은 항상 표시합니다.
        var button = document.createElement("button");
        button.innerHTML = "사진전송완료";
        button.className = "photo-button";
        button.addEventListener("click", () => {
            this.sendSocketNotification("REQUEST_PHOTO");
        });

        wrapper.appendChild(button);

        // 사진, 계절, 분위기, 타입을 보여주는 영역
        var infoWrapper = document.createElement("div");
        infoWrapper.className = "photo-info";
        infoWrapper.innerHTML = `
            <p>${this.config.message}</p>
            <p>계절: ${this.season || '없음'}</p>
            <p>분위기: ${this.mood || '없음'}</p>
            <p>상하의: ${this.type || '없음'}</p>
        `;
        wrapper.appendChild(infoWrapper);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "PHOTO_RECEIVED") {
            this.photo = payload.photo;
            this.season = payload.season;
            this.mood = payload.mood;
            this.type = payload.type;
            this.updateDom();

            // 계절과 분위기 알림 표시
            this.receiveSelection(this.season, this.mood, this.type);

            
            // 타입이 '상의'인 경우 추가 처리
            if (this.type === '상의') {
                console.log("타입이 상의입니다.");
            }

            // 데이터베이스에 삽입
            this.sendSocketNotification("SAVE_PHOTO_DATA", {
                season: this.season,
                mood: this.mood,
                type: this.type,
                photo: this.photo
            });
        }
    },

    getStyles: function() {
        return ["MMM-Photo.css"];
    },

    receiveSelection: function(season, mood, type) {
        this.sendNotification("SHOW_ALERT", {
            type: "notification",
            message: `계절: ${season}\n분위기: ${mood}\n상하의: ${type}`
            
        });
        this.updateDom();
    }

});

