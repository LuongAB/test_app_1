import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

const API_USER = API_ENDPOINT + "/api/users";
const API_GET_TOKEN = API_ENDPOINT + "/public/api/fcm";

export const getUserInfo = () => {
	var url = API_USER + "/getCurrentUser";
	return axios.get(url);
};


export const getTokenDevice = (token) => {
	var url = API_GET_TOKEN + "/getTokenDevice";
	return axios.post(url,token);
};


export const updateProfile = user => axios.put(API_USER, user);

export const changePassword = user => axios.put(API_USER + "/password/self", user);

export const updateUserAvatar = data =>
	axios.post(API_USER + "/updateavatar", data, {
		"Content-Type": "multipart/form-data"
	});

export const getUserAvatar = username => axios.get(ConstantList.API_ENPOINT + `/public/users/photo/${username}`);
