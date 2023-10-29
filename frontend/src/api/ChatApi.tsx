import axios from 'axios';
import { getKeywords } from './GetFireStoreData';
import { systemStartContents, systemEndContents } from "./contents";

const API_URL = process.env.REACT_APP_GPTURL;
const MODEL = process.env.REACT_APP_GPTMODEL;
const API_KEY = process.env.REACT_APP_GPTAPIKEY;
/**
 * 質問内容からキーワードを抽出
 * @param message 質問
 * @param conversation 前回の会話
 * @returns keywordArray キーワード配列
 */
const getGptResponse = async (message: String, conversation: { role: String; content: String; }[]) => {
    try {
        // firestoreからkeywordsを取得
        const keywordData: String[] = await getKeywords() as String[];
        const systemContents = systemStartContents + keywordData.join(',') + systemEndContents
        console.log(systemContents);
        // axios.post(URL,request)をawaitする
        const response = await axios.post(API_URL as string,
            {
                // モデル ID の指定
                model: MODEL,
                max_tokens: 256,
                temperature: 0.2,
                // 質問内容
                messages:
                    [//...conversation,
                        { 'role': 'user', 'content': message + "Please output three or fewer categories in English." },
                        { 'role': 'system', 'content': systemContents }
                    ],
            },
            {
                // 送信する HTTP ヘッダー(認証情報)
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            });
        // 回答の取得
        // 回答例1:\n"Scenery",\n"Sea",\n"Fashionable",\n"Cafes",\n"Gifts"\n
        // 回答例2:```json\n[\n"Scenery",\n"Sea",\n"Fashionable",\n"Cafes",\n"Gifts"\n]\n```
        return response.data.choices[0].message.content.trim();

    } catch (error) {
        console.error(error);
        return null;
    }
}

export default getGptResponse;

/**
 * CharGPTAPIから回答を取得する
 * @param message 質問
 * @param conversation 以前の会話配列
 * @returns テスト回答
 */
export const getTestResponse = async (message: String, conversation: { role: String; content: String; }[]) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 3秒待つ
    const response: string = '```json\n[\n"Scenery",\n"Sea",\n"Fashionable",\n"Cafes",\n"Gifts"\n]\n```';
    return response;
}