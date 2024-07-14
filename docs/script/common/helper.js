async function loadConfig() {
    try {
        const response = await fetch('config/config.json');
        if (!response.ok) {
            throw new Error('Failed to load config');
        }
        const config = await response.json();
        window.cfg = config;
    } catch (error) {
        throw error;
    }
}

function getParams() {
    const currentURL = window.location.search;
    const params = new URLSearchParams(currentURL);
    return params;
}

window.loadConfig = loadConfig;
window.getParams = getParams;