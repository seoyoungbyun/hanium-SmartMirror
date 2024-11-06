from flask import Flask, render_template_string
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    # `both.py`의 출력 결과를 얻습니다.
    result = subprocess.run(['python3', '/home//mirror/MagicMirror/both.py'], capture_output=True, text=True)
    return render_template_string('<html><body><pre>{{ result }}</pre></body></html>', result=result.stdout)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
