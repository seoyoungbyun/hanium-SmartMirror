Module.register("MMM-ClosetButton", {
    // 모듈 기본 정보
    defaults: {
        text: "옷장"
    },

    getDom: function() {
        // 버튼 생성
        var wrapper = document.createElement("div");
        var button = document.createElement("button");
        button.className = "closet-button";

        button.innerHTML = this.config.text;
        button.onclick = () => {
            window.location.href = "http://localhost:3000/closet/closet.html";
        };
        wrapper.appendChild(button);
        return wrapper;
    },

    getStyles: function() {
        return ["MMM-ClosetButton.css"]
    }
});
