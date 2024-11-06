const NodeHelper = require('node_helper');
const { parse } = require('node-html-parser');
const { exec } = require('child_process');  // child_process 모듈 추가
const { Console } = require('console');

module.exports = NodeHelper.create({
    start: function() {
        console.log(' NodeHelper started.');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'REQUEST_PHOTO') {
            this.fetchPhoto();
        }
    },

    fetchPhoto: async function() {
        try {
            // node-fetch를 동적으로 가져오기
            const fetch = (await import('node-fetch')).default;

            // 서버에서 사진을 가져오는 요청
            const response = await fetch('http://localhost:3000/last-photo');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // JSON 응답을 받기
            const data = await response.json();
            console.log('서버 응답:', data);

            if (data.photo) {
                // 사진 데이터를 모듈에 전달
                this.sendSocketNotification('PHOTO_RECEIVED', data);
                console.log(data.season);

                // Python 스크립트 실행
                this.runPythonScript(data.type);
                console.log("TEST1");
                this.insertData(data.season, data.mood, data.type);
            }
        } catch (error) {
            console.error('사진 요청 실패:', error);
        }
    },
    //누끼따는 코드
    runPythonScript: function(type) {
        // nukki.py 스크립트를 실행
        const command = `python3 /home/mirror/MagicMirror/nukki.py "${type}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Python 스크립트 실행 오류: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python 스크립트 stderr: ${stderr}`);
                return;
            }
            console.log(`Python 스크립트 실행 결과: ${stdout}`);
        });
    },
    //인자 출력
    insertData: function(season, mood, type) {
        // 인자를 문자열로 변환하여 전달
        const command = `python3 /home/mirror/MagicMirror/PPYY.py "${season}" "${mood}" "${type}"`;
        console.log("test2");
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Python 스크립트 실행 오류: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python 스크립트 stderr: ${stderr}`);
                return;
            }
            console.log(`Python 스크립트 실행 결과: ${stdout}`);
        });
    }
});
