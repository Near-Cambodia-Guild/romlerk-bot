import { Telegram } from 'telegraf';
import schedule from 'node-schedule';
import * as dotenv from 'dotenv';
const { page_id } = require('./constant');
const { isToday } = require('./utils/isToday');

dotenv.config();
const botToken = process.env.BOT_TOKEN || "";
const groupID = process.env.GROUP_ID || "";
const tg = new Telegram(botToken);

const baseRule = new schedule.RecurrenceRule();
baseRule.tz = 'UTC+7';
baseRule.dayOfWeek = new schedule.Range(1, 5);
baseRule.minute = 0;

const sendReminder = () => {
    const rule = baseRule;
    rule.hour = 9;
    rule.minute = 0;

    const message = `
        Hi there!🥰 This is រំលឹក | Romlerk.\nWelcome the new day with a grateful heart.\n<b>Please update your task for today.</b>
    `
    schedule.scheduleJob(rule, () => {
        tg.sendMessage(
            groupID,
            message,
            {   
                reply_markup: {
                    inline_keyboard: [
                        [{ 
                            text: "Add To-dos", 
                            url: "https://radical-rocket-3f0.notion.site/ac7d5125e0eb4fe58cf8e23bc53c56f1?v=724e4384cd514d8cbb0a35de9f134746" 
                        }]
                    ]
                }, 
                parse_mode: 'HTML'
            }
        );
    });
}

const sendReminderAlert = () => {
    const rule = baseRule;
    rule.hour = 9;
    rule.minute = 45;

    schedule.scheduleJob(rule, () => {
        page_id.map((i: any) => {
            const url = `https://api.notion.com/v1/blocks/${i.id}/children`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'Notion-Version': '2022-06-28',
                    authorization: `Bearer ${process.env.NOTION_ACCESS_KEY}`
                }
            };
    
            fetch(url, options)
                .then((res: any) => res.json())
                .then((json: any) => {
                    const data = json.results;
                    let filter: any = [];
                    filter = data.filter((obj: any) => {
                        return obj.to_do !== undefined && isToday({date: obj.last_edited_time})
                    })
    
                    if(filter.length === 0) 
                        tg.sendMessage(
                            groupID, 
                            `Please update your task @ ${i.name}`,
                            {   
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ 
                                            text: "Add To-dos", 
                                            url: "https://radical-rocket-3f0.notion.site/ac7d5125e0eb4fe58cf8e23bc53c56f1?v=724e4384cd514d8cbb0a35de9f134746" 
                                        }]
                                    ]
                                }
                            }
                        );
                    
                })
                .catch((err: any) => console.error('error:' + err));
        })
    });
}

const sendUpdateTodo = () => {
    const rule = baseRule;
    rule.hour = 16;
    rule.minute = 30;

    const message = `Hi there!🥰.\nHow was your day? let's <i>រំលឹក | Romlerk</i> know <b>what you have done today.</b>`;
    schedule.scheduleJob(rule, () => {
        tg.sendMessage(
            groupID, 
            message,
            {   
                reply_markup: {
                    inline_keyboard: [
                        [{ 
                            text: "Update To-dos", 
                            url: "https://radical-rocket-3f0.notion.site/ac7d5125e0eb4fe58cf8e23bc53c56f1?v=724e4384cd514d8cbb0a35de9f134746" 
                        }]
                    ]
                }, 
                parse_mode: 'HTML'
            }
        );
    });
}

const sendAllResponse = () => {
    const rule = baseRule;
    rule.hour = 17;
    rule.minute = 0;

    schedule.scheduleJob(rule, () => {
        page_id.map((i: any) => {
            const url = `https://api.notion.com/v1/blocks/${i.id}/children`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'Notion-Version': '2022-06-28',
                    authorization: `Bearer ${process.env.NOTION_ACCESS_KEY}`
                }
            };
    
            fetch(url, options)
                .then((res: any) => res.json())
                .then((json: any) => {
                    const data = json.results;
                    let filter: any = [];
                    filter = data.filter((obj: any) => {
                        return obj.to_do !== undefined && isToday({date: obj.last_edited_time})
                    })
    
                    const todos = filter.map((i: any) => i.to_do);
    
                    const newArr: any[] = [];
                    todos.map((i: any) => {
                        let obj = {};
                        const checked = i?.checked;
                        const plain_text = i?.rich_text[0]?.plain_text;
                        obj = {text: plain_text, checked}
                        newArr.push(obj);
                    })
                    const filterArr = newArr.filter((obj: any) => {
                        return obj.text !== undefined
                    })
    
                    // <b>${i.name} To-dos:</b>\n${filterArr.map((i: any) => `${(i.checked) ? '[x]' : '[ ]'} ${i.text}\n`)}
                    const message = `
                    <b>${i.name} To-dos:</b>\n ${filterArr.map((i: any) => { 
                        return `${(i.checked) ? '[x]' : '[ ]'} ${i.text}\n`
                    })}
                    `;
                    
                    tg.sendMessage(groupID , message, {parse_mode: 'HTML'});
                })
                .catch((err: any) => console.error('error:' + err));
        })
    });
}

sendReminder();
sendReminderAlert();
sendUpdateTodo();
sendAllResponse();