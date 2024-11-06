import mysql.connector
from mysql.connector import Error
from PIL import Image
import matplotlib.pyplot as plt
import io

def connect():
    """MariaDB에 연결하는 함수"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='mirrordb',
            user='root',  # 사용자 이름
            password='0000'  # 비밀번호
        )
        if connection.is_connected():
            print('Connected to MySQL database')
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def fetch_and_display_images():
    """이미지를 가져와서 화면에 표시하는 함수"""
    connection = connect()
    if connection:
        try:
            cursor = connection.cursor()
            query = "SELECT clothes_id, image FROM CLOTHES"
            cursor.execute(query)
            rows = cursor.fetchall()

            for row in rows:
                clothes_id, image_data = row
                image = Image.open(io.BytesIO(image_data))
                
                plt.figure()
                plt.title(f"Image ID: {clothes_id}")
                plt.imshow(image)
                plt.axis('off')  # 축을 숨깁니다
                plt.show()

        except Error as e:
            print(f"Error: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

if __name__ == "__main__":
    fetch_and_display_images()
