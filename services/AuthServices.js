import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

const PUBLIC_URL = API_ENDPOINT + "/public/api";
const CLUSTER_NOTIFICATION_URL = API_ENDPOINT + "/public/api/httpHelper/notification";

// Login
export const login = data =>
	axios.post(API_ENDPOINT + "/oauth/token", data, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic Y29yZV9jbGllbnQ6c2VjcmV0"
		}
	});

// Register
export const checkUsername = username =>
	axios.put(PUBLIC_URL + "/username", null, {
		params: {
			username
		}
	});

export const checkEmail = email =>
	axios.put(PUBLIC_URL + "/email", null, {
		params: {
			email
		}
	});

export const forgotPassword = data => axios.post(PUBLIC_URL + "/forgot-password", data);

export const forgotPassOTP = data => axios.put(PUBLIC_URL + "/OTP", data);

export const register = data => axios.post(PUBLIC_URL + "/register", data);

export const registerOTP = data => axios.put(PUBLIC_URL + "/OTP/register", data);

export const getTokenDevice = data => axios.post(CLUSTER_NOTIFICATION_URL, data);
