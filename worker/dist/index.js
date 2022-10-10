"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const node_schedule_1 = __importDefault(require("node-schedule"));
const dotenv = __importStar(require("dotenv"));
const { page_id } = require('./constant');
const { isToday } = require('./utils/isToday');
dotenv.config();
const botToken = process.env.BOT_TOKEN || "";
const groupID = process.env.GROUP_ID || "";
const tg = new telegraf_1.Telegram(botToken);
const baseRule = new node_schedule_1.default.RecurrenceRule();
baseRule.tz = 'UTC+7';
baseRule.dayOfWeek = new node_schedule_1.default.Range(1, 5);
baseRule.minute = 0;
const sendReminder = () => {
    const rule = baseRule;
    rule.hour = 9;
    rule.minute = 0;
    const message = `
        Hi there!🥰 This is រំលឹក | Romlerk.\nWelcome the new day with a grateful heart.\n<b>Please update your task for today.</b>
    `;
    node_schedule_1.default.scheduleJob(rule, () => {
        tg.sendMessage(groupID, message, {
            reply_markup: {
                inline_keyboard: [
                    [{
                            text: "Add To-dos",
                            url: "https://radical-rocket-3f0.notion.site/ac7d5125e0eb4fe58cf8e23bc53c56f1?v=724e4384cd514d8cbb0a35de9f134746"
                        }]
                ]
            },
            parse_mode: 'HTML'
        });
    });
};
const sendReminderAlert = () => {
    const rule = baseRule;
    rule.hour = 9;
    rule.minute = 45;
    node_schedule_1.default.scheduleJob(rule, () => {
        page_id.map((i) => {
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
                .then((res) => res.json())
                .then((json) => {
                const data = json.results;
                let filter = [];
                filter = data.filter((obj) => {
                    return obj.to_do !== undefined && isToday({ date: obj.last_edited_time });
                });
                if (filter.length === 0)
                    tg.sendMessage(groupID, `Please update your task @ ${i.name}`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                        text: "Add To-dos",
                                        url: "https://radical-rocket-3f0.notion.site/ac7d5125e0eb4fe58cf8e23bc53c56f1?v=724e4384cd514d8cbb0a35de9f134746"
                                    }]
                            ]
                        }
                    });
            })
                .catch((err) => console.error('error:' + err));
        });
    });
};
const sendUpdateTodo = () => {
    const rule = baseRule;
    rule.hour = 16;
    rule.minute = 30;
    const message = `Hi there!🥰.\nHow was your day? let's <i>រំលឹក | Romlerk</i> know <b>what you have done today.</b>`;
    node_schedule_1.default.scheduleJob(rule, () => {
        tg.sendMessage(groupID, message, {
            reply_markup: {
                inline_keyboard: [
                    [{
                            text: "Update To-dos",
                            url: "https://radical-rocket-3f0.notion.site/ac7d5125e0eb4fe58cf8e23bc53c56f1?v=724e4384cd514d8cbb0a35de9f134746"
                        }]
                ]
            },
            parse_mode: 'HTML'
        });
    });
};
const sendAllResponse = () => {
    const rule = baseRule;
    rule.hour = 17;
    rule.minute = 0;
    page_id.map((i) => {
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
            .then((res) => res.json())
            .then((json) => {
            const data = json.results;
            let filter = [];
            filter = data.filter((obj) => {
                return obj.to_do !== undefined && isToday({ date: obj.last_edited_time });
            });
            const todos = filter.map((i) => i.to_do);
            const newArr = [];
            todos.map((i) => {
                var _a;
                let obj = {};
                const checked = i === null || i === void 0 ? void 0 : i.checked;
                const plain_text = (_a = i === null || i === void 0 ? void 0 : i.rich_text[0]) === null || _a === void 0 ? void 0 : _a.plain_text;
                obj = { text: plain_text, checked };
                newArr.push(obj);
            });
            const filterArr = newArr.filter((obj) => {
                return obj.text !== undefined;
            });
            const message = `
                    <b>${i.name} To-dos:</b>\n${filterArr.map((i) => `${(i.checked) ? '✅' : '[ ]'} ${i.text}\n`)}
                `;
            console.log(filterArr);
            tg.sendMessage(groupID, message, { parse_mode: 'HTML' });
        })
            .catch((err) => console.error('error:' + err));
    });
};
// sendReminder();
// sendReminderAlert();
// sendUpdateTodo();
sendAllResponse();
