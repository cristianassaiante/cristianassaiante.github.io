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
    const abstract = document.getElementById(button.dataset.abstract);

    button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        abstract.hidden = expanded;
        button.setAttribute('aria-expanded', String(!expanded));
    });

    abstract.addEventListener('click', () => {
        abstract.hidden = true;
        button.setAttribute('aria-expanded', 'false');
    });
});

const publicationSearch = document.getElementById('publication_search');
const publicationYear = document.getElementById('publication_year');
const publicationReset = document.getElementById('publication_reset');
const publicationCount = document.getElementById('publication_count');
const publicationEmpty = document.getElementById('publication_empty');
const publicationsSection = document.getElementById('publications');
const publicationCards = Array.from(document.querySelectorAll('[data-publication]'));

function filterPublications() {
    const query = publicationSearch.value.trim().toLowerCase();
    const year = publicationYear.value;
    let visibleCount = 0;

    publicationCards.forEach((card) => {
        const matchesQuery = !query || card.dataset.search.toLowerCase().includes(query);
        const matchesYear = year === 'all' || card.dataset.year === year;
        const visible = matchesQuery && matchesYear;
        card.hidden = !visible;
        if (visible) {
            visibleCount += 1;
        }
    });

    publicationCount.textContent = `${visibleCount} publication${visibleCount === 1 ? '' : 's'}`;
    publicationEmpty.hidden = visibleCount !== 0;

    const params = new URLSearchParams(window.location.search);
    if (query) {
        params.set('q', query);
    } else {
        params.delete('q');
    }
    if (year !== 'all') {
        params.set('year', year);
    } else {
        params.delete('year');
    }
    const queryString = params.toString();
    const filterHash = queryString ? '#publications' : '';
    history.replaceState(null, '', queryString ? `${window.location.pathname}?${queryString}${filterHash}` : window.location.pathname);
}

publicationSearch.addEventListener('input', filterPublications);
publicationYear.addEventListener('change', filterPublications);
publicationReset.addEventListener('click', () => {
    publicationSearch.value = '';
    publicationYear.value = 'all';
    filterPublications();
    publicationSearch.focus();
});
const initialParams = new URLSearchParams(window.location.search);
publicationSearch.value = initialParams.get('q') || '';
publicationYear.value = initialParams.get('year') || 'all';
filterPublications();
if (initialParams.has('q') || initialParams.has('year')) {
    publicationsSection.scrollIntoView();
}

const previousNewsItems = Array.from(document.querySelectorAll('[data-previous-news]'));
const newsPagination = document.querySelector('.content__news__pagination');
const newsPrevious = document.querySelector('[data-news-previous]');
const newsNext = document.querySelector('[data-news-next]');
const newsPage = document.querySelector('[data-news-page]');
const newsPageSize = 5;
let newsCurrentPage = 0;

function renderNewsPage() {
    const pageCount = Math.ceil(previousNewsItems.length / newsPageSize);
    const start = newsCurrentPage * newsPageSize;

    previousNewsItems.forEach((item, index) => {
        item.hidden = index < start || index >= start + newsPageSize;
    });
    newsPagination.hidden = pageCount <= 1;
    newsPrevious.disabled = newsCurrentPage === 0;
    newsNext.disabled = newsCurrentPage === pageCount - 1;
    newsPage.textContent = `Page ${newsCurrentPage + 1} of ${pageCount}`;
}

newsPrevious.addEventListener('click', () => {
    if (newsCurrentPage > 0) {
        newsCurrentPage -= 1;
        renderNewsPage();
    }
});
newsNext.addEventListener('click', () => {
    if (newsCurrentPage < Math.ceil(previousNewsItems.length / newsPageSize) - 1) {
        newsCurrentPage += 1;
        renderNewsPage();
    }
});
renderNewsPage();

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal_content');
const modalClose = document.getElementById('modal_close');
const modalCopy = document.getElementById('modal_copy');
const modalDownload = document.getElementById('modal_download');
const copyFeedback = document.getElementById('copy_feedback');
let currentFilename = null;
let copyFeedbackTimeout = null;
let citationTrigger = null;

function validCitationPath(path) {
    return path && path.startsWith('/data/bibtex/') && !path.includes('..');
}

document.querySelectorAll('[data-citation]').forEach((button) => {
    button.addEventListener('click', async () => {
    citationTrigger = button;
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
            modalClose.focus();
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
    citationTrigger?.focus();
    citationTrigger = null;
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
