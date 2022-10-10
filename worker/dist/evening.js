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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv = __importStar(require("dotenv"));
const axios = require("axios").default;
const { page_id } = require('./constant');
const { isToday } = require('./utils/isToday');
dotenv.config();
const botToken = process.env.BOT_TOKEN || "";
const groupID = process.env.GROUP_ID || "";
const tg = new telegraf_1.Telegram(botToken);
const sendAllResponse = () => __awaiter(void 0, void 0, void 0, function* () {
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
});
// // const rule = baseRule;
// rule.hour = 17;
// rule.minute = 0;
// schedule.scheduleJob(rule, () => {
//         page_id.map((i: any) => {
//             const url = `https://api.notion.com/v1/blocks/${i.id}/children`;
//             const options: any = {
//                 method: 'GET',
//                 headers: {
//                     accept: 'application/json',
//                     'Notion-Version': '2022-06-28',
//                     authorization: `Bearer ${process.env.NOTION_ACCESS_KEY}`
//                 }
//         axios.request(options).then(function (response: any) {
//             console.log(response.data);
//         }).catch(function (error:any) {
//             console.error(error);
//           })
//         }
//     })
// }
//     fetch(url, options)
//         .then((res: any) => res.json())
//         .then((json: any) => {
//             const data = json.results;
//             let filter: any = [];
//             filter = data.filter((obj: any) => {
//                 return obj.to_do !== undefined && isToday({date: obj.last_edited_time})
//             })
//             const todos = filter.map((i: any) => i.to_do);
//             const newArr: any[] = [];
//             todos.map((i: any) => {
//                 let obj = {};
//                 const checked = i?.checked;
//                 const plain_text = i?.rich_text[0]?.plain_text;
//                 obj = {text: plain_text, checked}
//                 newArr.push(obj);
//             })
//             const filterArr = newArr.filter((obj: any) => {
//                 return obj.text !== undefined
//             })
//             // <b>${i.name} To-dos:</b>\n${filterArr.map((i: any) => `${(i.checked) ? '[x]' : '[ ]'} ${i.text}\n`)}
//             const message = `
//             =================\n<b>@${i.name} To-dos:</b>\n ${filterArr.map((i: any) => { 
//                 return `${(i.checked) ? '✅' : '[ ]'} ${i.text}\n`
//             })}
//             `;
//             tg.sendMessage(groupID , message, {parse_mode: 'HTML'});
//         })
//         .catch((err: any) => console.error('error:' + err));
//         })
//     });
// }
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // const rule = baseRule;
    // rule.hour = 17;
    // rule.minute = 0;
    yield sendAllResponse();
});
main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});
