import subprocess
import os
import time
import subprocess

# 저장 위치 및 파일 이름 설정
SAVE_DIR = '/home/mirror/MagicMirror'
FILE_NAME = 'human.jpg'
FILE_PATH = os.path.join(SAVE_DIR, FILE_NAME)

# 저장 위치 디렉토리가 존재하지 않으면 생성
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

def capture_image():
    """ libcamera를 사용하여 사진을 촬영합니다. """
    # libcamera-still 명령어 실행
    command = ['libcamera-still', '-preview', '-t' , '10000'  , '-o'  , FILE_PATH]
    try:
        subprocess.run(command, check=True)
        print(f'사진이 성공적으로 저장되었습니다: {FILE_PATH}')
    except subprocess.CalledProcessError as e:
        print(f'사진 촬영 중 오류가 발생했습니다: {e}')

#subprocess.run(['python3', 'final.py'], check=True)

if __name__ == '__main__':
    # 예제: 촬영 버튼을 누른 후 5초 후에 사진 촬영 (버튼 클릭 로직은 구현 필요)
    print('곧 촬영이 시작됩니다.')
    time.sleep(2)  # 실제 버튼 클릭 이벤트에 따라 이 부분을 수정할 수 있습니다
    capture_image()
