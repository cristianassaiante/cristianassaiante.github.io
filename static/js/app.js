const tab = document.getElementById('tab_bar');
const circleIndicator = document.getElementById('circle_indicator');
const themeToggle = document.getElementById('theme_toggle');
const profileImageContainer = document.querySelector('[data-profile-images]');
const profileImages = JSON.parse(profileImageContainer.dataset.profileImages);
const profileImage = document.querySelector('[data-profile-image]');
const profilePrevious = document.querySelector('[data-profile-previous]');
const profileNext = document.querySelector('[data-profile-next]');
const profileStatus = document.querySelector('[data-profile-status]');
let profileImageIndex = 0;
let indicatorFrame = null;

function updateProfileImage() {
    const image = profileImages[profileImageIndex];
    profileImage.src = image.src;
    profileImage.alt = image.alt;
    profileStatus.textContent = `${profileImageIndex + 1} of ${profileImages.length}`;
}

function moveProfileImage(direction) {
    profileImageIndex = (profileImageIndex + direction + profileImages.length) % profileImages.length;
    updateProfileImage();
}

if (profileImages.length > 1) {
    profilePrevious.hidden = false;
    profileNext.hidden = false;
    profilePrevious.addEventListener('click', () => moveProfileImage(-1));
    profileNext.addEventListener('click', () => moveProfileImage(1));
    updateProfileImage();
}

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
const publicationPagination = document.querySelector('.content__publist__pagination');
const publicationPrevious = document.querySelector('[data-publication-previous]');
const publicationNext = document.querySelector('[data-publication-next]');
const publicationPage = document.querySelector('[data-publication-page]');
const publicationPageSize = 3;
let publicationCurrentPage = 0;

function filterPublications() {
    const query = publicationSearch.value.trim().toLowerCase();
    const year = publicationYear.value;
    const matchingCards = [];

    publicationCards.forEach((card) => {
        const matchesQuery = !query || card.dataset.search.toLowerCase().includes(query);
        const matchesYear = year === 'all' || card.dataset.year === year;
        if (matchesQuery && matchesYear) {
            matchingCards.push(card);
        }
    });

    const pageCount = Math.ceil(matchingCards.length / publicationPageSize);
    publicationCurrentPage = Math.min(publicationCurrentPage, Math.max(pageCount - 1, 0));
    const pageStart = publicationCurrentPage * publicationPageSize;
    publicationCards.forEach((card) => {
        card.hidden = !matchingCards.includes(card) || !matchingCards.slice(pageStart, pageStart + publicationPageSize).includes(card);
    });

    publicationCount.textContent = `${matchingCards.length} publication${matchingCards.length === 1 ? '' : 's'}`;
    publicationEmpty.hidden = matchingCards.length !== 0;
    publicationPagination.hidden = pageCount <= 1;
    publicationPrevious.disabled = publicationCurrentPage === 0;
    publicationNext.disabled = publicationCurrentPage === pageCount - 1;
    publicationPage.textContent = `Page ${publicationCurrentPage + 1} of ${Math.max(pageCount, 1)}`;

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

publicationSearch.addEventListener('input', () => {
    publicationCurrentPage = 0;
    filterPublications();
});
publicationYear.addEventListener('change', () => {
    publicationCurrentPage = 0;
    filterPublications();
});
publicationReset.addEventListener('click', () => {
    publicationSearch.value = '';
    publicationYear.value = 'all';
    publicationCurrentPage = 0;
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

publicationPrevious.addEventListener('click', () => {
    publicationCurrentPage -= 1;
    filterPublications();
});
publicationNext.addEventListener('click', () => {
    publicationCurrentPage += 1;
    filterPublications();
});

const previousNewsItems = Array.from(document.querySelectorAll('[data-previous-news]'));
const newsPagination = document.querySelector('.content__news__pagination');
const newsPrevious = document.querySelector('[data-news-previous]');
const newsNext = document.querySelector('[data-news-next]');
const newsPage = document.querySelector('[data-news-page]');
const newsPageSize = 5;
let newsCurrentPage = 0;

function renderNewsPage() {
    if (!newsPagination) {
        return;
    }

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

if (newsPagination) {
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
}
renderNewsPage();

const projectCards = Array.from(document.querySelectorAll('[data-project]'));
const projectGrid = document.querySelector('.content__code__projects');
const projectPagination = document.querySelector('.content__code__pagination');
const projectPrevious = document.querySelector('[data-project-previous]');
const projectNext = document.querySelector('[data-project-next]');
const projectPage = document.querySelector('[data-project-page]');
let projectCurrentPage = 0;

function projectPageSize() {
    return 3;
}

function renderProjectPage() {
    const pageSize = projectPageSize();
    const pageCount = Math.ceil(projectCards.length / pageSize);
    projectCurrentPage = Math.min(projectCurrentPage, Math.max(pageCount - 1, 0));
    const start = projectCurrentPage * pageSize;

    projectCards.forEach((card, index) => {
        card.hidden = index < start || index >= start + pageSize;
    });
    projectPagination.hidden = pageCount <= 1;
    projectPrevious.disabled = projectCurrentPage === 0;
    projectNext.disabled = projectCurrentPage === pageCount - 1;
    projectPage.textContent = `Page ${projectCurrentPage + 1} of ${Math.max(pageCount, 1)}`;
}

projectPrevious.addEventListener('click', () => {
    projectCurrentPage -= 1;
    renderProjectPage();
});
projectNext.addEventListener('click', () => {
    projectCurrentPage += 1;
    renderProjectPage();
});
window.addEventListener('resize', renderProjectPage);
renderProjectPage();

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
