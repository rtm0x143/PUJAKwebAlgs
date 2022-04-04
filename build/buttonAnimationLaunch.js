const overlay = document.getElementById('navigation-screen');

function disableScroll() {
    document.body.classList.add("stop-scrolling");
}

function enableScroll() {
    document.body.classList.remove("stop-scrolling");
}

function openMenu(overlay) {
    const element = document.getElementById('nav-trigger');
    element.addEventListener('click', () => {
        if (overlay.className === 'navigation-closed') {
            overlay.className = 'navigation-opened'
            disableScroll();
        }
    });
}

function closeMenu(overlay) {
    const element = document.getElementById('nav-close');
    element.addEventListener('click', () => {
        if (overlay.className === 'navigation-opened') {
            overlay.className = 'navigation-closed'
            enableScroll();
        }
    })
}

openMenu(overlay)
closeMenu(overlay)