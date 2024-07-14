document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = `
        <div id="loading-overlay">
            <div id="loading-text"></div>
        </div>`
    document.body.insertAdjacentHTML('afterbegin', loadingOverlay)
    document.body.style.overflow = 'hidden'
    window.addEventListener('load', function() {
        document.body.removeChild(document.getElementById('loading-overlay'))
        document.body.style.overflow = ''
    });
});