import { DocumentData } from "firebase/firestore";

/**
 * spotsデータ型
 */
export interface Results {
  id: string;
  name: string;
  url: string;
  areaRef: DocumentData;
  categoryRef: DocumentData[string];
  keywordRef: DocumentData[string];
  area: string;
  category: string;
  keyword: string;
  geopoint: { latitude: number; longitude: number };
}

/**
 * axiosデータ型
 */
export interface ChatResponse {
  data: string;
  status: number;
  statusText: string;
}
