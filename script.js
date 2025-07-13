// Плавный скролл по якорям
const navLinks = document.querySelectorAll('.header__nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Анимация и подробная информация для преимуществ
const benefits = document.querySelectorAll('.benefit');
const benefitDetail = document.getElementById('benefitDetail');
let activeBenefit = null;
// --- Анимация преимуществ с flyout ---
const benefitFlyout = document.getElementById('benefitFlyout');
const flyoutIcon = document.getElementById('flyoutIcon');
const flyoutText = document.getElementById('flyoutText');
let flyoutActive = false;
let flyoutType = '';
let typeTextTimeout = null;

function typeText(text, el) {
    el.textContent = '';
    let i = 0;
    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            typeTextTimeout = setTimeout(type, 18 + Math.random()*40);
        }
    }
    type();
}

// --- Улучшенная анимация flyout для преимуществ ---
const flyoutOverlay = document.createElement('div');
flyoutOverlay.style.position = 'fixed';
flyoutOverlay.style.top = 0;
flyoutOverlay.style.left = 0;
flyoutOverlay.style.width = '100vw';
flyoutOverlay.style.height = '100vh';
flyoutOverlay.style.background = 'rgba(10,20,15,0.88)';
flyoutOverlay.style.zIndex = 99;
flyoutOverlay.style.opacity = 0;
flyoutOverlay.style.transition = 'opacity 0.4s';
flyoutOverlay.style.pointerEvents = 'none';
document.body.appendChild(flyoutOverlay);

let flyoutBenefit = null;
const flyoutImg = document.getElementById('flyoutImg');
const flyoutClose = document.getElementById('flyoutClose');
const flyoutBg = document.getElementById('flyoutBg');

function openFlyout(benefit) {
    if (flyoutActive) return;
    flyoutActive = true;
    flyoutBenefit = benefit;
    document.body.style.overflow = 'hidden';
    benefits.forEach(b => {
        b.classList.remove('active', 'hovered');
        const stickerSpan = b.querySelector('.benefit__icon .benefit-sticker');
        if (stickerSpan) stickerSpan.remove();
    });
    benefit.classList.add('active');
    // Определяем позицию: left, center, right
    const benefitArr = Array.from(benefits);
    const idx = benefitArr.indexOf(benefit);
    let pos = 'center';
    if (idx === 0) pos = 'left';
    else if (idx === benefitArr.length - 1) pos = 'right';
    // В flyout показываем только крупный стикер с нужным позиционированием
    const sticker = benefit.getAttribute('data-sticker');
    flyoutIcon.className = 'benefit-flyout__icon ' + pos + ' active';
    flyoutIcon.innerHTML = sticker ? `<span class='benefit-sticker-flyout show'>${sticker}</span>` : '';
    flyoutText.classList.remove('visible');
    benefitFlyout.style.display = 'flex';
    benefitFlyout.style.top = '0';
    // Показываем затемнение и блюр
    if (flyoutBg) flyoutBg.classList.add('active');
    setTimeout(() => {
        benefitFlyout.classList.add('active');
        setTimeout(() => {
            flyoutText.classList.add('visible');
            typeText(benefit.getAttribute('data-detail'), flyoutText);
        }, 400);
    }, 10);
}
function closeFlyout() {
    if (!flyoutActive) return;
    flyoutActive = false;
    document.body.style.overflow = '';
    flyoutText.classList.remove('visible');
    flyoutIcon.classList.remove('active');
    benefitFlyout.classList.remove('active');
    if (flyoutBg) flyoutBg.classList.remove('active');
    clearTimeout(typeTextTimeout);
    if (flyoutBenefit) {
        const stickerSpan = flyoutBenefit.querySelector('.benefit__icon .benefit-sticker');
        if (stickerSpan) stickerSpan.remove();
    }
    setTimeout(() => {
        benefitFlyout.style.display = 'none';
        if (flyoutBenefit) flyoutBenefit.classList.remove('active', 'hovered');
        flyoutBenefit = null;
    }, 500);
}
benefits.forEach(benefit => {
    benefit.addEventListener('mouseenter', () => {
        if (!flyoutActive) benefit.classList.add('hovered');
    });
    benefit.addEventListener('mouseleave', () => {
        benefit.classList.remove('hovered');
        if (!flyoutActive) benefit.classList.remove('active');
    });
    benefit.addEventListener('click', (e) => {
        e.stopPropagation();
        if (flyoutActive && flyoutBenefit === benefit) {
            closeFlyout();
        } else {
            openFlyout(benefit);
        }
    });
});
document.body.addEventListener('click', (e) => {
    if (flyoutActive && !benefitFlyout.contains(e.target) && e.target !== flyoutBenefit) {
        closeFlyout();
    }
});
window.addEventListener('resize', () => {
    if (flyoutActive && flyoutBenefit) {
        const rect = flyoutBenefit.getBoundingClientRect();
        benefitFlyout.style.top = Math.max(rect.top, 40) + 'px';
    }
});
flyoutClose.addEventListener('click', closeFlyout);

// Перемещаем overlay и flyout внутрь секции преимуществ, чтобы не перекрывать FAQ
const benefitsSection = document.querySelector('.benefits');
if (benefitsSection && benefitFlyout && flyoutOverlay) {
    benefitsSection.appendChild(flyoutOverlay);
    benefitsSection.appendChild(benefitFlyout);
}

// Иконки преимуществ (SVG)
function setBenefitIcons() {
    document.querySelectorAll('.icon-money').forEach(el => {
        if (!el.querySelector('svg')) {
            el.innerHTML = '';
            el.innerHTML = '<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#00ff99" stroke-width="3"/><text x="18" y="23" text-anchor="middle" font-size="18" fill="#00ff99" font-family="Arial">₿</text></svg>';
        }
    });
    document.querySelectorAll('.icon-shield').forEach(el => {
        if (!el.querySelector('svg')) {
            el.innerHTML = '';
            el.innerHTML = '<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4L30 9V18C30 26 18 32 18 32C18 32 6 26 6 18V9L18 4Z" stroke="#00ff99" stroke-width="3" fill="none"/><text x="18" y="24" text-anchor="middle" font-size="16" fill="#00ff99" font-family="Arial">K</text></svg>';
        }
    });
    document.querySelectorAll('.icon-ai').forEach(el => {
        if (!el.querySelector('svg')) {
            el.innerHTML = '';
            el.innerHTML = '<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#00ff99" stroke-width="3"/><rect x="12" y="12" width="12" height="12" rx="6" stroke="#00ff99" stroke-width="2"/><circle cx="18" cy="18" r="2" fill="#00ff99"/></svg>';
        }
    });
    document.querySelectorAll('.icon-users').forEach(el => {
        if (!el.querySelector('svg')) {
            el.innerHTML = '';
            el.innerHTML = '<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="12" cy="15" r="5" stroke="#00ff99" stroke-width="2"/><circle cx="24" cy="15" r="5" stroke="#00ff99" stroke-width="2"/><ellipse cx="18" cy="26" rx="10" ry="5" stroke="#00ff99" stroke-width="2"/></svg>';
        }
    });
}
setBenefitIcons();

// Анимация отзывов и звёзд
const reviews = document.querySelectorAll('.review');
let activeReview = null;
reviews.forEach(review => {
    review.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeReview === review) {
            review.classList.remove('active');
            setStars(review, false);
            activeReview = null;
            return;
        }
        reviews.forEach(r => { r.classList.remove('active'); setStars(r, false); });
        review.classList.add('active');
        setStars(review, true);
        activeReview = review;
    });
});
document.body.addEventListener('click', () => {
    reviews.forEach(r => { r.classList.remove('active'); setStars(r, false); });
    activeReview = null;
});
function setStars(review, animate) {
    const starsDiv = review.querySelector('.review__stars');
    const stars = parseInt(review.getAttribute('data-stars'));
    starsDiv.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'review__star';
        star.textContent = '★';
        starsDiv.appendChild(star);
    }
    if (animate) {
        let i = 0;
        const starsArr = starsDiv.querySelectorAll('.review__star');
        function animateStar() {
            if (i < stars) {
                starsArr[i].classList.add('active');
                i++;
                setTimeout(animateStar, 180);
            }
        }
        animateStar();
    } else {
        const starsArr = starsDiv.querySelectorAll('.review__star');
        for (let i = 0; i < stars; i++) {
            starsArr[i].classList.add('active');
        }
    }
}
reviews.forEach(r => setStars(r, false));

// Модальное окно регистрации
const regModal = document.getElementById('regModal');
const openRegModal = document.getElementById('openRegModal');
const closeRegModal = document.getElementById('closeRegModal');
const regForm = document.getElementById('regForm');
const regSuccess = document.getElementById('regSuccess');

openRegModal.addEventListener('click', e => {
    e.preventDefault();
    regModal.classList.add('active');
});
closeRegModal.addEventListener('click', () => {
    regModal.classList.remove('active');
    regForm.style.display = '';
    regSuccess.style.display = 'none';
});
window.addEventListener('click', e => {
    if (e.target === regModal) {
        regModal.classList.remove('active');
        regForm.style.display = '';
        regSuccess.style.display = 'none';
    }
});
regForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const fio = regForm.fio.value;
    const phone = regForm.phone.value;
    const date = regForm.date.value;
    try {
        await fetch('https://forms.office.com/formapi/api/submit?formId=40dba97237c8a249&EaqdNxqOWOdFiqYskGGX5G4BsR0mGQxBg3qrq2DleqlISg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fio, phone, date })
        });
        regForm.style.display = 'none';
        regSuccess.style.display = 'block';
    } catch (err) {
        alert('Ошибка отправки. Попробуйте позже.');
    }
});

// Мобильное меню-бургер
const burgerMenu = document.getElementById('burgerMenu');
const mainNav = document.getElementById('mainNav');
let navOpen = false;
function toggleNav(open) {
    navOpen = typeof open === 'boolean' ? open : !navOpen;
    if (navOpen) {
        mainNav.classList.add('open');
        document.body.style.overflow = 'hidden';
        burgerMenu.setAttribute('aria-label', 'Закрыть меню');
    } else {
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
        burgerMenu.setAttribute('aria-label', 'Открыть меню');
    }
}
burgerMenu.addEventListener('click', e => {
    e.stopPropagation();
    toggleNav();
});
burgerMenu.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleNav();
    }
});
mainNav.addEventListener('click', e => {
    if (e.target.tagName === 'A') toggleNav(false);
});
document.addEventListener('click', e => {
    if (navOpen && !mainNav.contains(e.target) && e.target !== burgerMenu) {
        toggleNav(false);
    }
});
document.addEventListener('keydown', e => {
    if (navOpen && e.key === 'Escape') toggleNav(false);
}); 

// --- Эффект исчезновения секций при скролле ---
const fadeSections = document.querySelectorAll('.hero, .marketcap, .benefits, .bonus, .reviews, .faq, .cta, .footer, .page-spacer');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0) scale(1)';
        } else {
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight) {
                // Ниже экрана
                entry.target.style.opacity = 0;
                entry.target.style.transform = 'translateY(80px) scale(0.96)';
            } else {
                // Выше экрана
                entry.target.style.opacity = 0;
                entry.target.style.transform = 'translateY(-80px) scale(0.96)';
            }
        }
    });
}, { threshold: 0.12 });
fadeSections.forEach(section => {
    section.style.transition = 'opacity 0.7s, transform 0.7s';
    fadeObserver.observe(section);
}); 

// Для кнопки 'Начать торговать' (hero__btn)
const heroBtn = document.querySelector('.hero__btn');
if (heroBtn) {
    heroBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const cta = document.getElementById('cta');
        if (cta) {
            cta.scrollIntoView({ behavior: 'smooth' });
        }
    });
} 

// --- Рыночная капитализация: загрузка курсов USD, RUB ---
async function updateMarketcap() {
    try {
        // Получаем курсы USD и RUB с cbr.ru (XML)
        const cbrRes = await fetch('https://www.cbr.ru/scripts/XML_daily.asp');
        if (!cbrRes.ok) throw new Error('CBR API error');
        const xmlText = await cbrRes.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        // USD
        const usdNode = Array.from(xml.getElementsByTagName('Valute')).find(v => v.getElementsByTagName('CharCode')[0].textContent === 'USD');
        const usdRub = usdNode ? parseFloat(usdNode.getElementsByTagName('Value')[0].textContent.replace(',', '.')) : null;
        if (usdRub) {
            document.getElementById('usdRate').textContent = '1 $ = ' + usdRub.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' ₽';
            document.getElementById('rubRate').textContent = '1 ₽ = ' + (1/usdRub).toLocaleString('en-US', {maximumFractionDigits: 4}) + ' $';
        } else {
            document.getElementById('usdRate').textContent = 'нет данных';
            document.getElementById('rubRate').textContent = 'нет данных';
        }
    } catch (e) {
        document.getElementById('usdRate').textContent = 'нет данных';
        document.getElementById('rubRate').textContent = 'нет данных';
        setTimeout(updateMarketcap, 10000);
    }
}
updateMarketcap(); 

// --- Эффект "матрицы" на фоне ---
(function matrixEffect() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let fontSize = Math.max(14, Math.floor(width / 80));
    let columns = Math.floor(width / fontSize);
    let drops = [];
    let chars = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    chars = chars.split('');
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        fontSize = Math.max(14, Math.floor(width / 80));
        columns = Math.floor(width / fontSize);
        drops = Array(columns).fill(1 + Math.random() * height / fontSize);
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
        ctx.fillStyle = 'rgba(5, 8, 7, 0.13)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = fontSize + 'px monospace';
        ctx.textAlign = 'center';
        for (let i = 0; i < columns; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = 'rgba(0,255,153,0.38)';
            ctx.shadowColor = '#00ff99';
            ctx.shadowBlur = 8;
            ctx.fillText(text, i * fontSize + fontSize/2, drops[i] * fontSize);
            ctx.shadowBlur = 0;
            if (Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 1 + Math.random()*0.5;
            if (drops[i] * fontSize > height) {
                drops[i] = 0;
            }
        }
    }
    setInterval(draw, 55);
})(); 

// --- Анимация логотипа "Light" как в консоли ---
(function animateConsoleTitle() {
    const title = 'Light';
    const el = document.getElementById('consoleTitle');
    const cursor = document.getElementById('consoleCursor');
    let state = 'typing'; // typing | waiting | erasing
    let i = 0;
    function type() {
        if (i <= title.length) {
            el.textContent = title.slice(0, i);
            i++;
            setTimeout(type, 120);
        } else {
            state = 'waiting';
            setTimeout(() => { state = 'erasing'; erase(); }, 1800);
        }
    }
    function erase() {
        if (i >= 0) {
            el.textContent = title.slice(0, i);
            i--;
            setTimeout(erase, 80);
        } else {
            state = 'typing';
            setTimeout(() => { i = 0; type(); }, 600);
        }
    }
    type();
    setInterval(() => {
        if (state === 'waiting') return;
        if (state === 'typing' || state === 'erasing') return;
        i = 0;
        state = 'typing';
        type();
    }, 5000);
})(); 