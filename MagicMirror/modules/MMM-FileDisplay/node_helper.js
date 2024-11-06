const NodeHelper = require('node_helper');
const fs = require('fs');

module.exports = NodeHelper.create({
    start: function () {
        console.log('Node helper for MMM-FileDisplay is started!');
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_FILE_CONTENT') {
            const filePath = payload;
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    this.sendSocketNotification('FILE_CONTENT', '파일 읽기 오류');
                    return;
                }
                this.sendSocketNotification('FILE_CONTENT', data);
            });
        }
    }
});
