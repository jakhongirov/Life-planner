require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const localText = require('./text.json')
const model = require('./model')

const TelegramBot = require('node-telegram-bot-api');
const { text } = require('stream/consumers');
const bot = new TelegramBot(process.env.BOT_TOKEN, {
   polling: {
      interval: 1000,
      autoStart: true,
      allowedUpdates: ['chat_member'] // Explicitly allow chat_member updates
   }
});

const productivity = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/prductivity1.png')
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/prductivity2.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/prductivity3.png'),
   }
]

const tasks = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/task1.png')
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/task2.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/task3.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/task4.png'),
   }
]

const habit = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/habit1.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/habit2.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/habit3.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/habit4.png'),
   }
]

const all = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/ALL1.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/ALL2.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/ALL3.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/ALL4.png'),
   }
]

bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (foundUser) {
      bot.sendMessage(chatId, localText.communityText, {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.communityBtn
                  }
               ]
            ]
         }
      }).then(async () => {
         bot.sendMediaGroup(chatId, productivity,).then(async () => {
            bot.sendMessage(chatId, localText?.productivityText, {
               reply_markup: {
                  inline_keyboard: [
                     [
                        {
                           text: localText?.clickBtnProductivity,
                           url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Produktivlik`
                        }
                     ]
                  ]
               }
            }).then(async () => {
               bot.sendMediaGroup(chatId, tasks,).then(async () => {
                  bot.sendMessage(chatId, localText?.taskText, {
                     reply_markup: {
                        inline_keyboard: [
                           [
                              {
                                 text: localText?.clickBtnTask,
                                 url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Vazifalar`
                              }
                           ]
                        ]
                     }
                  })
               }).then(async () => {
                  bot.sendMediaGroup(chatId, habit,).then(async () => {
                     bot.sendMessage(chatId, localText?.habitText, {
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText?.clickBtnHabit,
                                    url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Odatlar`
                                 }
                              ]
                           ]
                        }
                     }).then(async () => {
                        bot.sendMediaGroup(chatId, all).then(async () => {
                           bot.sendMessage(chatId, localText?.allText, {
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText?.clickBtnAll,
                                          url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=99000&additional_param4=Barchasi`
                                       }
                                    ]
                                 ]
                              }
                           })
                        })
                     })
                  })
               })
            })
         })
      })
   } else {
      bot.sendMessage(chatId, localText.mainText, {
         reply_markup: {
            keyboard: [
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
      })
   }
})

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (msg.contact) {
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
         bot.sendMessage(chatId, localText.communityText, {
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.communityBtn
                     }
                  ]
               ]
            }
         }).then(async () => {
            bot.sendMediaGroup(chatId, productivity,).then(async () => {
               bot.sendMessage(chatId, localText?.productivityText, {
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText?.clickBtnProductivity,
                              url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Produktivlik`
                           }
                        ]
                     ]
                  }
               }).then(async () => {
                  bot.sendMediaGroup(chatId, tasks,).then(async () => {
                     bot.sendMessage(chatId, localText?.taskText, {
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText?.clickBtnTask,
                                    url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Vazifalar`
                                 }
                              ]
                           ]
                        }
                     })
                  }).then(async () => {
                     bot.sendMediaGroup(chatId, habit,).then(async () => {
                        bot.sendMessage(chatId, localText?.habitText, {
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText?.clickBtnHabit,
                                       url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Odatlar`
                                    }
                                 ]
                              ]
                           }
                        }).then(async () => {
                           bot.sendMediaGroup(chatId, all).then(async () => {
                              bot.sendMessage(chatId, localText?.allText, {
                                 reply_markup: {
                                    inline_keyboard: [
                                       [
                                          {
                                             text: localText?.clickBtnAll,
                                             url: `https://my.click.uz/services/pay?merchant_id=26420&service_id=34442&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=99000&additional_param4=Barchasi`
                                          }
                                       ]
                                    ]
                                 }
                              })
                           })
                        })
                     })
                  })
               })
            })
         })
      }
   }
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;

   if (text == localText.communityBtn) {
      bot.sendMessage(chatId, localText.communityText)
   }
})

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));

app.get('/:chat_id/:tarif', async (req, res) => {
   const { chat_id, tarif } = req.params

   if (tarif == "Produktivlik") {
      bot.sendMessage(chat_id, localText.productivityTextLink)
   } else if (tarif == "Vazifalar") {
      bot.sendMessage(chat_id, localText.taskTextLink)
   } else if (tarif == "Odatlar") {
      bot.sendMessage(chat_id, localText.habitTextLink)
   } else if (tarif == "Barchasi") {
      bot.sendMessage(chat_id, localText.allTextLink)
   }

   return res.status(200).json({
      message: "ok"
   })
})

app.listen(9000, console.log(9000))