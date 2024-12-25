require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const localText = require('./text.json')
const model = require('./model')

const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.BOT_TOKEN, {
   polling: {
      interval: 1000,
      autoStart: true,
      allowedUpdates: ['chat_member'] // Explicitly allow chat_member updates
   }
});

bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (foundUser) {
      const inputString = `m=6697d19280d270b331826481;ac.user_id=${chatId};ac.tarif=Planner;ac.ilova=Lifeplanneruz;a=500000`;
      const encodedString = btoa(inputString);

      bot.sendMessage(chatId, localText?.freeFileLink)
      bot.sendMessage(chatId, localText?.premiumFileText, {
         reply_markup: {
            inline_keyboard: [
               [{
                  text: localText.clickBtn,
                  url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=%1000&additional_param4=Planner`
               }],
               [{
                  text: localText.paymeBtn,
                  url: `https://checkout.paycom.uz/${encodedString}`
               }]
            ],
         }
      }).then(async () => {
         await model.editStep(chatId, 'pay')
      })
   } else {
      bot.sendMessage(chatId, localText.mainText, {
         reply_markup: {
            inline_keyboard: [
               [
                  {
                     text: localText.sendContact,
                     request_contact: true,
                     one_time_keyboard: true
                  }
               ]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         await model.editStep(chatId, 'contact')
      })
   }
})

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (msg.contact && foundUser?.step == 'contact') {
      let phoneNumber = msg.contact.phone_number;
      let name = msg.contact.first_name;

      if (msg.contact.user_id !== msg.from.id) {
         return bot.sendMessage(chatId, localText.contactErrorText, {
            reply_markup: {
               keyboard: [
                  [{
                     text: localText.sendContact,
                     request_contact: true
                  }]
               ],
               resize_keyboard: true,
               one_time_keyboard: true
            }
         })
      }

      if (!phoneNumber.startsWith('+')) {
         phoneNumber = `+${phoneNumber}`;
      }

      const addPhoneUser = await model.addUser(chatId, phoneNumber, name)

      if (addPhoneUser) {
         const inputString = `m=6697d19280d270b331826481;ac.user_id=${chatId};ac.tarif=Planner;ac.ilova=Lifeplanneruz;a=500000`;
         const encodedString = btoa(inputString);

         bot.sendMessage(chatId, localText.freeFileLink)
         bot.sendMessage(chatId, localText?.premiumFileText, {
            reply_markup: {
               inline_keyboard: [
                  [{
                     text: localText.clickBtn,
                     url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=%1000&additional_param4=Planner`
                  }],
                  [{
                     text: localText.clickBtn,
                     url: `https://checkout.paycom.uz/${encodedString}`
                  }]
               ],
            }
         }).then(async () => {
            await model.editStep(chatId, 'pay')
         })
      }
   }
})