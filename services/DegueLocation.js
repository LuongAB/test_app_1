import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

const API_PUBLIC_URL = API_ENDPOINT + "/public/app";

export const saveHistoryDevice = data => axios.post(API_PUBLIC_URL + "/historyDevice", data);

export const getAllDengueLocation = () => axios.get(API_PUBLIC_URL + "/getDegueLocation");

export const countNotification = () => axios.post(API_PUBLIC_URL + "/CountNotification", {});
