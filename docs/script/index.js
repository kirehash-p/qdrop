
let dropStock = [];

(async () => {
    await loadConfig();
    const odai_list = await get_odai_list();
    if (odai_list.success) {
        const odaiContainer = document.getElementById('odai-container');
        for (i = 1; i <= odai_list.data.length; i++) {
            const odaiElement = `
                <div class="odai_element" id="odai-${i}" style="visibility: hidden;">
                    <a href="/odai.html?path=${odai_list.data[i - 1].url_path}">
                        <img src="image/drop.png" alt="${odai_list.data[i - 1].title}" class="odai_img">
                        <div class="odai_text">
                            <h2>${odai_list.data[i - 1].title}</h2>
                            <p>${odai_list.data[i - 1].description}</p>
                        </div>
                    </a>
                </div>`;
            odaiContainer.insertAdjacentHTML('beforeend', odaiElement);
        }
        for (i = 1; i <= odai_list.data.length; i++) {
            dropStock.push(i);
        }
        const interval = 50 / (odai_list.data.length - 1) * 1000;
        setTimeout(choose_and_drop_odai, 100);
        setInterval(choose_and_drop_odai, interval);
    };
})();


async function get_odai_list() {
    try {
        const response = await fetch(`${cfg.API_URL}/odai_list.json`);
        if (!response.ok) {
            throw new Error('Failed to load odai list');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function choose_and_drop_odai() {
    const randomIdx = Math.floor(Math.random() * dropStock.length);
    const odaiNum = dropStock[randomIdx];
    dropStock.splice(randomIdx, 1);
    drop_odai(odaiNum);
}

let past_x = 0;
function drop_odai(odaiNum) {
    const odaiElement = document.getElementById(`odai-${odaiNum}`);
    const element_height = parseInt(odaiElement.clientHeight);
    const element_width = parseInt(odaiElement.clientWidth);
    let x;
    while (true) {
        x = Math.floor((0.1 + Math.random() * 0.8) * (window.innerWidth - element_width));
        if (Math.abs(x - past_x) > element_width || (Math.abs(past_x - 0.9 * window.innerWidth) < element_width) || (Math.abs(past_x - 0.1 * window.innerWidth) < element_width)) {
            past_x = x;
            break;
        }
    }
    let y = -element_height;
    odaiElement.style.top = `${y}px`;
    odaiElement.style.visibility = 'visible';
    let dy = (window.innerHeight + element_height) / 1000;
    let intervalId = setInterval(() => {
        y += dy;
        odaiElement.style.top = `${y}px`;
        odaiElement.style.left = `${x}px`;
        if (y > window.innerHeight + element_height) {
            odaiElement.style.visibility = 'hidden';
            odaiElement.style.top = `-${element_height}px`;
            dropStock.push(odaiNum);
            clearInterval(intervalId);
        }
    }, 50);
}