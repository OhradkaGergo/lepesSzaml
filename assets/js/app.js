const AppTitle = "Lépésszámláló App";
const Author = "13.A Szoftverfejlesztő";
const Company = "Bajai SZC Türr István Technikum";
const ServerURL = "http://localhost:3000";

let title = document.querySelector('#Title');
let company = document.querySelector('#Company');
let author = document.querySelector('#Author');

title.innerHTML = AppTitle;
company.innerHTML = Company;
author.innerHTML = Author;

let lightmodeBtn = document.querySelector('#lightmodeBtn');
let darkmodeBtn = document.querySelector('#darkmodeBtn');

let main = document.querySelector('main');
let mainMenu = document.querySelector('#mainMenu');
let userMenu = document.querySelector('#userMenu');

let theme = 'light';
let loggedUser = null;

lightmodeBtn.addEventListener('click', () => {
    setTheme('light');
    saveTheme('light');
});

darkmodeBtn.addEventListener('click', () => {
    setTheme('dark');
    saveTheme('dark');
});

function loadTheme() {
    theme = 'light';
    if (localStorage.getItem('SCTheme')) {
        theme = localStorage.getItem('SCTheme');

    }
    setTheme(theme);
}

function saveTheme(theme) {
    localStorage.setItem('SCTheme', theme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme)
    setThemeBtn(theme);
}

function setThemeBtn(theme) {
    if (theme == 'light') {
        lightmodeBtn.classList.add('hide');
        darkmodeBtn.classList.remove('hide');
    }
    else {
        darkmodeBtn.classList.add('hide');
        lightmodeBtn.classList.remove('hide');
    }
}

async function render(view) {
    main.innerHTML = await (await fetch(`views/${view}.html`)).text();

    switch (view) {
        case "main": {
            setDate();
            break;
        }
    }
}

async function getLoggedUser() {
    if (sessionStorage.getItem('loggedUser')) {
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        mainMenu.classList.add('hide');
        userMenu.classList.remove('hide');
        await render('main');
    }
    else {
        loggedUser = null;
        mainMenu.classList.remove('hide');
        userMenu.classList.add('hide');
        await render('login');
    }
}

async function LoadComponent(page) {
    main.innerHTML = await (await fetch(`views/${page}.html`)).text();
    if (page == 'profile') {
        getProfile();
    };
}

loadTheme();
getLoggedUser();
