Module.register("MMM-ShowImage", {
    defaults: {
        imagePath: "/home/mirror/MagicMirror/up/hood.png"
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // 버튼 추가
        var button = document.createElement("button");
        button.id = "showImageButton";
        button.innerHTML = "Show Image";
        
        // 버튼 스타일 설정
        button.style.position = "fixed";
        button.style.top = "50%";
        button.style.right = "10px";
        button.style.zIndex = "9999";  // 높은 z-index 설정
        button.style.padding = "10px 20px";  // 버튼의 패딩을 설정하여 클릭 영역을 더 크게
        button.style.cursor = "pointer";  // 커서가 버튼에 올 때 손가락 모양으로 변경
        
        wrapper.appendChild(button);

        // 이미지 추가
        this.imageWrapper = document.createElement("div");
        wrapper.appendChild(this.imageWrapper);

        // 버튼 클릭 이벤트 추가
        var self = this;
        button.addEventListener("click", function() {
            console.log("Button clicked!"); // 콘솔 로그 출력
            self.sendNotification("SHOW_IMAGE");
        });

        return wrapper;
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "SHOW_IMAGE") {
            console.log("Showing image with path:", this.config.imagePath); // 경로 로그 출력
            this.imageWrapper.innerHTML = "<img src='" + this.config.imagePath + "' style='max-width:100%; height: auto;'>";
        }
    }
});
Module.register("MMM-ShowImage", {
    defaults: {
        imagePath: "/home/mirror/MagicMirror/up/1.png"
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // 버튼 추가
        var button = document.createElement("button");
        button.id = "showImageButton";
        button.innerHTML = "Show Image";
        
        // 버튼 스타일 설정
        button.style.position = "fixed";
        button.style.top = "50%";
        button.style.right = "10px";
        button.style.zIndex = "9999";  // 높은 z-index 설정
        button.style.padding = "10px 20px";  // 버튼의 패딩을 설정하여 클릭 영역을 더 크게
        button.style.cursor = "pointer";  // 커서가 버튼에 올 때 손가락 모양으로 변경
        
        wrapper.appendChild(button);

        // 이미지 추가
        this.imageWrapper = document.createElement("div");
        wrapper.appendChild(this.imageWrapper);

        // 버튼 클릭 이벤트 추가
        var self = this;
        button.addEventListener("click", function() {
            console.log("Button clicked!"); // 콘솔 로그 출력
            self.sendNotification("SHOW_IMAGE");
        });

        return wrapper;
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "SHOW_IMAGE") {
            console.log("Showing image with path:", this.config.imagePath); // 경로 로그 출력
            this.imageWrapper.innerHTML = "<img src='" + this.config.imagePath + "' style='max-width:100%; height: auto;'>";
        }
    }
});
