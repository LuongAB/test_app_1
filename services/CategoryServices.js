import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

const API_PUBLIC_URL = API_ENDPOINT + "/public/app";

export const getAllCategory = options => axios.post(API_PUBLIC_URL + "/searchByPage", options);
