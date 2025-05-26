// Обработка кликов по кнопкам категорий
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Добавляем класс активности для выбранной категории
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Здесь будет логика для отображения товаров по категории
        console.log('Выбрана категория:', category);
        
        // Пример: показываем модальное окно с товарами
        showCategoryProducts(category);
    });
});

// Функция для отображения товаров по категории
function showCategoryProducts(category) {
    // Здесь будет логика для загрузки и отображения товаров
    // Пока просто показываем уведомление
    alert(`Выбрана категория: ${category}`);
}

// Добавляем стили для активной кнопки
const style = document.createElement('style');
style.textContent = `
    .category-btn.active {
        background: rgba(0, 0, 0, 0.3);
        border-color: #000;
    }
`;
document.head.appendChild(style);

// Добавляем анимацию при наведении на кнопки
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Карусель
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.carousel-slide');
const slideCount = slides.length;

// Функции для работы с товарами
function changeQuantity(button, delta) {
    const input = button.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(input.value);
    const newValue = currentValue + delta;
    if (newValue >= 1) {
        input.value = newValue;
    }
}

function addToCart(card) {
    const productInfo = {
        name: card.querySelector('.product-info h3').textContent,
        price: card.querySelector('.product-price span').textContent,
        quantity: parseInt(card.querySelector('.quantity-input').value),
        image: card.querySelector('.product-image img').src
    };

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => item.name === productInfo.name);
    if (existingItem) {
        existingItem.quantity += productInfo.quantity;
    } else {
        cart.push(productInfo);
    }

    // Обновляем количество товаров в корзине
    updateCartCount();
    
    // Показываем уведомление
    showNotification(`Добавлено ${productInfo.quantity} ${productInfo.name}`);
}

// Функция обновления счетчика корзины
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }
}

// Функция показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Добавляем обработчики событий для кнопок "Добавить в корзину"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        addToCart(card);
    });
});

// Инициализация корзины
let cart = [];

// Добавляем копии слайдов для бесконечной карусели
for (let i = 0; i < slideCount; i++) {
    const clone = slides[i].cloneNode(true);
    carousel.appendChild(clone);
}

let currentSlide = 0;
let isDragging = false;
let startX;
let currentX;
let isScrolling = false;

function showSlide(index) {
    currentSlide = index;
    // Добавляем плавную анимацию
    carousel.style.transition = 'transform 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Плавная смена активного состояния
    slides.forEach(slide => {
        slide.classList.remove('active');
        setTimeout(() => slide.classList.remove('active'), 500);
    });
    
    // Находим активный слайд в оригинальных слайдах
    const activeIndex = currentSlide % slideCount;
    slides[activeIndex].classList.add('active');
    setTimeout(() => slides[activeIndex].classList.add('active'), 500);
}

// Функция для коррекции позиции карусели
function adjustCarousel() {
    if (currentSlide >= slideCount * 2 - 1) {
        currentSlide = slideCount;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    } else if (currentSlide < slideCount) {
        currentSlide = 0;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

function startDrag(e) {
    if (isScrolling) return;
    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    carousel.style.transition = 'none';
}

function drag(e) {
    if (!isDragging) return;
    
    currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;
    
    // Добавляем ограничение на движение в пределах одного слайда
    const maxDiff = 100;
    const clampedDiff = Math.max(-maxDiff, Math.min(maxDiff, diff));
    
    carousel.style.transform = `translateX(-${currentSlide * 100 + clampedDiff}px)`;
}

function endDrag(e) {
    if (!isDragging) return;
    
    isDragging = false;
    carousel.style.transition = 'transform 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    const diff = startX - currentX;
    
    // Уменьшаем порог для срабатывания свайпа
    if (Math.abs(diff) > 30) {
        if (diff > 0) {
            currentSlide++;
        } else {
            currentSlide--;
        }
        adjustCarousel();
    } else {
        adjustCarousel();
    }
}

// Добавляем обработчики событий для десктопа
carousel.addEventListener('mousedown', startDrag);
carousel.addEventListener('mousemove', drag);
carousel.addEventListener('mouseup', endDrag);

// Добавляем обработчики событий для мобильных устройств
carousel.addEventListener('touchstart', startDrag);
carousel.addEventListener('touchmove', drag);
carousel.addEventListener('touchend', endDrag);

// Добавляем обработчик для предотвращения прокрутки страницы при свайпе
carousel.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Автоматическая смена слайдов
let autoSlideInterval = setInterval(() => {
    const newIndex = (currentSlide + 1) % (slideCount * 2);
    showSlide(newIndex);
}, 8000);

// Функции для работы с товарами
function changeQuantity(button, delta) {
    const input = button.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(input.value);
    const newValue = currentValue + delta;
    if (newValue >= 1) {
        input.value = newValue;
    }
}

function addToCart(card) {
    const productInfo = {
        name: card.querySelector('.product-info h3').textContent,
        price: card.querySelector('.product-price span').textContent,
        quantity: card.querySelector('.quantity-input').value
    };
    
    // Здесь можно добавить логику добавления в корзину
    console.log('Добавлено в корзину:', productInfo);
}

// Функции для фильтрации товаров
function filterProducts(brand) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productBrand = product.querySelector('.product-info h3').textContent.toLowerCase();
        if (productBrand.includes(brand.toLowerCase())) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function showAllProducts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        product.style.display = 'block';
    });
}

// Добавляем обработчики событий для кнопок "Добавить в корзину"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        addToCart(card);
    });
});

// Инициализация корзины
let cart = [];

// Функция добавления товара в корзину
function addToCart(card) {
    const productInfo = {
        name: card.querySelector('.product-info h3').textContent,
        price: card.querySelector('.product-price span').textContent,
        quantity: parseInt(card.querySelector('.quantity-input').value),
        image: card.querySelector('.product-image img').src
    };

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => item.name === productInfo.name);
    if (existingItem) {
        existingItem.quantity += productInfo.quantity;
    } else {
        cart.push(productInfo);
    }

    // Обновляем количество товаров в корзине
    updateCartCount();
    
    // Показываем уведомление
    showNotification(`Добавлено ${productInfo.quantity} ${productInfo.name}`);
}

// Функция обновления счетчика корзины
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }
}

// Функция показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Остановка автоматической смены при взаимодействии с каруселью
carousel.addEventListener('mousedown', () => clearInterval(autoSlideInterval));
carousel.addEventListener('touchstart', () => clearInterval(autoSlideInterval));
carousel.addEventListener('mouseup', () => {
    autoSlideInterval = setInterval(() => {
        const newIndex = (currentSlide + 1) % (slideCount * 2);
        showSlide(newIndex);
    }, 8000);
});
carousel.addEventListener('touchend', () => {
    autoSlideInterval = setInterval(() => {
        const newIndex = (currentSlide + 1) % (slideCount * 2);
        showSlide(newIndex);
    }, 8000);
});

// Обработчики для кнопок навигации
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slideCount * 2) % (slideCount * 2);
    showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % (slideCount * 2);
    showSlide(currentSlide);
});

// Автоматическая смена слайдов
let autoSlideInterval = setInterval(() => {
    const newIndex = (currentSlide + 1) % slides.length;
    showSlide(newIndex);
}, 8000); // Увеличиваем интервал до 8 секунд

// Добавляем плавную анимацию для автоматической смены
function showSlide(index) {
    currentSlide = index;
    // Добавляем плавную анимацию
    carousel.style.transition = 'transform 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Плавная смена активного состояния
    slides.forEach(slide => {
        slide.classList.remove('active');
        setTimeout(() => slide.classList.remove('active'), 500);
    });
    
    slides[currentSlide].classList.add('active');
    setTimeout(() => slides[currentSlide].classList.add('active'), 500);
}

// Остановка автоматической смены при взаимодействии с каруселью
carousel.addEventListener('mousedown', () => clearInterval(autoSlideInterval));
carousel.addEventListener('touchstart', () => clearInterval(autoSlideInterval));

carousel.addEventListener('mouseup', () => {
    autoSlideInterval = setInterval(() => {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }, 5000);
});

carousel.addEventListener('touchend', () => {
    autoSlideInterval = setInterval(() => {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }, 5000);
});

// Добавляем плавную прокрутку для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
