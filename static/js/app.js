// CODE FOR TAB BAR CIRCLE UPDATES

document.addEventListener('scroll', function() {
    let tab = document.getElementById('tab_bar');
    let circleIndicator = tab.getElementsByClassName('tab-bar__circle_indicator')[0];
    let size = tab.firstElementChild.clientHeight;

    document.querySelectorAll('.content').forEach(function(item) {
        let children = Array.from(item.children);

        children.forEach((childItem, key) => {
            if (isInViewport(childItem)) {
                circleIndicator.style.marginLeft = ((15 + size) * key) + "px";

                let color = getComputedStyle(document.documentElement).getPropertyValue('--theme-' + (key + 1));
                circleIndicator.style.backgroundColor = color;
            }
        });
    });
});

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.top <= window.innerHeight * 0.3 // -> percentage of page left before switching
    )
}

// CODE FOR ABSTRACT

function invertAbstract(event) {
    var abstract = event.target.parentNode.parentNode.getElementsByClassName("content__publist__paper__abstract")[0];
    if (abstract.style.display === "none") {
        abstract.style.display = "flex";
    }
    else {
        abstract.style.display = "none";
    }
}


// CODE FOR CITE MODAL

let modal = document.getElementById('modal');
let close = document.getElementById('modal_close');
let copy = document.getElementById('modal_copy');
let content = document.getElementById('modal_content');
let current_filename = null;
let fake_url = 'WHAT ARE YOU TRYING TO DO?';

close.onclick = function() {
    modal.classList.remove('content__publist__modal__exit_delay');
    modal.classList.remove('content__publist__modal__entry_delay');

    modal.classList.add('content__publist__modal__exit_delay');
    modal.classList.remove('content__publist__modal__show');
    current_filename = null;
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove('content__publist__modal__exit_delay');
        modal.classList.remove('content__publist__modal__entry_delay');

        modal.classList.add('content__publist__modal__exit_delay');
        modal.classList.remove('content__publist__modal__show');
        current_filename = null;
    }
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                return allText;
            }
        }
    }
    rawFile.send(null);
}

function openModal(event) {
    let filename = event.target.dataset.filename;

    filename = sanitize(filename);
    current_filename = filename;

    (async () => {
        const text = await (await fetch(filename)).text();
        content.innerText = text;
        content.style.whiteSpace = 'pre';
    })();

    modal.classList.remove('content__publist__modal__exit_delay');
    modal.classList.remove('content__publist__modal__entry_delay');
    
    modal.classList.add('content__publist__modal__entry_delay');
    modal.classList.add('content__publist__modal__show');
}

function copyContent() {
    navigator.clipboard.writeText(content.innerText);
}

// shitty but it's ok
function sanitize(url) {
    if (url.includes('../') || !url.includes('data'))
        return fake_url;
    return url;
}

function downloadContent() {
    let url = current_filename;
    url = sanitize(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}