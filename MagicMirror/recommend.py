import random
import sys

def select_top_probabilistically(top_color):
    # 하의와의 매칭 데이터를 정의
    weighted_matching_data = {
        "red": ["deep", "black"],
        "yellow": ["black"],
        "green": ["deep", "black"],
        "blue": ["white"],
        "purple": ["light", "white"],  # 임의로 설정
        "navy": ["white"],
        "pink": ["white"],
        "brown": ["light", "middle", "black"],  # 임의로 설정
        "white": ["light", "middle", "deep", "beige", "black"],
        "black": ["light", "beige", "black"]
    }

    # 주어진 top_color에 해당하는 하의 리스트 가져오기
    possible_bottoms = weighted_matching_data.get(top_color, [])

    # 랜덤으로 선택
    if possible_bottoms:
        selected_bottom = random.choice(possible_bottoms)
        return selected_bottom

if len(sys.argv) >= 1:
    top_color = sys.argv[1]
    bottom_color = select_top_probabilistically(top_color)
    print(bottom_color)
    
else:
    print("No data received")
