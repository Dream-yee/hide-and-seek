import requests
import json

# 你的 API 憑證 (請從 TDX 會員中心取得)
CLIENT_ID = 'morganwen0126-b1b5e67d-5bee-403e'
CLIENT_SECRET = '3e050391-ca8b-4a31-a736-b756604fed7a'
BUS_NAME = "KLRT"

# 1. 取得 Access Token
auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token"
auth_data = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
}

auth_response = requests.post(auth_url, data=auth_data)
access_token = auth_response.json()['access_token']

# 2. 呼叫你的目標 API
# 建議將 URL 中的中文進行 URL 編碼 (例如使用 requests.utils.quote)
target_url = f"https://tdx.transportdata.tw/api/basic/v2/Rail/Metro/Shape/KLRT?%24top=1&%24format=GEOJSON"

headers = {
    'authorization': f'Bearer {access_token}'
}

response = requests.get(target_url, headers=headers)

if response.status_code == 200:
    data = response.json()
    with open(f'data/bus/{BUS_NAME}.json', "w", encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print("成功取得資料！")
    # 接下來你可以將 data 存成檔案或進行處理
else:
    print(f"請求失敗，狀態碼: {response.status_code}")