import mysql.connector

# 데이터베이스 연결 설정
try:
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='0000',
        database='mirrordb'
    )
    
    cursor = conn.cursor()

    # BLOB 데이터 가져오기
    cursor.execute("SELECT image FROM CLOTHES WHERE color='wine'")
    result = cursor.fetchone()

    if result is None:
        print("결과가 없습니다.")
    else:
        blob_data = result[0]

        # BLOB 데이터의 첫 8바이트를 확인
        header = blob_data[:8]
        print("헤더:", header)

        # 이미지 형식 확인
        if header[:3] == bytes([255, 216, 255]):
            print("이 데이터는 JPEG 파일입니다.")
        elif header[:4] == bytes([71, 73, 70, 56]):  # GIF
            print("이 데이터는 GIF 파일입니다.")
        elif header == bytes([137, 80, 78, 71, 13, 10, 26, 10]):  # PNG
            print("이 데이터는 PNG 파일입니다.")
        elif header[:2] == bytes([66, 77]):  # BMP
            print("이 데이터는 BMP 파일입니다.")
        else:
            print("알 수 없는 형식입니다.")

except mysql.connector.Error as err:
    print(f"데이터베이스 오류: {err}")
except Exception as e:
    print(f"기타 오류: {e}")
finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()
