import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

const API_PUBLIC_URL = API_ENDPOINT + "/public/app";

export const searchByPage = options => axios.post(API_PUBLIC_URL + "/healthOrganization/searchByPage", options);

export const getById = id => axios.get(API_PUBLIC_URL + `/healthOrganization/${id}`);
