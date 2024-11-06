from colorthief import ColorThief
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np
import subprocess

color_group_mapping = {
    'red': ['brown', 'firebrick', 'maroon', 'darkred', 'red', 'coral', 'orangered', 'crimson'],
    'yellow': ['darkorange', 'orange', 'gold', 'lemonchiffon', 'khaki', 'lightyellow', 'yellow',  'lightgoldenrodyellow', 'bisque',
               'navajowhite', 'sandybrown', 'goldenrod', 'palegoldenrod'],
    'green': ['darkkhaki', 'olive', 'oliverab', 'yellowgreen', 'darkolivegreen', 
           'greenyellow', 'chartreuse', 'lawngreen', 'darkseagreen', 'palegreen', 'lightgreen', 'forestgreen', 'limegreen',
           'darkgreen', 'green', 'lime', 'seagreen', 'mediumseagreen', 'springgreen', 'mediumspringgreen', 'aquamarine', 
           'lightseagreen', 'teal', 'darkcyan', 'mediumturquoise'],
    'blue': ['turquoise', 'azure', 'lightcyan', 'paleturquoise', 'aqua', 'cyan', 'darkturquoise', 'cadetblue',
            'powderblue', 'lightblue', 'deepskyblue', 'skyblue', 'lightskyblue', 'steelblue', 'aliceblue', 'dodgerblue', 'lightslategray',
            'lightslategray', 'slategray', 'slategray', 'lightsteelblue', 'cornflowerblue', 'royalblue', 'mediumblue', 'blue'],
    'purple': ['lavender', 'slateblue', 'mediumslateblue', 'mediumpurple', 'rebeccapurple', 'blueviolet', 'indigo', 'darkorchid',
            'darkviolet', 'mediumorchid', 'thistle', 'purple', 'darkmagenta'],
    'navy': ['midnightblue', 'navy', 'darkblue', 'darkslateblue', 'darkslategray'],
    'pink': ['rosybrown', 'lightcoral', 'indianred', 'mistyrose', 'salmon', 'tomato', 'lightsalmon', 'peachpuff', 'plum', 'violet', 'fuchsia',
            'magenta', 'orchid', 'mediumvioletred', 'deeppink', 'hotpink', 'lavenderblush', 'palevioletred', 'pink', 'lightpink', 'darksalmon'],
    'brown': ['sienna', 'chocolate', 'peru', 'burlywood', 'darkgoldenrod', 'tan'],
    'white': ['white', 'snow', 'whitesmoke', 'seashell', 'floralwhite', 'ghostwhite', 'lightgray', 'gainsboro', 'linen', 'antiquewhite'
              , 'oldlace', 'ivory', 'blanchedalmond', 'papayawhip', 'moccasin', 'wheat', 'cornsilk', 'beige', 'honeydew', 'mintcream'],
    'black': ['black', 'dimgray', 'gray', 'darkgray', 'silver']
}

# 색상 이름과 HEX 값을 RGB 값으로 매핑
named_colors = mcolors.CSS4_COLORS

def hex_to_rgb(hex_color):
    return np.array(mcolors.hex2color(hex_color)) * 255

# 가장 가까운 색상 그룹 찾기
def closest_color(requested_color):
    min_colors = {}
    for name, hex_color in mcolors.CSS4_COLORS.items():
        rgb_color = hex_to_rgb(hex_color)
        rd = (rgb_color[0] - requested_color[0]) ** 2
        gd = (rgb_color[1] - requested_color[1]) ** 2
        bd = (rgb_color[2] - requested_color[2]) ** 2
        min_colors[(rd + gd + bd)] = name
    return min_colors[min(min_colors.keys())]

# 색상을 그룹으로 매핑하는 함수
def map_color_to_group(color_name):
    for group_name, color_names in color_group_mapping.items():
        if color_name in color_names:
            return group_name
    return '알 수 없음'

def rgb_to_hex(rgb):
    return '#%02x%02x%02x' % tuple(rgb.astype(int))

# 이미지 로드 및 주요 색상 추출
ct = ColorThief("/home/mirror/MagicMirror/up/1.png")
dominant_color = np.array(ct.get_color(quality=1))

# 가장 가까운 색상 이름 찾기
color_name = closest_color(dominant_color)

# 색상 그룹으로 변환
color_group = map_color_to_group(color_name)

# 주요 색상 시각화
# plt.imshow([[dominant_color]])
# plt.title(f"Dominant Color: {color_name} (RGB: {dominant_color})\nColor Group: {color_group}")
# plt.axis('off')
# plt.show()

# # 색상 팔레트 추출 및 시각화
# palette = ct.get_palette(color_count=5)
# plt.imshow([[palette[i] for i in range(5)]])
# plt.title("Color Palette")
# plt.axis('off')
# plt.show()

# # 색상 이름 및 RGB 값 출력
# print(f"Dominant Color: {color_name} (RGB: {dominant_color})")
# print(f"Color Group: {color_group}")

with open('/home/mirror/color.txt', 'w') as f:
                f.write(f"{color_group}\n")