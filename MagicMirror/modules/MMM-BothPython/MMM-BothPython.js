Module.register("MMM-BothPython", {
    defaults: {
        buttonText: "확인",
        inputPrompt: "사용자 입력을 입력하세요:",
        resultMessage: "결과가 여기에 표시됩니다."
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        var prompt = document.createElement("p");
        prompt.innerHTML = this.config.inputPrompt;
        wrapper.appendChild(prompt);

        var input = document.createElement("input");
        input.type = "text";
        input.id = "userInput";
        wrapper.appendChild(input);

        var button = document.createElement("button");
        button.innerHTML = this.config.buttonText;
        button.className = "confirm-button";
        button.onclick = () => {
            var userInput = document.getElementById("userInput").value;
            this.sendSocketNotification("SAVE_INPUT_TO_FILE", userInput);
        };
        wrapper.appendChild(button);

        var result = document.createElement("div");
        result.id = "result";
        result.innerHTML = this.config.resultMessage;
        wrapper.appendChild(result);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "PYTHON_RESULT") {
            document.getElementById("result").innerHTML = payload;
        }
    },

    getStyles: function() {
        return ["MMM-BothPython.css"];
    }
});
