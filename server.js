const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;
const mysql = require('mysql')

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('/home/mirror/MagicMirror/up')); // 파일 저장 위치
    },
    filename: function (req, file, cb) {
   const extension = path.extname(file.originalname);
        cb(null, 'clo' + extension); // 파일 이름 설정
    }
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'mirrordb'
    });

connection.connect((err) => {
    if (err) throw err;
    console.log('MySQL에 연결되었습니다.');
});

// 데이터베이스에서 옷 리스트 가져오기
app.get('/data', (req, res) => {
    connection.query("SELECT * FROM CLOTHES ORDER BY FIELD(season, '봄', '여름', '가을', '겨울'), clothes_id ASC", (err, rows) => {
        if (err) throw err;

        // 이미지 데이터를 base64로 인코딩
        rows.forEach(row => {
            if (row.image) {
                row.image = row.image.toString('base64');
            }
        });
        res.json(rows);
    });
});

// 데이터베이스에서 코디 가져오기
app.get('/cody', (req, res) => {
    connection.query("SELECT * FROM CODY", (err, rows) => {
        if (err) throw err;

        // 이미지 데이터를 base64로 인코딩
        rows.forEach(row => {
            if (row.top_img) {
                row.top_img = row.top_img.toString('base64');
            }
            if (row.bottom_img) {
                row.bottom_img = row.bottom_img.toString('base64');
            }
        });
        res.json(rows);
    });
});

// 옷 삭제 라우트
app.delete('/delete_clothes/:clothesId', (req, res) => {
    const clothesId = req.params.clothesId;
    connection.query('DELETE FROM CLOTHES WHERE clothes_id = ?', [clothesId], (err, result) => {
        if (err) {
            console.error('옷 삭제 중 오류:', err);
            return res.status(500).json({ message: '옷 삭제 중 오류가 발생했습니다.' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '해당 옷 ID가 없습니다.' });
        }

        res.json({ message: '옷이 성공적으로 삭제되었습니다.' });
    });
});

// 코디 삭제 라우트
app.delete('/delete_cody/:codyId', (req, res) => {
    const codyId = req.params.codyId;
    
    connection.query('DELETE FROM CODY WHERE cody_id = ?', [codyId], (err, result) => {
        if (err) {
            console.error('코디 삭제 중 오류:', err);
            return res.status(500).json({ message: '코디 삭제 중 오류가 발생했습니다.' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '해당 코디 ID가 없습니다.' });
        }

        res.json({ message: '코디가 성공적으로 삭제되었습니다.' });
    });
});

// 정적 파일 서비스 - Public 디렉터리를 지정
app.use(express.static(path.join('/home/mirror/Public')));

// 마지막 업로드된 사진 경로와 메타데이터를 저장하는 변수
let lastUploadedPhoto = null;

// 사진 업로드 라우트
app.post('/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        lastUploadedPhoto = {
            photo: `/uploads/${req.file.filename}`,
            season: req.body.season,
            mood: req.body.mood,
       type: req.body.type
        };
        // 업로드 후 경로와 추가 데이터를 JSON으로 응답
        res.json(lastUploadedPhoto);
    } else {
        res.status(400).json({ error: '사진 업로드 실패' });
    }
});

// 마지막 업로드된 사진을 반환하는 라우트
app.get('/last-photo', (req, res) => {
    if (lastUploadedPhoto) {
        res.json(lastUploadedPhoto);
    } else {
        res.status(404).json({ error: '사진이 없습니다' });
    }
});

//basic page
app.get('/', (req, res) => {
    res.sendFile(path.join('/home/mirror/MagicMirror', 'index.html'));
});

//옷장 페이지
app.get('/closet/closet.html', function(req, res) {
    res.sendFile(path.join('/home/mirror/Public/closet' ,'closet.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
