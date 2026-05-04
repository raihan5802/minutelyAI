# MinutelyAI Backend Environment Setup

```bash
cd /Users/raihanchowdhury/Desktop/git\ projects/minutelyAi/backend

/opt/homebrew/bin/python3.11 -m venv minutelyEnv311
source minutelyEnv311/bin/activate

unalias python pip 2>/dev/null

python -m pip install --upgrade pip
python -m pip install setuptools==70.0.0
python -m pip install --no-build-isolation -r requirements.txt
```

```bash
ffmpeg -version
```
