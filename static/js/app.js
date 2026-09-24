const tab = document.getElementById('tab_bar');
const circleIndicator = document.getElementById('circle_indicator');

function updateTabIndicator() {
    const sections = Array.from(document.querySelectorAll('.content > section'));
    const size = tab.firstElementChild.clientHeight;
    const activeIndex = sections.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight * 0.4;
    });

    if (activeIndex >= 0) {
        circleIndicator.style.marginLeft = `${(15 + size) * activeIndex}px`;
        circleIndicator.style.backgroundColor = getComputedStyle(document.documentElement)
            .getPropertyValue(`--theme-${activeIndex + 1}`);
    }
}

document.addEventListener('scroll', updateTabIndicator, { passive: true });
updateTabIndicator();

document.querySelectorAll('[data-abstract]').forEach((button) => {
    button.addEventListener('click', () => {
        const abstract = document.getElementById(button.dataset.abstract);
        const expanded = button.getAttribute('aria-expanded') === 'true';
        abstract.hidden = expanded;
        button.setAttribute('aria-expanded', String(!expanded));
    });
});

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal_content');
const modalClose = document.getElementById('modal_close');
const modalCopy = document.getElementById('modal_copy');
const modalDownload = document.getElementById('modal_download');
let currentFilename = null;

function validCitationPath(path) {
    return path && path.startsWith('/data/bibtex/') && !path.includes('..');
}

document.querySelectorAll('[data-citation]').forEach((button) => {
    button.addEventListener('click', async () => {
        const filename = button.dataset.citation;
        if (!validCitationPath(filename)) {
            return;
        }

        const response = await fetch(filename);
        if (!response.ok) {
            return;
        }

        currentFilename = filename;
        modalContent.textContent = await response.text();
        modal.showModal();
    });
});

modalClose.addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});
modal.addEventListener('close', () => {
    currentFilename = null;
});
modalCopy.addEventListener('click', () => navigator.clipboard.writeText(modalContent.textContent));
modalDownload.addEventListener('click', () => {
    if (!validCitationPath(currentFilename)) {
        return;
    }

    const link = document.createElement('a');
    link.href = currentFilename;
    link.download = currentFilename.split('/').pop();
    link.click();
});
