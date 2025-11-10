
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения
    initApp();
});

function initApp() {
    // Инициализация навигации
    initNavigation();
    
    // Инициализация форм
    initForms();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация счетчиков
    initCounters();
    
    // Инициализация модальных окон
    initModals();
    
    // Инициализация слайдера
    initSlider();
    
    // Загрузка дополнительных данных
    loadAdditionalData();
}

// Навигация
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a, .btn[data-page]');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Обработка кликов по навигационным ссылкам
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            if (pageId) {
                switchPage(pageId);
            }
            
            // Закрыть мобильное меню, если оно открыто
            navLinksContainer.classList.remove('active');
        });
    });
    
    // Мобильное меню
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            this.textContent = navLinksContainer.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        }
    });
    
    // Подсветка активной страницы в навигации
    highlightActiveNavLink();
}

// Переключение страниц
function switchPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показать выбранную страницу
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Прокрутка к верху страницы
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Обновить URL (без перезагрузки страницы)
        history.pushState(null, null, `#${pageId}`);
        
        // Подсветить активную ссылку в навигации
        highlightActiveNavLink();
        
        // Запустить специфичные для страницы функции
        onPageLoad(pageId);
    }
}

// Подсветка активной ссылки в навигации
function highlightActiveNavLink() {
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;
    
    const pageId = currentPage.id;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Обработка загрузки конкретных страниц
function onPageLoad(pageId) {
    switch(pageId) {
        case 'services':
            initServicesPage();
            break;
        case 'about':
            initAboutPage();
            break;
        case 'contacts':
            initContactsPage();
            break;
        case 'home':
            initHomePage();
            break;
    }
}

// Формы
function initForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm(this);
        });
        
        // Валидация в реальном времени
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    // Форма быстрого заказа
    initQuickOrderForms();
}

// Валидация поля формы
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    
    clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
            break;
            
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Сообщение должно содержать минимум 10 символов';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Проверка email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Показать ошибку поля
function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Очистить ошибку поля
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Отправка контактной формы
function submitContactForm(form) {
    const formData = new FormData(form);
    const formInputs = form.querySelectorAll('input, textarea');
    
    let isValid = true;
    
    // Валидация всех полей
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    // Показать индикатор загрузки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Имитация отправки на сервер
    setTimeout(() => {
        // В реальном приложении здесь был бы fetch/XMLHttpRequest запрос
        console.log('Данные формы:', Object.fromEntries(formData));
        
        // Показать уведомление об успехе
        showNotification('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.', 'success');
        
        // Сбросить форму
        form.reset();
        
        // Восстановить кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Отправить данные в Google Analytics (если подключен)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'contact',
                'event_label': 'contact_form'
            });
        }
    }, 1500);
}

// Формы быстрого заказа
function initQuickOrderForms() {
    const quickOrderBtns = document.querySelectorAll('.quick-order-btn');
    
    quickOrderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            openQuickOrderModal(service);
        });
    });
}

// Анимации
function initAnimations() {
    // Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('.feature, .service-card, .stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Счетчики на странице "О компании"
function initCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counterElements.forEach(counter => {
        observer.observe(counter);
    });
}

// Анимация счетчика
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000; // 2 секунды
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Модальные окна
function initModals() {
    // Закрытие модальных окон
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openQuickOrderModal(service) {
    const modalHtml = `
        <div class="modal" id="quickOrderModal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3>Быстрый заказ: ${service}</h3>
                <form id="quickOrderForm">
                    <div class="form-group">
                        <label for="quickName">Ваше имя *</label>
                        <input type="text" id="quickName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="quickPhone">Телефон *</label>
                        <input type="tel" id="quickPhone" name="phone" required>
                    </div>
                    <input type="hidden" name="service" value="${service}">
                    <button type="submit" class="btn">Заказать</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('quickOrderModal');
    const form = document.getElementById('quickOrderForm');
    
    modal.style.display = 'block';
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitQuickOrderForm(this);
    });
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function submitQuickOrderForm(form) {
    const formData = new FormData(form);
    
    // Показать индикатор загрузки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Оформление...';
    submitBtn.disabled = true;
    
    // Имитация отправки
    setTimeout(() => {
        console.log('Быстрый заказ:', Object.fromEntries(formData));
        showNotification(`Заказ на "${formData.get('service')}" успешно оформлен!`, 'success');
        closeModal();
    }, 1000);
}

// Слайдер (для будущего использования)
function initSlider() {
    // Можно добавить слайдер для отзывов или примеров работ
    console.log('Слайдер инициализирован (заглушка)');
}

// Загрузка дополнительных данных
function loadAdditionalData() {
    // Загрузка отзывов
    loadTestimonials();
    
    // Загрузка акций
    loadPromotions();
}

function loadTestimonials() {
    // В реальном приложении здесь был бы fetch запрос
    const testimonials = [
        {
            name: "Ольга Иванова",
            company: "ООО 'ТехноПрофи'",
            text: "Сотрудничаем с АкваСервис более 3 лет. Ни разу не подвели с доставкой, вода всегда отличного качества."
        },
        {
            name: "Сергей Петров",
            company: "ИТ-компания 'КодМастер'",
            text: "Удобный график доставки, всегда вовремя. Сотрудники довольны качеством воды."
        }
    ];
    
    // Можно добавить отображение отзывов на странице
}

function loadPromotions() {
    // Загрузка текущих акций и специальных предложений
    // В реальном приложении - fetch запрос к API
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#0066cc';
    }
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Специфичные функции для страниц
function initHomePage() {
    // Дополнительная инициализация для главной страницы
    console.log('Главная страница загружена');
}

function initServicesPage() {
    // Инициализация страницы услуг
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            openQuickOrderModal(serviceName);
        });
    });
}

function initAboutPage() {
    // Дополнительная инициализация для страницы "О компании"
    console.log('Страница "О компании" загружена');
}

function initContactsPage() {
    // Инициализация карты (заглушка)
    initMap();
    
    // Добавление маски для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d\+\(\)\s-]/g, '');
        });
    }
}

function initMap() {
    // Заглушка для инициализации карты
    // В реальном приложении можно подключить Яндекс.Карты или Google Maps
    console.log('Карта инициализирована (заглушка)');
}

// Утилиты
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обработка изменения размера окна
window.addEventListener('resize', debounce(function() {
    // Адаптивные действия при изменении размера окна
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks) navLinks.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.textContent = '☰';
    }
}, 250));

// Обработка истории браузера
window.addEventListener('popstate', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchPage(hash);
    }
});

// Инициализация при первой загрузке
const initialHash = window.location.hash.substring(1);
if (initialHash && document.getElementById(initialHash)) {
    switchPage(initialHash);
}