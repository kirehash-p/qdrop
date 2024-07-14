import base64
from PIL import Image
from io import BytesIO


def trim_dict(d: dict | list, keys: list[str]) -> dict | list:
    if isinstance(d, dict):
        return {k: v for k, v in d.items() if k in keys}
    elif isinstance(d, list):
        return [{k: v for k, v in item.items() if k in keys} for item in d]
    else:
        raise TypeError('d must be dict or list')

def validate_img(img):
    try:
        img_data = base64.b64decode(img)
        img = Image.open(BytesIO(img_data))
        if img.format != 'PNG' or img.width != 256 or img.height != 256:
            return False
        return True
    except:
        return False