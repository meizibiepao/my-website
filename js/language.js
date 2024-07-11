

function changeLanguage(language) {
    if (language === 'cn') {
        language = 'zh-CN';
    } else if (['en', 'ko', 'zh-CN', 'zh-TW'].indexOf(language) === -1) {
        language = 'en';
    }
    localStorage.setItem('language', language);

    // console.log("document.dispatchEvent(new Event('languageChange'))");
    document.dispatchEvent(new Event('languageChange'));

    // console.log("document.dispatchEvent(new Event('updateWalletButton'))");
    // document.dispatchEvent(new Event('updateWalletButton'));
}

function loadTranslations() {
    // console.log("loadTranslations - language = ",language);

    let language = localStorage.getItem('language');
    if (language === 'cn') {
        language = 'zh-CN';
    } else if (['en', 'ko', 'zh-CN', 'zh-TW'].indexOf(language) === -1) {
        language = 'en';
    }
    

    // console.log("loadTranslations - language = ",language);
    fetch(`translations/${language}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => applyTranslations(data))
        .catch(error => console.error('Error loading translations:', error));
}

function applyTranslations(translations) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            // console.log("key = ",key);
            element.innerHTML = translations[key];
        }
    });
}

// document.addEventListener('DOMContentLoaded', () => {
//     const savedLanguage = localStorage.getItem('language') || navigator.language.split('-')[0] || 'en';
//     console.log(`Initial language set to: ${savedLanguage}`);
//     loadTranslations(savedLanguage);
//     // document.dispatchEvent(new Event('languageChange'));
// });
