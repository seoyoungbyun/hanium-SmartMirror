const NodeHelper = require("node_helper");
const mysql = require('mysql');
const { exec } = require("child_process");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node_helper for module: MMM-randomClothes");
    },

    socketNotificationReceived: function(notification, payload) {
        console.log("socketNotificationReceived clalling");
        if (notification === "FETCH_RANDOM_CLOTHES") {
            console.log("fetch random");
            this.fetchRandom();
        } else if (notification === "SAVE_CODY") {
            console.log("call saveCody");
            this.saveCody(payload); // 코디 저장
        } else if (notification === "RUN_PYTHON_SCRIPT") { // top_color 존재 여부 확인
            console.log("run python");
            this.runPythonScript(payload.color, payload.season);
        }
    },

    runPythonScript: function(topColor, topSeason) {
        const command = `python3 /home/mirror/MagicMirror/recommend.py "${topColor}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Python 스크립트 실행 오류: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python 스크립트 stderr: ${stderr}`);
                return;
            }
            const bottomColor = stdout.trim(); 
            console.log(bottomColor);
            this.fetchBottomClothes(bottomColor, topSeason); // 하의 색상으로 하의 데이터 가져오기
        });
    },

    fetchBottomClothes: function(bottomColor, topSeason) {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '0000',
            database: 'mirrordb'
        });

        connection.connect();

        // 하의 색상으로 데이터를 가져오는 쿼리
        const query = "SELECT clothes_id, user_id, mood, color, season, image, type FROM CLOTHES WHERE type = 1 AND color = ? AND season = ?";

        connection.query(query, [bottomColor, topSeason], (error, results) => {
            if (error) {
                console.error("Error fetching bottom clothes data:", error);
                return;
            }
            if (results.length > 0) {
                const bottomClothesData = results.map((row) => ({
                    clothes_id: row.clothes_id,
                    user_id: row.user_id,
                    mood: row.mood,
                    color: row.color,
                    season: row.season,
                    image: this.convertBlobToBase64(row.image), // 여기서 BLOB을 Base64로 변환
                    type: row.type
                }));
                this.sendSocketNotification("BOTTOM_CLOTHES_RESULT", bottomClothesData);
            } else {
                console.log("no data bottom");
            }
        });

        connection.end();
    },


    fetchRandom: function() {
    // 터미널 명령어로 파일 내용 읽기
        const readCommand = 'cat /home/mirror/result.txt';

        exec(readCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`파일 읽기 오류: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }

            const type = stdout.trim(); // 파일 내용 저장 및 공백 제거
            console.log(`파일에서 읽은 type: ${type}`);

            // Python 스크립트 실행
            const command = `python3 /home/mirror/MagicMirror/matching_mood.py "${type}"`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Python 스크립트 실행 오류: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Python 스크립트 stderr: ${stderr}`);
                    return;
                }

                const moods = JSON.parse(stdout.trim()); 
                console.log(`받은 mood: ${moods}`);

                this.fetchRandomClothes(moods);
            });
        });
    },


    //상의
    fetchRandomClothes: function(moods) {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '0000',
            database: 'mirrordb'
        });

        connection.connect();

        const mood_sql = moods.map(() => '?').join(', '); 
        const query = "SELECT clothes_id, user_id, mood, color, season, image, type FROM CLOTHES WHERE type IN (0, 1) AND mood IN (?, ?, ?) ORDER BY RAND()";

        connection.query(query, moods, (error, results) => {
            if (error) {
                console.error("Error fetching data:", error);
                return;
            }
            if (results.length > 0) {
                const clothesData = results.map((row) => ({
                    clothes_id: row.clothes_id,
                    user_id: row.user_id,
                    mood: row.mood,
                    color: row.color,
                    season: row.season,
                    image: this.convertBlobToBase64(row.image), // 여기서 BLOB을 Base64로 변환
                    type: row.type
                }));
                console.log(clothesData);
                this.sendSocketNotification("RANDOM_CLOTHES_RESULT", clothesData);
            }
        });
        console.log("done fetch random");
        connection.end();
    },

    saveCody: function(codyData) {
        console.log("saveCody start");
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '0000',
            database: 'mirrordb'
        });

        connection.connect();
        console.log("db connect");
        // 이미지 BLOB으로 변환하여 저장
        const topImageBlob = Buffer.from(codyData.top_img, 'base64');
        const bottomImageBlob = Buffer.from(codyData.bottom_img, 'base64');

        const query = "INSERT INTO CODY (user_id, top_id, bottom_id, top_img, bottom_img) VALUES (?, ?, ?, ?, ?)";
        const values = [codyData.user_id, codyData.top_id, codyData.bottom_id, topImageBlob, bottomImageBlob];

        console.log("Cody check");
        connection.query(query, values, (error, results) => {
            if (error) {
                console.error("Error saving cody data:", error);
                return;
            }
            console.log("Cody data saved:", results);
        });

        connection.end();
    },

    convertBlobToBase64: function(blob) {
        if (!blob) {
            console.error("BLOB data is empty or invalid");
            return null;
        }
        const buffer = Buffer.from(blob); // BLOB 데이터를 Buffer로 변환
        return buffer.toString('base64'); // Base64로 인코딩하여 반환
    }
});
