let cloudStock = [];

(async () => {
    await loadConfig();
    const params = getParams();
    const cloud_list = await get_cloud_list(params.get('path'));
    if (cloud_list.success) {
        const cloudContainer = document.getElementById('answer-container');
        for (i = 1; i <= cloud_list.data.length; i++) {
            const cloudElement = `
                <div class="answer_element" id="answer-${i}" style="visibility: hidden;">
                    <img src="image/cloud.png" alt="雲" class="cloud_img">
                    <div class="answer_img">
                        <img src="data:image/png;base64,${cloud_list.data[i - 1].answer}">
                    </div>
                </div>`;
            cloudContainer.insertAdjacentHTML('beforeend', cloudElement);
        }
        for (i = 1; i <= cloud_list.data.length; i++) {
            cloudStock.push(i);
        }
        const interval = 50 / (cloud_list.data.length - 1) * 1000;
        setTimeout(choose_and_drop_cloud, 100);
        setInterval(choose_and_drop_cloud, interval);
    };
})();

async function get_cloud_list(path) {
    try {
        const response = await fetch(`${cfg.API_URL}/answer/${path}.json`);
        if (!response.ok) {
            throw new Error('Failed to load cloud list');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function choose_and_drop_cloud() {
    const randomIdx = Math.floor(Math.random() * cloudStock.length);
    const cloudNum = cloudStock[randomIdx];
    cloudStock.splice(randomIdx, 1);
    drop_cloud(cloudNum);
}

let past_y = 0;
function drop_cloud(cloudNum) {
    const cloudElement = document.getElementById(`answer-${cloudNum}`);
    const element_height = parseInt(cloudElement.clientHeight);
    const element_width = parseInt(cloudElement.clientWidth);
    let y;
    while (true) {
        y = Math.floor((0.1 + Math.random() * 0.8) * (window.innerHeight - element_height));
        if (Math.abs(y - past_y) > element_height || (Math.abs(past_y - 0.9 * window.innerHeight) < element_height) || (Math.abs(past_y - 0.1 * window.innerHeight) < element_height)) {
            past_y = y;
            break;
        }
    }
    let x = window.innerWidth + element_width / 2;
    cloudElement.style.left = `${x}px`;
    cloudElement.style.top = `${y}px`;
    cloudElement.style.visibility = 'visible';
    const speed = 1 + Math.random() * 2;
    let intervalId = setInterval(() => {
        x -= speed;
        cloudElement.style.left = `${x}px`;
        if (x < -element_width) {
            cloudElement.style.visibility = 'hidden';
            cloudElement.style.left = `${-element_width}px`;
            cloudStock.push(cloudNum);
            clearInterval(intervalId);
        }
    }, 30);
}