const NodeHelper = require("node_helper");
const mysql = require('mysql'); // MySQL 연결을 위한 모듈

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node_helper for module: MMM-randomClothes");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FETCH_RANDOM_CLOTHES") {
            this.fetchRandomClothes();
        }
    },

    fetchRandomClothes: function() {
        // MySQL DB 연결 설정
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '0000',
            database: 'mirrordb'
        });

        // DB 연결
        connection.connect();

        // 랜덤 옷 정보 쿼리
        const query = "SELECT mood, color, season, image FROM CLOTHES ORDER BY RAND() LIMIT 1";

        connection.query(query, (error, results, fields) => {
            if (error) {
                console.error("Error fetching data:", error);
                return;
            }
            if (results.length > 0) {
                const randomClothes = {
                    mood: results[0].mood,
                    color: results[0].color,
                    season: results[0].season,
                    image: this.convertBlobToBase64(results[0].image) // BLOB 데이터를 Base64로 변환
                };
                this.sendSocketNotification("RANDOM_CLOTHES_RESULT", randomClothes);
            }
        });

        connection.end();
    },

    convertBlobToBase64: function(blob) {
        // BLOB 데이터를 Base64 문자열로 변환
        const buffer = Buffer.from(blob); // BLOB 데이터를 Buffer로 변환
        return buffer.toString('base64'); // Base64로 인코딩하여 반환
    }
});
