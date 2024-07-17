(async () => {
    await loadConfig();
    const params = getParams();
    const odai = await get_odai(params.get('path'));
    if (odai.success) {
        document.title = `${odai.data.title} | ${document.title}`;
        document.getElementById('odai-title').innerText = odai.data.title;
        document.getElementById('odai-description').innerText = odai.data.description;
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const checkBox = document.getElementById('agree-checkbox');
    const submitButton = document.getElementById('odai-submit');
    checkBox.addEventListener('change', () => {
        submitButton.disabled = !checkBox.checked;
    });
});

async function get_odai(path) {
    try {
        const response = await fetch(`${cfg.API_URL}/odai/${path}.json`);
        if (!response.ok) {
            throw new Error('Failed to load odai list');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function setup() {
    const odaiCanvas = document.getElementById("odai-canvas");
    let canvasSize = Math.min(odaiCanvas.clientWidth, odaiCanvas.clientHeight);
    let canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("odai-canvas");
    strokeWeight(3);
}

function draw() {
    if (mouseIsPressed) {
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

function mouseClicked() {
    fill(0);
}

function resetCanvas() {
    clear();
}

function submitOdai() {
    const IMGSIZE = 256;
    let img = get();
    let resizedImg = createImage(IMGSIZE, IMGSIZE);
    resizedImg.copy(img, 0, 0, img.width, img.height, 0, 0, IMGSIZE, IMGSIZE);
    resizedImg.filter(THRESHOLD);
    let imgData = resizedImg.canvas.toDataURL();
    imgData = imgData.replace(/^data:image\/\w+;base64,/, "");
    if (cfg.IS_MOCK) {
        // imgDataをWebStorageに保存
        localStorage.setItem("temp_img_" + getParams().get("path"), imgData);
        alert("投稿しました！");
        window.location.href = "answer.html?path=" + getParams().get("path");
    }
    let payload = {
        url_path: getParams().get("path"),
        img: imgData,
    };
    fetch(`${cfg.API_URL}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("投稿しました！");
                window.location.href = "answer.html?path=" + getParams().get("path");
            } else {
                alert("投稿に失敗しました。");
            }
    });
}
