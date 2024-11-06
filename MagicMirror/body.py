import mysql.connector
from mysql.connector import Error
import time
import os

# Define your database connection
def connect():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='mirrordb',
            user='root',  # Update this to your actual username
            password='0000'  # Update this to your actual password
        )
        if connection.is_connected():
            print('Connected to MySQL database')
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

# Define the information based on the body type
def get_information(body_name):
    info = {
        'largeTri': "큰삼각체형 (Large Triangular Body Type)\n"
                    "특징: 상체가 넓고 어깨가 넓으며 상체에 비해 하체가 상대적으로 가늘다.\n"
                    "어울리는 스타일:\n"
                    "하의 강조: 하체를 강조하는 스타일이 좋습니다. 밝거나 패턴이 있는 하의를 선택하여 하체에 시선을 집중시킬 수 있습니다.\n"
                    "간결한 상의: 상체를 더욱 강조하지 않도록 간결한 디자인의 상의를 선택하는 것이 좋습니다. 예를 들어, V넥 티셔츠나 스리밍한 디자인의 셔츠가 효과적입니다.\n"
                    "레이어링: 레이어드 스타일로 상체의 부피를 줄이고 하체에 포인트를 주는 스타일이 좋습니다.",
        'inverTri': "역삼각체형 (Inverted Triangle Body Type)\n"
                    "특징: 어깨와 가슴이 넓고 하체가 상대적으로 가늘다.\n"
                    "어울리는 스타일:\n"
                    "하체의 볼륨 추가: 하체에 볼륨을 주는 스타일이 좋습니다. 예를 들어, 플레어 스커트나 부츠컷 바지로 하체를 강조할 수 있습니다.\n"
                    "밸런스 있는 상의: 상체의 볼륨을 덜 강조하는 디자인을 선택합니다. 간결한 디자인이나 패턴이 없는 상의가 적합합니다.\n"
                    "색상 조합: 하체에 밝거나 패턴이 있는 옷을 입어 시각적으로 균형을 맞추는 것이 좋습니다.",
        'square': "사각체형 (Square Body Type)\n"
                  "특징: 어깨와 허리가 거의 같은 너비를 가지며 상체와 하체의 비율이 균형을 이루고 있음.\n"
                  "어울리는 스타일:\n"
                  "라인 강조: 인체의 윤곽을 강조할 수 있는 옷을 선택합니다. 허리선을 강조하는 드레스나 벨트를 활용하여 라인을 만들어주는 스타일이 좋습니다.\n"
                  "여유 있는 디자인: 너무 딱 붙거나 너무 넓은 디자인보다는 적당히 여유 있는 옷을 선택하여 균형 잡힌 스타일을 유지합니다.\n"
                  "패턴과 텍스처: 다양한 패턴과 텍스처를 활용하여 시각적인 변화를 줄 수 있습니다. 예를 들어, 패턴이 있는 상의와 단색 하의를 매치하여 균형을 맞출 수 있습니다."
    }
    return info.get(body_name, "Unknown body type")

# Function to insert or update the BODY table
def update_body_table(user_id, body_name):
    connection = connect()
    if connection:
        try:
            cursor = connection.cursor()
            information = get_information(body_name)
            query = """INSERT INTO BODY (user_id, body_name, information)
                       VALUES (%s, %s, %s)
                       ON DUPLICATE KEY UPDATE body_name=VALUES(body_name), information=VALUES(information)"""
            data = (user_id, body_name, information)
            cursor.execute(query, data)
            connection.commit()
            print(f"Information for user {user_id} updated successfully.")
        except Error as e:
            print(f"Error: {e}")
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()

# Function to monitor the result file and update the database
def monitor_file(file_path, user_id):
    last_mtime = None
    while True:
        try:
            current_mtime = os.path.getmtime(file_path)
            if current_mtime != last_mtime:
                last_mtime = current_mtime
                with open(file_path, 'r') as file:
                    body_name = file.read().strip()
                update_body_table(user_id, body_name)
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(3)  # Check the file every 10 seconds

if __name__ == "__main__":
    file_path = '/home/mirror/result.txt'
    user_id = 1  # Update this to the actual user_id
    monitor_file(file_path, user_id)
