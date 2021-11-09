import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

const API_PUBLIC_URL = API_ENDPOINT + "/public/app";
// const ARTICLE_NOTIFICATION_URL = API_ENDPOINT + "/public/api/fcm/getTokenDevice";

export const getAllCategory = options => axios.post(API_PUBLIC_URL + "/searchByPage", options);

export const searchByPage = options => axios.post(API_PUBLIC_URL + "/searchByDto", options);

export const getArticleByID = id => axios.get(API_PUBLIC_URL + `/${id}`);

// export const articleTokenDevice = data => axios.post(ARTICLE_NOTIFICATION_URL, data);
