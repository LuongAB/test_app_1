import * as CryptoJS from "crypto-js";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Block, Button } from "galio-framework";
import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, View, PermissionsAndroid, Linking, Platform } from "react-native";
import { Images } from "../constants";
import { countNotification, getAllDengueLocation, saveHistoryDevice } from "../services/DegueLocation";
import { getTokenDevice } from "../services/UserServices";
import { withTranslation } from "react-i18next";

const { width } = Dimensions.get("screen");
const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true
	})
});

class About extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listPatientInformation: [],
			listDengueLocationItem: [],
			checkOldDengue: false
		};
	}

	registerForPushNotificationsAsync = async () => {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Quyền thông báo của ứng dụng đã bị từ chối !");
		}

		const { status: locationStatus } = await Location.getPermissionsAsync();
		if (locationStatus !== "granted") {
			const { status } = await Location.requestPermissionsAsync();
			if (status !== "granted") {
				alert("Quyền truy cập vị trí đã bị từ chối !");
			}
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				enableVibrate: true,
				showBadge: true,
				lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
			});
		}
	};

	checkDistance = (listPatient, listDengue, latNew, longNew) => {
		let checkDengue = false;
		listPatient?.forEach(element => {
			let meter1 = this.getDistance(longNew, latNew, element.longitude, element.latitude);
			if (meter1 <= 200) {
				listDengue?.forEach(element2 => {
					let meter2 = this.getDistance(element.longitude, element.latitude, element2.longitude, element2.latitude);
					if (meter2 <= 200) {
						checkDengue = true;
					}
				});
			}
		});
		return checkDengue;
	};

	getListDengueLocation = async () => {
		const location = (await Location.getCurrentPositionAsync({})).coords;
		const token = (await Notifications.getExpoPushTokenAsync()).data;

		const object = {
			registerId: token
		};
		this.setState({ token });
		getTokenDevice(object);

		getAllDengueLocation().then(({ data }) => {
			var myObject = JSON.parse(this.decrypt(data));
			const { listPatientInformation, listDengueLocationItem } = myObject;
			this.setState({ listPatientInformation, listDengueLocationItem });

			try {
				let longNew = location.longitude;
				let latNew = location.latitude;
				const checkDengue = this.checkDistance(listPatientInformation, listDengueLocationItem, latNew, longNew);

				if (checkDengue === true) {
					countNotification();
					this.processUpdateLocation();
					this.notifyWarningDengueLocation();
					const historyObject = {
						registerId: token,
						type: 1
					};
					saveHistoryDevice(historyObject);
				}

				this.setState({ checkOldDengue: checkDengue });

				// if (checkOldDengue === true) {
				// 	if (checkDengue === false) {
				// 		const historyObject = {
				// 			registerId: token,
				// 			type: 0
				// 		};
				// 		saveHistoryDevice(historyObject);
				// 		this.notifyOutSizeWarningDengueLocation();
				// 		this.processUpdateLocation();
				// 	}
				// } else {
				// 	if (checkDengue === true) {
				// 		const historyObject = {
				// 			registerId: token,
				// 			type: 1
				// 		};
				// 		saveHistoryDevice(historyObject);
				// 		countNotification();
				// 		this.notifyWarningDengueLocation();
				// 		this.processUpdateLocation();
				// 	}
				// }
				// this.setState({ checkOldDengue: checkDengue });
			} catch (err) {
				console.error(err);
			}
		});
	};

	encrypt(value) {
		let key = CryptoJS.enc.Utf8.parse("1234567890123456");
		let ciphertext = CryptoJS.AES.encrypt(value, key, { iv: key }).toString();
		return ciphertext;
	}

	decrypt(value) {
		let key = CryptoJS.enc.Utf8.parse("1234567890123456");
		let decryptedData = CryptoJS.AES.decrypt(value, key, {
			iv: key
		});
		return decryptedData.toString(CryptoJS.enc.Utf8);
	}

	processUpdateLocation = () => {
		TaskManager.defineTask(TASK_FETCH_LOCATION, ({ data: { locations }, error }) => {
			if (error) {
				console.error(error);
				return;
			}
			const [location] = locations;

			try {
				let longNew = location.coords.longitude;
				let latNew = location.coords.latitude;
				const { checkOldDengue } = this.state;
				let { listPatientInformation, listDengueLocationItem } = this.state;
				let checkDengue = this.checkDistance(listPatientInformation, listDengueLocationItem, latNew, longNew);

				if (checkOldDengue === true) {
					if (checkDengue === false) {
						const historyObject = {
							registerId: this.state.token,
							type: 0
						};
						saveHistoryDevice(historyObject);
						this.notifyOutSizeWarningDengueLocation();
					}
				} else {
					if (checkDengue === true) {
						const historyObject = {
							registerId: this.state.token,
							type: 1
						};
						saveHistoryDevice(historyObject);
						countNotification();
						this.notifyWarningDengueLocation();
					}
				}
				this.setState({ checkOldDengue: checkDengue });
			} catch (err) {
				console.error(err);
			}
		});
	};

	rad = x => {
		return (x * Math.PI) / 180;
	};

	getDistance = (longitude1, latitude1, longitude2, latitude2) => {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = this.rad(latitude2 - latitude1);
		var dLong = this.rad(longitude2 - longitude1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.rad(latitude1)) * Math.cos(this.rad(latitude2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d; // returns the distance in meter
	};

	notifyWarningDengueLocation = () => {
		Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
		Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
			accuracy: Location.Accuracy.High,
			distanceInterval: 1,
			deferredUpdatesInterval: 1,
			foregroundService: {
				notificationTitle: "Cảnh báo lúc " + new Date().getHours() + ":" + new Date().getMinutes(),
				notificationBody: "⛔ Bạn đang ở trong phạm vi có nguy cơ nhiễm Sốt xuất huyết !"
				//notificationColor: "#FF5151"
			}
		});
		// Notifications.scheduleNotificationAsync({
		// 	content: {
		// 		title: "Cảnh báo",
		// 		body: "⛔ Bạn đang ở trong phạm vi có nguy cơ nhiễm Sốt xuất huyết !",
		// 		autoDismiss: true,
		// 		vibrate: [0, 255, 255, 255],
		// 		color: "#FF5151",
		// 		sound: true
		// 	},
		// 	trigger: {
		// 		seconds: 1,
		// 		repeats: false
		// 	}
		// });
	};

	notifyOutSizeWarningDengueLocation = () => {
		Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
		Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
			accuracy: Location.Accuracy.High,
			distanceInterval: 1,
			deferredUpdatesInterval: 1,
			foregroundService: {
				notificationTitle: "Thông báo lúc " + new Date().getHours() + ":" + new Date().getMinutes(),
				notificationBody: "🛡 Bạn đã ở ngoài phạm vi có nguy cơ nhiễm Sốt xuất huyết"
				//notificationColor: "#ADC2A9"
			}
		});
		// Notifications.scheduleNotificationAsync({
		// 	content: {
		// 		title: "Thông báo",
		// 		body: "🛡 Bạn đã ở ngoài phạm vi có nguy cơ nhiễm Sốt xuất huyết",
		// 		autoDismiss: true,
		// 		vibrate: [0, 255, 255, 255],
		// 		color: "#ADC2A9",
		// 		sound: true
		// 	},
		// 	trigger: {
		// 		seconds: 1,
		// 		repeats: false
		// 	}
		// });
	};

	componentDidMount() {
		this.registerForPushNotificationsAsync();
		// this.registerForPushNotificationsAsync();
		// this.getListDengueLocation();
		// this.processUpdateLocation();

		// try {
		// 	setInterval(async () => {
		// 		getAllDengueLocation().then(({ data }) => {
		// 			var myObject = JSON.parse(this.decrypt(data));
		// 			let listPatientInformation = myObject.listPatientInformation;
		// 			let listDengueLocationItem = myObject.listDengueLocationItem;
		// 			this.setState({ listPatientInformation, listDengueLocationItem });
		// 		});
		// 	}, 1000 * 15);
		// } catch (e) {
		// 	console.log(e);
		// }
	}

	// checkForegroundPermission = async () => {
	// 	this.registerForPushNotificationsAsync();
	// 	// if (Platform.OS === "android") {
	// 	// 	await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
	// 	// 		title: "App access fine location permission",
	// 	// 		buttonNeutral: "Ask Me Later",
	// 	// 		buttonNegative: "Cancel",
	// 	// 		buttonPositive: "OK"
	// 	// 	});
	// 	// 	await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
	// 	// 		title: "App access coarse location permission",
	// 	// 		buttonNeutral: "Ask Me Later",
	// 	// 		buttonNegative: "Cancel",
	// 	// 		buttonPositive: "OK"
	// 	// 	});
	// 	// } else {
	// 	// }
	// };

	checkBackgroundPermission = async () => {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, {
			title: "App access background location permission",
			message: "App use for tracking user location",
			buttonNeutral: "Ask Me Later",
			buttonNegative: "Cancel",
			buttonPositive: "OK"
		});
		if (Platform.OS === "android" && Platform.Version >= 11) {
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				Linking.openURL("app-settings:");
			}
		}
	};

	onHandleClick = () => {
		this.getListDengueLocation();
		this.processUpdateLocation();
		this.props.navigation.navigate("Menu");
	};

	render() {
		const check = Platform.OS === "android" && Platform.Version >= 10;
		const { t } = this.props;

		return (
			<View style={styles.container}>
				<Block middle>
					<Image
						source={Images.aboutImage}
						style={{
							width: width / 3,
							height: 250
						}}
						resizeMode="contain"
						resizeMethod="auto"
					/>
				</Block>
				<Text style={styles.title}>{t("appInfo")}</Text>
				<Text style={styles.content}>
					<Text style={{ fontWeight: "700" }}>Dengue alert</Text> {t("infoDetail")}
				</Text>

				<Block center style={{ marginTop: 30 }}>
					{check && (
						<Button
							icon="setting"
							iconFamily="antdesign"
							iconSize={20}
							color="warning"
							iconColor="#000"
							onPress={this.checkBackgroundPermission}
						>
							{t("accessLocation")}
						</Button>
					)}

					<Button color="info" onPress={this.onHandleClick} round>
						{t("agreeToUse")}
					</Button>
				</Block>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 16,
		overflow: "hidden",
		paddingHorizontal: 30,
		paddingVertical: 30,
		backgroundColor: "#fff"
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 20,
		marginTop: -20
	},
	content: {
		fontSize: 16,
		lineHeight: 28,
		textAlign: "center"
	}
});

export default withTranslation()(About);
