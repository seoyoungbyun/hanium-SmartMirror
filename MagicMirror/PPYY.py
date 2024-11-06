import mysql.connector
import sys
import time

# 데이터베이스 연결
db_connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0000",
    database="mirrordb"
)

cursor = db_connection.cursor()

# color.txt 파일에서 내용을 읽어옴
try:
    time.sleep(20)
    with open("/home/mirror/color.txt", "r") as file:
        color_group = file.read().strip()  # 파일에서 내용 읽기 및 양 끝 공백 제거
except FileNotFoundError:
    print("color.txt 파일을 찾을 수 없습니다.")
    sys.exit()

if len(sys.argv) > 3:
    season = sys.argv[1]  # 첫 번째 인자로 받은 데이터
    mood = sys.argv[2]    # 두 번째 인자로 받은 데이터
    type_ = sys.argv[3]   # 세 번째 인자로 받은 데이터

    # type에 따라 값을 설정
    if type_.lower() == "상의":
        type_value = 0
    elif type_.lower() == "하의":
        type_value = 1
    else:
        print("Invalid type. Use '상의' or '하의'.")
        sys.exit()

    # 이미지 경로
    image_path = "/home/mirror/MagicMirror/up/1.png"

    with open(image_path, 'rb') as file:
        binary_data = file.read()

    # INSERT INTO 문
    insert_query = """
    INSERT INTO CLOTHES (user_id, mood, color, season, image, type)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    # 값 튜플 생성
    values = (1, mood, color_group, season, binary_data, type_value)

    # 데이터 삽입
    cursor.execute(insert_query, values)
    db_connection.commit()

    print(f"Data inserted successfully: Season: {season}, Mood: {mood}, Type: {type_}, Color: {color_group}")

    # COLOR 테이블의 색상 개수 카운트 (type이 0인 경우만)
    colors_to_check = ["red", "yellow", "green", "blue", "purple", "navy", "pink", "brown", "white", "black"]

    # 색상 카운트를 위한 쿼리 (type이 0인 경우만)
    count_query = """
    SELECT color, COUNT(*) 
    FROM CLOTHES 
    WHERE color IN (%s) AND type = 0 
    GROUP BY color
    """
    
    # IN절에 사용할 색상 목록을 문자열로 변환
    format_strings = ','.join(['%s'] * len(colors_to_check))
    cursor.execute(count_query % format_strings, colors_to_check)
    color_counts = cursor.fetchall()

    # COLOR 테이블의 업데이트 또는 삽입 처리
    for color in colors_to_check:
        count = next((count for col, count in color_counts if col == color), 0)

        # COLOR 테이블에 데이터가 존재하는지 확인
        check_query = "SELECT COUNT(*) FROM COLOR WHERE user_id = %s"
        cursor.execute(check_query, (1,))
        exists = cursor.fetchone()[0]

        if exists == 0:
            # COLOR 테이블에 데이터가 없을 경우, 새로 삽입
            insert_color_query = f"""
            INSERT INTO COLOR (user_id, {color}) 
            VALUES (%s, %s)
            """
            cursor.execute(insert_color_query, (1, count))
        else:
            # COLOR 테이블에 데이터가 있을 경우, 기존 데이터 수정
            update_color_query = f"""
            UPDATE COLOR 
            SET {color} = %s 
            WHERE user_id = %s
            """
            cursor.execute(update_color_query, (count, 1))

    # 데이터 커밋
    db_connection.commit()

else:
    print("No data received")

# 커서 및 연결 닫기
cursor.close()
db_connection.close()
