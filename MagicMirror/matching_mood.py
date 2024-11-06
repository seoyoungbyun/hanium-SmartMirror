#체형과 무드 매칭 데이터 정의
import random
import json
import sys

def select_mood_probabilistically(body_type):
    weighted_matching_data = {
        "largeTri" : ["러블리", "캐주얼", "스트릿"],
        "inverTri" : ["모던", "미니멀", "클래식"],
        "square" : ["러블리", "빈티지", "스트릿"]
    }

    # 주어진 체형에 해당하는 무드명 가져오기
    return weighted_matching_data.get(body_type, [])

if len(sys.argv) >= 1:
    body_type = sys.argv[1]
    bottom_mood = select_mood_probabilistically(body_type)
    print(json.dumps(bottom_mood))
    
else:
    print("No data received")