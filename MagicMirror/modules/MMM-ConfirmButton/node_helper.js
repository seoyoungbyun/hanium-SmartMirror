var NodeHelper = require("node_helper");
var { exec } = require("child_process");
var fs = require("fs"); // 파일 시스템 모듈 추가

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === "RUN_PYTHON_SCRIPT") {
            this.runPythonScript();
        }
    },

    runPythonScript: function() {
        exec("python3 ~/MagicMirror/both.py", (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            // Python 스크립트 실행이 끝난 후 결과 파일 읽기
            this.getResult();
        });
    },

    getResult: function() {
        fs.readFile('/home/mirror/result.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(`File read error: ${err}`);
                this.sendSocketNotification("RESULT_DATA", "파일을 읽는 중 오류가 발생했습니다.");
                return;
            }
            // 읽은 데이터를 클라이언트로 전송
            this.sendSocketNotification("RESULT_DATA", data);
        });
    }
});
