import subprocess

# came.py를 실행합니다.
subprocess.run(['python3', 'came.py'], check=True)

# came.py가 종료된 후 final.py를 실행합니다.
subprocess.run(['python3', 'final.py'], check=True)

# final.py 종료 후 body.py 실행
subprocess.run(['python3', 'body.py'], check=True)