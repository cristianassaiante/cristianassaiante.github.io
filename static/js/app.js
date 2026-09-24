const tab = document.getElementById('tab_bar');
const circleIndicator = document.getElementById('circle_indicator');
const themeToggle = document.getElementById('theme_toggle');
let indicatorFrame = null;

function updateThemeToggle() {
    const isLight = document.documentElement.dataset.theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    updateThemeToggle();
    updateTabIndicator();
});
updateThemeToggle();

function updateTabIndicator() {
    const sections = Array.from(document.querySelectorAll('.content > section'));
    const marker = window.innerHeight * 0.35;
    const activeIndex = sections.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= marker && rect.bottom > marker;
    });

    if (activeIndex < 0) {
        return;
    }

    const activeTab = tab.children[activeIndex];
    circleIndicator.style.left = `${activeTab.offsetLeft}px`;
    circleIndicator.style.marginLeft = '0';
    circleIndicator.style.backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue(`--theme-${activeIndex + 1}`);
}

function scheduleTabIndicatorUpdate() {
    if (indicatorFrame !== null) {
        return;
    }

    indicatorFrame = requestAnimationFrame(() => {
        indicatorFrame = null;
        updateTabIndicator();
    });
}

document.addEventListener('scroll', scheduleTabIndicatorUpdate, { passive: true });
window.addEventListener('resize', scheduleTabIndicatorUpdate);
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
const copyFeedback = document.getElementById('copy_feedback');
let currentFilename = null;
let copyFeedbackTimeout = null;

function validCitationPath(path) {
    return path && path.startsWith('/data/bibtex/') && !path.includes('..');
}

document.querySelectorAll('[data-citation]').forEach((button) => {
    button.addEventListener('click', async () => {
        const filename = button.dataset.citation;
        if (!validCitationPath(filename)) {
            return;
        }

        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error('Citation request failed');
            }

            currentFilename = filename;
            modalContent.textContent = await response.text();
            modal.showModal();
        } catch (error) {
            showCopyFeedback('Unable to load citation');
        }
    });
});

function showCopyFeedback(message) {
    copyFeedback.textContent = message;
    copyFeedback.hidden = false;
    clearTimeout(copyFeedbackTimeout);
    copyFeedbackTimeout = setTimeout(() => {
        copyFeedback.hidden = true;
    }, 2000);
}

async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) {
        throw new Error('Clipboard is unavailable');
    }
}

function closeCitationModal() {
    if (!modal.open) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const finishClose = (event) => {
            if (event.target !== modal) {
                return;
            }
            modal.classList.remove('is-closing');
            modal.close();
            resolve();
        };

        modal.addEventListener('animationend', finishClose, { once: true });
        modal.classList.add('is-closing');
    });
}

modalClose.addEventListener('click', closeCitationModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeCitationModal();
    }
});
modal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeCitationModal();
});
modal.addEventListener('close', () => {
    currentFilename = null;
});
modalCopy.addEventListener('click', async () => {
    try {
        await copyText(modalContent.textContent);
        await closeCitationModal();
        showCopyFeedback('Copied');
    } catch (error) {
        showCopyFeedback('Copy failed');
    }
});
modalDownload.addEventListener('click', () => {
    if (!validCitationPath(currentFilename)) {
        return;
    }

    const link = document.createElement('a');
    link.href = currentFilename;
    link.download = currentFilename.split('/').pop();
    link.click();
});
