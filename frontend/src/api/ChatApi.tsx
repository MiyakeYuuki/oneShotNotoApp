import axios from 'axios';
import { getKeywords } from './GetFireStoreData';
import { systemStartContents, systemEndContents } from "./contents";
import { ChatResponse } from "../types";

/**
 * 質問内容からキーワードを抽出
 * @param message 質問
 * @returns keywordArray キーワード配列
 */
const getGptResponse = async (message: String) => {
    const url = process.env.REACT_APP_BACKEND_SERVER_URL as string;
    try {
        // firestoreからkeywordsを取得
        const keywordData: String[] = await getKeywords() as String[];

        // systemコンテンツの作成
        const systemContents = systemStartContents + keywordData.join(',') + systemEndContents
        console.log(systemContents);

        // GPTに送信するメッセージ作成
        const messages = [
            { 'role': 'system', 'content': systemContents },
            { 'role': 'user', 'content': message + "Please output three or fewer categories in English." },
        ];

        // バックエンドサーバーにリクエスト送信
        const response: ChatResponse = await axios.post(
            url,
            { content: JSON.stringify(messages) }
        );

        // 回答の取得
        // 回答例1:\n"Scenery",\n"Sea",\n"Fashionable",\n"Cafes",\n"Gifts"\n
        // 回答例2:```json\n[\n"Scenery",\n"Sea",\n"Fashionable",\n"Cafes",\n"Gifts"\n]\n```
        return response.data;

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