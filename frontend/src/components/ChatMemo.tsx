import React, { useState } from "react";
import { Results } from "../types";
import {
  Button, Typography, CardContent, Card, Grid, AppBar, Tabs, Tab,
} from "@mui/material";
import { MyCard, areaButtonStyle, categoryButtonStyle, keywordButtonStyle, MyCardHeader, MyDivContainer, } from "./../styles/Styles";
import MapLinkButton from "./MapButton";
import Map from "./Map";

// ChatMemoの引数の型定義
interface ChatProps {
  prevMessage: string;
  answer: string;
  spots: Results[];
}

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

const TabPanel: React.FC<{
  children?: React.ReactNode;
  index: number;
  value: number;
}> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Typography component="div" p={2}>
        {children}
      </Typography>
    )}
  </div>
);


/**
 * Chat内容のメモ化を行いレンダー処理を軽減する
 * @param prevMessage 直前の質問
 * @param answer 回答
 * @returns 再利用後のチャット内容
 */
const ChatMemo: React.FC<ChatProps> = ({ prevMessage, answer, spots }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <MyDivContainer>
        <Grid container direction="column" alignItems="center">
          <MyCard>
            <MyCardHeader title="Your Question" />
            <p>{prevMessage}</p>
          </MyCard>

          {/* <MyCard>
            <MyCardHeader title="Answer from ChatGPT" />
            <p>
              {answer.split(/\n/).map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    {item}
                    <br />
                  </React.Fragment>
                );
              })}
            </p>
          </MyCard> */}
          <MyCard>
            <MyCardHeader title="Recommended spots for you" />
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="LIST" {...a11yProps(0)} />
                <Tab label="MAP" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <br />
            <TabPanel value={value} index={0}>
              {!spots.length ? (
                <p>
                  質問からスポットをうまく抽出できませんでした。
                  <br />
                  質問内容を変更して再度お試しください。
                </p>
              ) : (
                spots.map((spot) => (
                  <Card key={spot.id} style={{ border: "1px solid #ccc" }}>
                    <CardContent>
                      <Typography variant="h6">
                        <strong>
                          名前：
                          <a
                            href={spot.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {spot.name}
                          </a>
                        </strong>
                        <MapLinkButton
                          location={{
                            name: spot.name,
                            lat: spot.geopoint.latitude,
                            lng: spot.geopoint.longitude,
                          }}
                          label="MAP"
                        />
                      </Typography>
                      <div>
                        エリア：
                        <Button
                          variant="contained"
                          style={areaButtonStyle}
                        //onClick={handleButtonClick}
                        >
                          {spot.area}
                        </Button>
                      </div>
                      <Typography variant="body1">
                        カテゴリ：
                        {spot.category
                          .split(",")
                          .map((category) => category.trim())
                          .filter((category) => category !== "") // 空のカテゴリをフィルタリング
                          .map((category, index) => (
                            <Button
                              variant="contained"
                              style={categoryButtonStyle}
                              key={index}
                            >
                              {category.trim()}
                              {/* onClick={handleButtonClick} */}
                            </Button>
                          ))}
                      </Typography>
                      <Typography variant="body1">
                        キーワード：
                        {spot.keyword
                          .split(",")
                          .map((keyword) => keyword.trim())
                          .filter((keyword) => keyword !== "") // 空のキーワードをフィルタリング
                          .map((keyword, index) => (
                            <Button
                              variant="contained"
                              style={keywordButtonStyle}
                              key={index}
                            >
                              {keyword.trim()}
                              {/* onClick={handleButtonClick} */}
                            </Button>
                          ))}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Map spots={spots} />
            </TabPanel>
          </MyCard>
        </Grid>
      </MyDivContainer>
    </div>
  );
};

export default ChatMemo;
