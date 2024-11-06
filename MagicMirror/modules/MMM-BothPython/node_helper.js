var NodeHelper = require("node_helper");
var fs = require("fs");

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SAVE_INPUT_TO_FILE") {
            var filePath = "/home/mirror/height.txt";
            fs.writeFile(filePath, payload, function(err) {
                if (err) {
                    console.log("Error saving file:", err);
                    this.sendSocketNotification("PYTHON_RESULT", "파일 저장 실패");
                } else {
                    console.log("File saved successfully.");
                    this.sendSocketNotification("PYTHON_RESULT", "파일이 성공적으로 저장되었습니다.");
                }
            });
        }
    }
});
