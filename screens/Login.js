import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Formik } from "formik";
import { Block, Input } from "galio-framework";
import React, { Component } from "react";
import { Dimensions, Image, Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Yup from "yup";
import { Button } from "../components";
import { Images, nowTheme } from "../constants";
import { login } from "../services/AuthServices";
import { getTokenDevice } from "../services/UserServices";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
const { width } = Dimensions.get("screen");
const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const LoginSchema = Yup.object().shape({
	username: Yup.string().required("Trường này là bắt buộc"),
	password: Yup.string().required("Trường này là bắt buộc")
});

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			errorLogin: ""
		};
	}

	setSession(token) {
		if (token) {
			try {
				AsyncStorage.setItem("jwt_token", token);
			} catch (error) {
				// Error saving data
			}
			axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		} else {
			AsyncStorage.removeItem("jwt_token");
			delete axios.defaults.headers.common["Authorization"];
		}
	}

	async registerForPushNotificationsAsync() {
		let token;
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		let { status } = await Location.requestPermissionsAsync();
		if (status !== "granted") {
			alert("Quyền truy cập vị trí đã bị từ chối");
			return;
		}
		let location = await Location.getCurrentPositionAsync({});
		token = (await Notifications.getExpoPushTokenAsync()).data;

		let object = {
			registerId: token,
			longitude: location.coords.longitude,
			latitude: location.coords.latitude
		};
		let a = {
			longtitude: location.coords.longitude,
			latitude: location.coords.latitude
		};
		getTokenDevice(object).then(({ data }) => {
			console.log(data);
		});

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C"
			});
		}
	}

	onLogin = values => {
		const { navigation } = this.props;
		const { username, password } = values;

		this.setState({ loading: true });
		let requestBody = "client_id=core_client&grant_type=password&client_secret=secret";
		requestBody = requestBody + "&username=" + username + "&password=" + password;
		login(requestBody)
			.then(response => {
				this.setSession(response.data.access_token);
				this.setState({ loading: false });
				navigation.navigate("Home");
			})
			.catch(error => {
				this.setState({ loading: false, errorLogin: "Tài khoản hoặc mật khẩu không đúng" });
			});
	};

	componentDidMount() {
		this.onLogin({ username: "admin", password: "admin" });
		this.registerForPushNotificationsAsync();
	}

	render() {
		const { loading, errorLogin } = this.state;
		const { navigation } = this.props;

		return (
			<DismissKeyboard>
				<Block style={styles.registerContainer} flex={1} center>
					<Image source={Images.Mosquito} style={styles.loginLogo} />
					<Text style={styles.loginText}>NIMPE sốt xuất huyết</Text>
					<Text style={styles.register} onPress={() => navigation.navigate("Register")}>
						Chưa có tài khoản / <Text style={styles.link}>Đăng ký</Text>
					</Text>
					<Formik
						initialValues={{ username: "", password: "" }}
						validationSchema={LoginSchema}
						onSubmit={values => this.onLogin(values)}
					>
						{({ handleChange, handleSubmit, values, errors, touched }) => (
							<Block>
								<Block>
									<Block width={width * 0.8} style={{ marginBottom: 3 }}>
										<Input
											placeholder="Tài khoản"
											placeholderTextColor={nowTheme.COLORS.MUTED}
											style={styles.inputs}
											onChangeText={handleChange("username")}
											name="username"
											value={values.username}
											color={nowTheme.COLORS.BLACK}
											iconContent={<Icon size={16} name="account" style={styles.inputIcons} />}
										/>
										{errors.username && touched.username ? (
											<Text style={styles.textError}>{errors.username}</Text>
										) : null}
									</Block>

									<Block width={width * 0.8}>
										<Input
											placeholder="Mật khẩu"
											placeholderTextColor={nowTheme.COLORS.MUTED}
											style={styles.inputs}
											secureTextEntry={true}
											onChangeText={handleChange("password")}
											name="password"
											value={values.password}
											password
											iconColor="pink"
											color={nowTheme.COLORS.BLACK}
											iconContent={<Icon size={16} name="lock" style={styles.inputIcons} />}
										/>
										{errors.password && touched.password ? (
											<Text style={styles.textError}>{errors.password}</Text>
										) : null}
									</Block>
								</Block>
								{errorLogin !== "" && <Text style={styles.textError}>{errorLogin}</Text>}
								<Block center>
									{loading ? (
										<Progress.Circle size={30} indeterminate={true} />
									) : (
										<Button round style={styles.createButton} onPress={handleSubmit}>
											<Text style={{ color: nowTheme.COLORS.WHITE, fontWeight: "700", fontSize: 14 }}>Đăng nhập</Text>
										</Button>
									)}
									<Block>
										<Text style={[styles.link, { marginTop: 10 }]} onPress={() => navigation.navigate("ForgotPass")}>
											Quên mật khẩu
										</Text>
									</Block>
								</Block>
							</Block>
						)}
					</Formik>
				</Block>
			</DismissKeyboard>
		);
	}
}

const styles = StyleSheet.create({
	registerContainer: {
		width: "100%",
		height: "75%",
		position: "absolute",
		bottom: 0,
		backgroundColor: nowTheme.COLORS.WHITE,
		borderTopStartRadius: 30,
		borderTopEndRadius: 30,
		shadowColor: nowTheme.COLORS.BLACK,
		shadowOffset: {
			width: 2,
			height: 8
		},
		shadowRadius: 8,
		shadowOpacity: 0.4,
		elevation: 2,
		overflow: "hidden",
		paddingTop: 10
	},
	loginLogo: {
		width: 100,
		height: 100,
		marginTop: 10
	},
	loginText: {
		fontSize: 25,
		fontWeight: "700",
		marginBottom: 20
	},
	register: {
		textAlign: "left",
		marginBottom: 20
	},
	inputIcons: {
		marginRight: 12,
		color: nowTheme.COLORS.ICON_INPUT,
		fontWeight: "bold",
		fontSize: 21
	},
	inputs: {
		borderWidth: 1,
		borderColor: "#F1F1FA",
		borderRadius: 24
	},
	textError: {
		fontSize: 13,
		textAlign: "left",
		color: nowTheme.COLORS.ERROR
	},
	passwordCheck: {
		paddingLeft: 2,
		paddingTop: 6,
		paddingBottom: 15
	},
	createButton: {
		width: width * 0.5,
		marginTop: 15,
		backgroundColor: nowTheme.COLORS.BUTTON
	},
	link: {
		color: nowTheme.COLORS.BEHANCE,
		fontWeight: "700",
		fontSize: 15
	}
});
