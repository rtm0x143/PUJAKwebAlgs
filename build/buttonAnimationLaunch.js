const overlay = document.getElementById('navigation-screen');

function openMenu(overlay) {
    const element = document.getElementById('nav-trigger');
    element.addEventListener('click', () => {
        if (overlay.className === 'navigation-closed') {
            overlay.className = 'navigation-opened';
        }
    });
    // element.classList.remove('classname');
    // void element.offsetWidth;
    // element.classList.add('classname');
}

function closeMenu(overlay) {
    const element = document.getElementById('nav-close');
    element.addEventListener('click', () => {
        if (overlay.className === 'navigation-opened') {
            overlay.className = 'navigation-closed';
        }
    })
}

openMenu(overlay)
closeMenu(overlay)