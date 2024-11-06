import cv2
import os
import time

# 사용자 홈 디렉토리 내에 저장할 경로 설정
SAVE_DIR = '/home/mirror'
FILE_NAME = 'photo.jpg'
FILE_PATH = os.path.join(SAVE_DIR, FILE_NAME)

def capture_image(countdown_time=10):
    # 카메라 캡처 객체 생성
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("카메라를 열 수 없습니다.")
        return

    start_time = time.time()
    while True:
        # 현재 시간 계산
        elapsed_time = time.time() - start_time
        remaining_time = max(countdown_time - int(elapsed_time), 0)

        # 카메라 프레임 읽기
        ret, frame = cap.read()
        if not ret:
            print("프레임을 읽을 수 없습니다.")
            break

        # 남은 시간 텍스트 추가
        cv2.putText(frame, f'{remaining_time} seconds left', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # 화면에 프레임 표시
        cv2.imshow('Camera', frame)

        # 카운트다운이 끝나면 사진 촬영
        if remaining_time <= 0:
            cv2.imwrite(FILE_PATH, frame)
            print(f'사진이 성공적으로 저장되었습니다: {FILE_PATH}')
            break

        # 'q' 키를 누르면 종료
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    print(f'{10}초 뒤 촬영이 시작됩니다.')
    time.sleep(2)  # 추가 대기 시간 (필요에 따라 조정 가능)
    capture_image(countdown_time=10)
