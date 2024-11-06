import os
from rembg import remove
from PIL import Image
import subprocess
import time
import sys

# 파일 경로 설정
input_dir = '/home/mirror/MagicMirror/up'
input_filename = 'clo'  # 확장자를 모름
output_filename = '1.png'
output_path = os.path.join(input_dir, output_filename)

# 입력 파일 경로에서 확장자를 자동으로 찾기
def find_image_file(input_dir, input_filename):
    for ext in ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp']:  # 지원하는 확장자 목록
        potential_file = os.path.join(input_dir, f'{input_filename}.{ext}')
        if os.path.exists(potential_file):
            return potential_file
    return None

# 파일 찾기
input_path = find_image_file(input_dir, input_filename)
if input_path is None:
    raise FileNotFoundError(f"'{input_filename}' 파일을 찾을 수 없습니다.")

# 이미지 로드
input_image = Image.open(input_path)

# 배경 제거
output_image = remove(input_image)

# 이미지 저장
output_image.save(output_path)
type = sys.argv[1]

if type == "상의":
    subprocess.run(['python3', 'color.py'], check=True)
else:
    subprocess.run(['python3', 'color_down.py'], check=True)

# 원본 파일 삭제
os.remove(input_path)

print(f"Image saved to {output_path} and original file deleted.")
