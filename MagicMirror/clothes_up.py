import mysql.connector
from mysql.connector import Error

def connect():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='mirrordb',
            user='root',  # 수정된 사용자 이름
            password='0000'  # 수정된 비밀번호
        )
        if connection.is_connected():
            print('Connected to MySQL database')
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def insert_image(image_path, user_id, mood, color, season):
    try:
        connection = connect()
        if connection:
            cursor = connection.cursor()
            with open(image_path, 'rb') as file:
                image_data = file.read()
            query = """INSERT INTO CLOTHES (user_id, mood, color, season, image)
                       VALUES (%s, %s, %s, %s, %s)"""
            data = (user_id, mood, color, season, image_data)
            cursor.execute(query, data)
            connection.commit()
            print(f"Image inserted successfully into CLOTHES table.")
            cursor.close()
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection and connection.is_connected():
            connection.close()

def get_color_from_file(file_path):
    try:
        with open(file_path, 'r') as file:
            color = file.read().strip()  # 파일에서 읽어온 내용을 공백 제거 후 반환
            return color
    except IOError as e:
        print(f"Error reading color file: {e}")
        return None

if __name__ == "__main__":
    image_path = '/home/mirror/MagicMirror/up/1.png'
    user_id = 1  # 적절한 사용자 ID로 변경
    mood = 'casual'  # 적절한 기분으로 변경
    color = get_color_from_file('/home/mirror/MagicMirror/color.txt')  # color.txt에서 색상 읽기
    season = 'summer'  # 적절한 계절로 변경
    
    if color:  # color가 None이 아닌 경우에만 이미지를 삽입
        insert_image(image_path, user_id, mood, color, season)
    else:
        print("Failed to insert image due to missing color information.")
