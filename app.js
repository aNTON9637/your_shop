const tg = window.Telegram.WebApp;

// Инициализация приложения
tg.expand();
tg.ready();

// Данные товаров
const products = [
    {
        id: 1,
        name: 'Чипсы Принглс',
        price: 200,
        image: 'https://via.placeholder.com/150x150?text=Pringles'
    },
    {
        id: 2,
        name: 'Сникерс',
        price: 150,
        image: 'https://via.placeholder.com/150x150?text=Snickers'
    },
    {
        id: 3,
        name: 'Твикс',
        price: 180,
        image: 'https://via.placeholder.com/150x150?text=Twix'
    },
    {
        id: 4,
        name: 'Баунти',
        price: 160,
        image: 'https://via.placeholder.com/150x150?text=Bounty'
    }
];

// Корзина
let cart = [];

// Функция для отображения товаров
function renderProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price} ₽</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Добавить в корзину</button>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Функция для обновления кнопки корзины
function updateCartButton() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartButton = document.getElementById('cartButton');
    cartButton.textContent = `Корзина: ${total} ₽`;
    cartButton.classList.toggle('show', cart.length > 0);
}

// Функция для добавления товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartButton();
    }
}

// Функция для отправки заказа
function sendOrder() {
    if (cart.length > 0) {
        tg.sendData(JSON.stringify({
            type: 'order',
            items: cart
        }));
        tg.close();
    }
}

// Инициализация приложения
renderProducts();

// Обработка нажатия на кнопку корзины
document.getElementById('cartButton').addEventListener('click', sendOrder);
