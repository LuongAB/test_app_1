import axios from "axios";
import { API_ENDPOINT } from "../constants/appConfig";

export const BASE_URL = API_ENDPOINT + "/api/cluster-disease";

export const getNotification = data =>
	axios.post(BASE_URL + "/notification", data, {
		params: {
			latitude: data.latitude,
			longitude: data.longitude
		}
	});

export const getListPatient = searchObject => {
	const config = {
		params: { month: searchObject.month, year: searchObject.year }
	};
	return axios.get(API_ENDPOINT + "/patientInformation/listPatient", config);
};

export const getListVector = searchObject => {
	const config = {
		params: { month: searchObject.month, year: searchObject.year }
	};
	return axios.get(API_ENDPOINT + "/dengue-location-item/listDengueLocationItem", config);
};
