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
dotenv.config();
dotenv.config();
const botToken = process.env.BOT_TOKEN || "";
const groupID = process.env.GROUP_ID || "";
const tg = new telegraf_1.Telegram(botToken);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const message = `Hi there!🥰.\nHow was your day? let's <i>រំលឹក | Romlerk</i> know <b>what you have done today.</b>`;
    yield tg.sendMessage(groupID, message, {
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
main()
    .then(() => process.exit(0))
    .catch(error => {
    console.error(error);
    process.exit(1);
});
