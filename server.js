require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const router = require("./src/modules");
const { PORT } = require('./src/config')
const localText = require('./text.json')
const model = require('./model')
const { bot, botPayment } = require('./src/lib/bot')
const {
   CronJob
} = require('cron');

const productivity = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/produktivlikplanner1.png')
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/produktivlikplanner2.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/produktivlikplanner3.png'),
   }
]

const tasks = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/vazifalarplanneri1.png')
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/vazifalarplanneri2.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/vazifalarplanneri3.png'),
   }
]

const habit = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/odatlarplanneri1.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/odatlarplanneri2.png'),
   },
   {
      type: 'photo',
      media: fs.readFileSync('./images/odatlarplanneri3.png'),
   },
   // {
   //    type: 'video',
   //    media: fs.createReadStream('./images/odatlar.mp4')
   // }
]

const all = [
   {
      type: 'photo',
      media: fs.readFileSync('./images/ALL4.png'),
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
      media: fs.readFileSync('./images/ALL1.png'),
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
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         bot.sendMediaGroup(chatId, productivity,).then(async () => {
            const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Produktivlik;ac.ilova=Lifeplanneruz;a=4900000`;
            const base64Encoded = btoa(text);
            bot.sendMessage(chatId, localText?.productivityText, {
               reply_markup: {
                  inline_keyboard: [
                     [
                        {
                           text: localText?.clickBtnProductivity,
                           url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Produktivlik`
                        }
                     ],
                     [
                        {
                           text: localText?.paymeBtnProductivity,
                           url: `https://checkout.paycom.uz/${base64Encoded}`
                        }
                     ]
                  ]
               }
            }).then(async () => {
               const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Vazifalar;ac.ilova=Lifeplanneruz;a=4900000`;
               const base64Encoded = btoa(text);
               bot.sendMediaGroup(chatId, tasks,).then(async () => {
                  bot.sendMessage(chatId, localText?.taskText, {
                     reply_markup: {
                        inline_keyboard: [
                           [
                              {
                                 text: localText?.clickBtnTask,
                                 url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Vazifalar`
                              }
                           ],
                           [
                              {
                                 text: localText?.paymeBtnTask,
                                 url: `https://checkout.paycom.uz/${base64Encoded}`
                              }
                           ]
                        ]
                     }
                  })
               }).then(async () => {
                  const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Odatlar;ac.ilova=Lifeplanneruz;a=4900000`;
                  const base64Encoded = btoa(text);
                  bot.sendMediaGroup(chatId, habit,).then(async () => {
                     bot.sendMessage(chatId, localText?.habitText, {
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText?.clickBtnHabit,
                                    url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Odatlar`
                                 }
                              ],
                              [
                                 {
                                    text: localText?.paymeBtnHabit,
                                    url: `https://checkout.paycom.uz/${base64Encoded}`
                                 }
                              ]
                           ]
                        }
                     }).then(async () => {
                        const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Barchasi;ac.ilova=Lifeplanneruz;a=9900000`;
                        const base64Encoded = btoa(text);
                        bot.sendMediaGroup(chatId, all).then(async () => {
                           bot.sendMessage(chatId, localText?.allText, {
                              reply_markup: {
                                 inline_keyboard: [
                                    [
                                       {
                                          text: localText?.clickBtnAll,
                                          url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=99000&additional_param4=Barchasi`
                                       }
                                    ],
                                    [
                                       {
                                          text: localText?.paymeBtnAll,
                                          url: `https://checkout.paycom.uz/${base64Encoded}`
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
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            bot.sendMediaGroup(chatId, productivity,).then(async () => {
               const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Produktivlik;ac.ilova=Lifeplanneruz;a=4900000`;
               const base64Encoded = btoa(text);
               bot.sendMessage(chatId, localText?.productivityText, {
                  reply_markup: {
                     inline_keyboard: [
                        [
                           {
                              text: localText?.clickBtnProductivity,
                              url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Produktivlik`
                           }
                        ],
                        [
                           {
                              text: localText?.paymeBtnProductivity,
                              url: `https://checkout.paycom.uz/${base64Encoded}`
                           }
                        ]
                     ]
                  }
               }).then(async () => {
                  bot.sendMediaGroup(chatId, tasks,).then(async () => {
                     const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Vazifalar;ac.ilova=Lifeplanneruz;a=4900000`;
                     const base64Encoded = btoa(text);
                     bot.sendMessage(chatId, localText?.taskText, {
                        reply_markup: {
                           inline_keyboard: [
                              [
                                 {
                                    text: localText?.clickBtnTask,
                                    url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Vazifalar`
                                 }
                              ],
                              [
                                 {
                                    text: localText?.paymeBtnTask,
                                    url: `https://checkout.paycom.uz/${base64Encoded}`
                                 }
                              ]
                           ]
                        }
                     })
                  }).then(async () => {
                     bot.sendMediaGroup(chatId, habit,).then(async () => {
                        const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Odatlar;ac.ilova=Lifeplanneruz;a=4900000`;
                        const base64Encoded = btoa(text);
                        bot.sendMessage(chatId, localText?.habitText, {
                           reply_markup: {
                              inline_keyboard: [
                                 [
                                    {
                                       text: localText?.clickBtnHabit,
                                       url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=49000&additional_param4=Odatlar`
                                    }
                                 ],
                                 [
                                    {
                                       text: localText?.paymeBtnHabit,
                                       url: `https://checkout.paycom.uz/${base64Encoded}`
                                    }
                                 ]
                              ]
                           }
                        }).then(async () => {
                           bot.sendMediaGroup(chatId, all).then(async () => {
                              const text = `m=6784c7c8dc2f84a06fd0fe02;ac.user_id=${chatId};ac.tarif=Barchasi;ac.ilova=Lifeplanneruz;a=9900000`;
                              const base64Encoded = btoa(text);
                              bot.sendMessage(chatId, localText?.allText, {
                                 reply_markup: {
                                    inline_keyboard: [
                                       [
                                          {
                                             text: localText?.clickBtnAll,
                                             url: `https://my.click.uz/services/pay?merchant_id=34135&service_id=64727&transaction_param=Lifeplanneruz&additional_param3=${chatId}&amount=99000&additional_param4=Barchasi`
                                          }
                                       ],
                                       [
                                          {
                                             text: localText?.paymeBtnAll,
                                             url: `https://checkout.paycom.uz/${base64Encoded}`
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

const escapeMarkdownV2 = (text) => {
   return text.replace(/([_*[\]()~`>#+-=|{}.!\\])/g, '\\$1');
};

const formatMessage = (text, entities) => {
   if (!entities) return escapeMarkdownV2(text);

   let formattedText = text;
   for (const entity of entities.reverse()) {
      const { offset, length, type } = entity;
      const part = text.slice(offset, offset + length); // Do NOT escape here

      switch (type) {
         case 'bold':
            formattedText = formattedText.slice(0, offset) + `*${escapeMarkdownV2(part)}*` + formattedText.slice(offset + length);
            break;
         case 'italic':
            formattedText = formattedText.slice(0, offset) + `_${escapeMarkdownV2(part)}_` + formattedText.slice(offset + length);
            break;
         case 'text_link':
            formattedText = formattedText.slice(0, offset) + `[${escapeMarkdownV2(part)}](${entity.url})` + formattedText.slice(offset + length);
            break;
         case 'code':
            formattedText = formattedText.slice(0, offset) + `\`${escapeMarkdownV2(part)}\`` + formattedText.slice(offset + length);
            break;
         case 'pre':
            formattedText = formattedText.slice(0, offset) + `\`\`\`${escapeMarkdownV2(part)}\`\`\`` + formattedText.slice(offset + length);
            break;
         default:
            formattedText = formattedText.slice(0, offset) + escapeMarkdownV2(part) + formattedText.slice(offset + length);
            break;
      }
   }
   return formattedText; // Do NOT escape the entire formatted text again
};

botPayment.on('message', async (msg) => {
   const usersList = await model.usersList();
   let sentCount = 0;

   for (const user of usersList) {
      try {
         if (msg.text) {
            const styledText = formatMessage(msg.text, msg.entities);
            await bot.sendMessage(user.chat_id, styledText, { parse_mode: 'MarkdownV2' });
         } else if (msg.photo) {
            const photoFileId = msg.photo[msg.photo.length - 1].file_id;
            const styledCaption = formatMessage(msg.caption || '', msg.caption_entities);
            await bot.sendPhoto(user.chat_id, photoFileId, { caption: styledCaption, parse_mode: 'MarkdownV2' });
         } else if (msg.video) {
            const styledCaption = formatMessage(msg.caption || '', msg.caption_entities);
            await bot.sendVideo(user.chat_id, msg.video.file_id, { caption: styledCaption, parse_mode: 'MarkdownV2' });
         } else if (msg.audio) {
            const styledCaption = formatMessage(msg.caption || '', msg.caption_entities);
            await bot.sendAudio(user.chat_id, msg.audio.file_id, { caption: styledCaption, parse_mode: 'MarkdownV2' });
         } else if (msg.voice) {
            await bot.sendVoice(user.chat_id, msg.voice.file_id);
         } else if (msg.document) {
            const styledCaption = formatMessage(msg.caption || '', msg.caption_entities);
            await bot.sendDocument(user.chat_id, msg.document.file_id, { caption: styledCaption, parse_mode: 'MarkdownV2' });
         } else if (msg.location) {
            await bot.sendLocation(user.chat_id, msg.location.latitude, msg.location.longitude);
         } else if (msg.contact) {
            await bot.sendContact(user.chat_id, msg.contact.phone_number, msg.contact.first_name);
         } else if (msg.sticker) {
            await bot.sendSticker(user.chat_id, msg.sticker.file_id);
         } else {
            console.log(`Unhandled message type for user ${user.chat_id}`, msg);
            continue;
         }

         sentCount++;
      } catch (error) {
         console.error(`Failed to send message to user ${user.chat_id}:`, error);
      }
   }

   console.log(`Total messages sent successfully: ${sentCount}`);
});

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/images', express.static(path.resolve(__dirname, 'images')))
app.use("/api/v1", router);

app.get('/:chat_id/:tarif', async (req, res) => {
   const { chat_id, tarif } = req.params

   console.log(chat_id, tarif)

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

const job = new CronJob('0 16 * * *', async () => {
   const userCount = await model.userCount()
   const content = `User count: ${userCount?.count}`

   botPayment.sendMessage(397910090, content)
   botPayment.sendMessage(634041736, content)
});

// Start the job
job.start();

app.listen(PORT, console.log(PORT))