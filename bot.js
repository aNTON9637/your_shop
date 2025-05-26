const TelegramBot = require('node-telegram-bot-api');

// Токен бота
const token = '8082929060:AAEYIz-xCv24f7SjjJZ5zxtKsQcO1pp7Wdg';
const bot = new TelegramBot(token, { polling: true });

// Обработка команд
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет! 👋\n\nДобро пожаловать в наш мини-магазин. Здесь вы можете быстро и удобно сделать заказ прямо на нашем сайте!\n\nПерейдите по ссылке: https://anton9637.github.io/your_shop/\n\nИли нажмите кнопку \'Магазин\' ниже. Желаем приятных покупок!', {
        reply_markup: {
            keyboard: [
                ['Магазин 🛍️']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

// Обработка текстовых сообщений
bot.onText(/Магазин 🛍️/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Открываю магазин...', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Перейти в магазин 🛍️',
                    web_app: {
                        url: 'https://anton9637.github.io/your_shop/'
                    }
                }
            ]]
        },
        disable_web_page_preview: true
    });
});

// Обработка данных из мини-приложения
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app_data.data);
    
    if (data.type === 'order') {
        const orderMessage = data.items.map(item => `${item.name} - ${item.price} ₽`).join('\n');
        bot.sendMessage(chatId, `Ваш заказ:\n${orderMessage}\n\nСпасибо за покупку! 🎉`, {
            reply_markup: {
                remove_keyboard: true
            }
        });
    }
});

console.log('Бот запущен!');
