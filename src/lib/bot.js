const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
   polling: {
      interval: 1000,
      autoStart: true,
      allowedUpdates: ['chat_member'] // Explicitly allow chat_member updates
   },
   request: {
      timeout: 30000, // Increase timeout to 30 seconds
   }
});

const botPayment = new TelegramBot(process.env.PAYMENT_BOT, {
   polling: {
      interval: 1000,
      autoStart: true,
      allowedUpdates: ['chat_member'] // Explicitly allow chat_member updates
   }
});

module.exports = { bot, botPayment }