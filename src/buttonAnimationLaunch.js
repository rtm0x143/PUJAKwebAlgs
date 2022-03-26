const overlay = document.getElementById('navigation-screen');

function openMenu(overlay) {
    const element = document.getElementById('nav-trigger');
    element.addEventListener('click', () => {
        if (overlay.style.visibility === 'hidden') {
            overlay.style.visibility = 'visible';
        }
    });
    // element.classList.remove('classname');
    // void element.offsetWidth;
    // element.classList.add('classname');
}

function closeMenu(overlay) {
    const element = document.getElementById('nav-close');
    element.addEventListener('click', () => {
        if (overlay.style.visibility === 'visible') {
            overlay.style.visibility = 'hidden';
        }
    })
}

openMenu(overlay)
closeMenu(overlay)