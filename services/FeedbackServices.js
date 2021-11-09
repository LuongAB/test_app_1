import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

export const addFeedback = data => axios.post(API_ENDPOINT + "/public/app", data);
