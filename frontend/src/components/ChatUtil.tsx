import { useEffect } from 'react';

/**
 * 読込アニメーションの表示
 * @param loading 読込中か否か
 * @param setLoading 
 */
export const useLoadingEffect = (
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    useEffect(() => {
        setLoading(loading);
    }, [loading]);
};

/**
 * ```json[string,string,...]```を配列に変換する
 * @param response ChatGPTからの回答
 * @returns string配列
 */
export const parseGptResponse = ((GptResponse: string): string[] | unknown => {
    let jsonString: string;

    // GptResponse に '```json' が含まれているかを確認
    if (GptResponse.includes('```json')) {
        // 文字列からJSON文字列部分を抽出
        const jsonStartIndex: number = GptResponse.indexOf('```json') + '```json'.length;
        const jsonEndIndex: number = GptResponse.lastIndexOf('```');
        jsonString = GptResponse.slice(jsonStartIndex, jsonEndIndex);
    } else {
        // '```json' が含まれていない場合、GptResponse 自体を JSON 文字列として扱う
        jsonString = GptResponse;
    }

    try {
        // JSON文字列をパースして配列に変換
        const jsonArray: string[] = JSON.parse(jsonString);
        const stringArray: string[] = jsonArray.map(item => item.toLowerCase());
        return stringArray;
    }
    catch (error) {
        throw error;
    }

});