var NodeHelper = require("node_helper");
var fs = require("fs");

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_TEXT") {
            var self = this;
            fs.readFile(payload, "utf8", function(err, data) {
                if (err) {
                    self.sendSocketNotification("TEXT_CONTENT", "Error reading file: " + payload);
                } else {
                    self.sendSocketNotification("TEXT_CONTENT", data);
                }
            });
        }
    }
});
