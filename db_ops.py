from supabase import create_client, Client
import json, datetime
import typing

# supabaseのクライアントを作成
with open('./env.json', 'r') as file:
    env = json.load(file)
SUPABASE_URL = env['SUPABASE_URL']
SUPABASE_KEY = env['SUPABASE_KEY']
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Odai(typing.TypedDict):
    id: int
    title: str
    description: str
    url_path: str
    createdAt: datetime.datetime

class Answer(typing.TypedDict):
    id: int
    odaiId: int
    answer: str
    createdAt: datetime.datetime

odai_all = None
odai_last_accessed = datetime.datetime.now()
def get_all_odai() -> typing.Tuple[typing.Optional[Exception] | None, typing.List[Odai]]:
    try:
        global odai_all, odai_last_accessed
        if odai_all == None or (datetime.datetime.now() - odai_last_accessed).seconds > 3600:
            odai_all = supabase.table('Odai').select('id, title, description, url_path').execute().data
            odai_last_accessed = datetime.datetime.now()
        return None, odai_all
    except Exception as e:
        return e, []

answer_all = {}
answer_last_accessed = {}
def get_answer_by_odai_id(odai_id: int, limit: int=20) -> typing.Tuple[typing.Optional[Exception] | None, typing.List[Answer]]:
    try:
        global answer_all, answer_last_accessed
        if odai_id not in answer_last_accessed or (datetime.datetime.now() - answer_last_accessed[odai_id]).seconds > 60:
            answer_last_accessed[odai_id] = datetime.datetime.now()
            answer_all[odai_id] = supabase.table('Answer').select('*').eq('odaiId', odai_id).order('createdAt').limit(limit).execute().data
        return None, answer_all[odai_id]
    except Exception as e:
        return e, []

def submit_answer_by_url_path(url_path: str, img: str) -> typing.Optional[Exception] | None:
    try:
        err, all_odai = get_all_odai()
        if err:
            return err
        for o in all_odai:
            if o['url_path'] == url_path:
                odai = o
                break
        else:
            return Exception('odai not found')
        odai_id = odai['id']
        supabase.table('Answer').insert({'odaiId': odai_id, 'answer': img}).execute()
        return None
    except Exception as e:
        return e