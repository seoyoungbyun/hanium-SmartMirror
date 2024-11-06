from rembg import remove
from PIL import Image

# 이미지 로드
input_image = Image.open('/home/mirror/Public/uploads/1.jpg')

# 배경 제거
output_image = remove(input_image)

# 이미지 저장
output_image.save('1.png')

# 이미지 화면에 띄우기
output_image.show()