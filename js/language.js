

function changeLanguage(language) {
    if (language === 'cn') {
        language = 'zh-CN';
    } else if (['en', 'ko', 'zh-CN', 'zh-TW'].indexOf(language) === -1) {
        language = 'en';
    }
    localStorage.setItem('language', language);
    loadTranslations(language);
    // console.log("document.dispatchEvent(new Event('languageChange'))");
    document.dispatchEvent(new Event('languageChange'));
}

function loadTranslations(language) {
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
