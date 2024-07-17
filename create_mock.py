import json
import requests
import os

with open('./env.json', 'r') as file:
    env = json.load(file)
    API_URL = env['API_URL']
MOCK_PATH = './docs/mock_server/'

def get_and_save(api_url, save_path):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    res = requests.get(api_url)
    with open(save_path, 'w') as f:
        f.write(res.text)
    return res.text

def main():
    odai_list = get_and_save(f"{API_URL}/odai_list.json", f"{MOCK_PATH}odai_list.json")
    for odai in json.loads(odai_list)['data']:
        get_and_save(f"{API_URL}/odai/{odai['url_path']}.json", f"{MOCK_PATH}odai/{odai['url_path']}.json")
        get_and_save(f"{API_URL}/answer/{odai['url_path']}.json", f"{MOCK_PATH}answer/{odai['url_path']}.json")

if __name__ == '__main__':
    main()
