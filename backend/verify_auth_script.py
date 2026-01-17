import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def register():
    print(f"Attempting register at {BASE_URL}/auth/register")
    req = urllib.request.Request(
        f"{BASE_URL}/auth/register",
        data=json.dumps({"email": "script_user_v3@example.com", "password": "password123"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as f:
            print("Register Success:", f.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        with open("last_error.txt", "a") as errf:
            errf.write(f"Register Error: {e.code} {body}\n")
        print(f"Register Error: {e.code} {body}")

def login():
    print(f"Attempting login at {BASE_URL}/auth/login")
    req = urllib.request.Request(
        f"{BASE_URL}/auth/login",
        data=json.dumps({"email": "script_user_v3@example.com", "password": "password123"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as f:
            res = json.loads(f.read().decode('utf-8'))
            print("Login Success. Token received.")
            return res.get('access_token')
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        with open("last_error.txt", "a") as errf:
            errf.write(f"Login Error: {e.code} {body}\n")
        print(f"Login Error: {e.code} {body}")
        return None

def test_me(token):
    print(f"Attempting /me with token")
    req = urllib.request.Request(
        f"{BASE_URL}/me",
        headers={'Authorization': f'Bearer {token}'},
        method="GET"
    )
    try:
        with urllib.request.urlopen(req) as f:
            print("Me Endpoint Success:", f.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("Me Endpoint Error:", e.code, e.read().decode('utf-8'))

if __name__ == "__main__":
    # Small delay to ensure server is ready if it just restarted, though it's been running.
    time.sleep(1)
    register()
    token = login()
    if token:
        test_me(token)
    else:
        print("Skipping /me test because login failed.")
