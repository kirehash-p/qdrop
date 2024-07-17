let cloudStock = [];

(async () => {
    await loadConfig();
    const params = getParams();
    var answer_list = await get_answer_list(params.get('path'));
    if (cfg.IS_MOCK) {
        try {
            const imgData = localStorage.getItem("temp_img_" + params.get('path'));
            answer_list.data.push({
                answer: imgData,
            });
        } catch (error) {
            console.error(error);
        }
    }
    if (answer_list.success) {
        const answerContainer = document.getElementById('answer-container');
        for (i = 1; i <= answer_list.data.length; i++) {
            const answerElement = `
                <div class="answer_element" id="answer-${i}" style="visibility: hidden;">
                    <img src="image/cloud.png" alt="雲" class="cloud_img">
                    <div class="answer_img">
                        <img src="data:image/png;base64,${answer_list.data[i - 1].answer}">
                    </div>
                </div>`;
            answerContainer.insertAdjacentHTML('beforeend', answerElement);
        }
        for (i = 1; i <= answer_list.data.length; i++) {
            cloudStock.push(i);
        }
        const interval = 50 / (answer_list.data.length - 1) * 1000;
        setTimeout(choose_and_drop_cloud, 100);
        setInterval(choose_and_drop_cloud, interval);
    };
})();

async function get_answer_list(path) {
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
    if (cloudStock.length === 0) {
        return;
    }
    const randomIdx = Math.floor(Math.random() * cloudStock.length);
    const cloudNum = cloudStock[randomIdx];
    cloudStock.splice(randomIdx, 1);
    drop_cloud(cloudNum);
}

let past_y = 0;
function drop_cloud(cloudNum) {
    const cloudElement = document.getElementById(`answer-${cloudNum}`);
    const element_width = parseInt(cloudElement.clientWidth);
    const element_height = parseInt(cloudElement.clientHeight);
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