import React, { useState, FormEvent, useRef } from 'react';
import getGptResponse from '../api/ChatApi';
import { useChatEffect, useLoadingEffect, parseGptResponse } from './ChatUtil';
import { getSpots } from '../api/GetFireStoreData';
import ChatMemo from './ChatMemo';
import { Results } from "../types";
import {
    TextField,
    Grid,
    CardActions,
} from "@mui/material";
import { MyButton, MyCard, MyDivContainer, MyCardHeader, pStyle } from './../styles/Styles';

const App: React.FC = () => {

    const [message, setMessage] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [conversation, setConversation] = useState<{ role: string; content: string; }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const prevMessageRef = useRef<string>('');
    const [spots, setSpots] = useState<Results[]>([]);
    const maxMessageLength: number = 50;
    //const [keywords, setKeywords] = useState<string>('');
    const keywords: String = "Aquarium,Boyfriend,Cafes,Date,Enjoyment,Family,Fashionable,Gifts,Instagrammable,Interaction,Kids,Leisure,Onsen,Scenery,Sea";

    useChatEffect(answer, message, conversation, setConversation, setMessage);
    //useGetKeywordsEffect();
    useLoadingEffect(loading, setLoading);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!message) {
            alert('メッセージがありません。');
            return;
        }
        if (message.length > maxMessageLength) {
            alert(maxMessageLength + '文字以内で入力してください。');
            return;
        }
        if (loading) return;
        setLoading(true);

        // ChatGPTにアクセス
        const responseText = await getGptResponse(message, conversation);
        console.log(responseText);

        try {
            // ChatGPTの回答を配列にパージ
            const keywordArray: string[] = parseGptResponse(responseText) as string[];
            // keyword配列から観光地を取得
            const spotsArray: Results[] | undefined = await getSpots(keywordArray);
            setSpots(spotsArray as Results[]);
        } catch (error) {
            alert("正常な回答が得られませんでした。質問内容を変えて再度お試しください。");
            setLoading(false);
            return;
        }

        setAnswer(responseText);
        setLoading(false);
        // 今回の質問を格納
        prevMessageRef.current = message;
    };

    return (
        <div>
            <MyDivContainer>
                <Grid container direction="column" alignItems="center">
                    <MyCard>
                        <MyCardHeader title="Enter your question" /><br />

                        <form onSubmit={handleSubmit}>
                            <TextField
                                rows={5}
                                placeholder="例：家族旅行でおしゃれで海の見えるところに行きたいです。帰りにお土産も購入できる観光地を教えてください。"
                                value={message}
                                multiline
                                variant="outlined"
                                fullWidth
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                            />
                            <p style={{ textAlign: 'right', ...(message.length > maxMessageLength ? { color: 'red' } : {}) }}>
                                入力文字数:{message.length}/{maxMessageLength}
                            </p>
                            <CardActions>
                                <MyButton
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                // size="large"
                                >
                                    質問する
                                </MyButton>
                            </CardActions>
                        </form>
                    </MyCard>

                    {loading && (
                        <div className='loading'>
                            <p>回答中...</p>
                        </div>
                    )}
                </Grid>
            </MyDivContainer>

            {answer && !loading && <ChatMemo prevMessage={prevMessageRef.current} answer={answer} spots={spots} />}

        </div>
    );
};

export default App;





