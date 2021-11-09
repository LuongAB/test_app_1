import { Formik } from "formik";
import { Block, Input } from "galio-framework";
import React, { Component } from "react";
import { Dimensions, Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import * as Progress from "react-native-progress";
import * as Yup from "yup";
import { Button } from "../components";
import { nowTheme } from "../constants";
import { checkEmail, checkUsername, register } from "../services/AuthServices";
const { width } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const RegisterSchema = Yup.object().shape({
	firstName: Yup.string().required("Trường này là bắt buộc"),
	lastName: Yup.string().required("Trường này là bắt buộc"),
	email: Yup.string()
		.required("Trường này là bắt buộc")
		.email("Email không hợp lệ")
		.test("match", "Email đã được sử dụng", function (value) {
			return new Promise((resolve, reject) => {
				checkEmail(value)
					.then(() => resolve(false))
					.catch(() => resolve(true));
			});
		}),
	username: Yup.string()
		.required("Trường này là bắt buộc")
		.test("match", "Tên tài khoản đã được sử dụng", function (value) {
			return new Promise((resolve, reject) => {
				checkUsername(value)
					.then(() => resolve(false))
					.catch(() => resolve(true));
			});
		}),
	password: Yup.string().required("Trường này là bắt buộc")
});

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			firstName: "",
			lastName: "",
			displayName: "",
			email: "",
			username: "",
			password: "",
			error: "",
			loading: false
		};
	}

	componentDidMount() {}

	onRegister = values => {
		checkEmail(this.state.email).then(data => {
			if (data) {
				checkUsername(this.state.username).then(data => {
					if (data) {
						register(this.state).then(({ data }) => this.props.navigation.navigate("OTPScreen", { email: data.email }));
					}
				});
			}
		});
	};

	render() {
		const { loading } = this.state;

		return (
			<DismissKeyboard>
				<Block style={styles.registerContainer} flex center>
					<Text style={styles.loginText}>Đăng ký tài khoản</Text>
					<Formik
						initialValues={{
							firstName: "",
							lastName: "",
							displayName: "",
							email: "",
							username: "",
							password: ""
						}}
						validationSchema={RegisterSchema}
						onSubmit={values => this.onRegister(values)}
					>
						{({ handleChange, handleSubmit, values, errors, touched }) => (
							<Block>
								<Block row space="between" style={styles.inputWrapper}>
									<Block style={{ width: "48%" }}>
										<Input
											placeholder="Họ*"
											placeholderTextColor={nowTheme.COLORS.MUTED}
											style={styles.inputs}
											onChangeText={handleChange("firstName")}
											value={values.firstName}
											color={nowTheme.COLORS.BLACK}
										/>
										{errors.firstName && touched.firstName ? (
											<Text style={styles.textError}>{errors.firstName}</Text>
										) : null}
									</Block>

									<Block style={{ width: "48%" }}>
										<Input
											placeholder="Tên*"
											placeholderTextColor={nowTheme.COLORS.MUTED}
											style={styles.inputs}
											onChangeText={handleChange("lastName")}
											value={values.lastName}
											color={nowTheme.COLORS.BLACK}
										/>
										{errors.lastName && touched.lastName ? (
											<Text style={styles.textError}>{errors.lastName}</Text>
										) : null}
									</Block>
								</Block>

								<Block style={styles.inputWrapper}>
									<Input
										placeholder="Tên hiển thị"
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										onChangeText={handleChange("displayName")}
										value={values.displayName}
										color={nowTheme.COLORS.BLACK}
									/>
								</Block>

								<Block style={styles.inputWrapper}>
									<Input
										placeholder="Email*"
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										type="email-address"
										onChangeText={handleChange("email")}
										value={values.email}
										color={nowTheme.COLORS.BLACK}
									/>
									{errors.email && touched.email ? <Text style={styles.textError}>{errors.email}</Text> : null}
								</Block>

								<Block style={styles.inputWrapper}>
									<Input
										placeholder="Tên đăng nhập*"
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										onChangeText={handleChange("username")}
										value={values.username}
										color={nowTheme.COLORS.BLACK}
									/>
									{errors.username && touched.username ? <Text style={styles.textError}>{errors.username}</Text> : null}
								</Block>

								<Block style={styles.inputWrapper}>
									<Input
										placeholder="Mật khẩu*"
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										onChangeText={handleChange("password")}
										value={values.password}
										password
										viewPass
										color={nowTheme.COLORS.BLACK}
									/>
									{errors.password && touched.password ? <Text style={styles.textError}>{errors.password}</Text> : null}
								</Block>

								<Block center>
									{loading ? (
										<Progress.Circle size={30} indeterminate={true} />
									) : (
										<Button round style={styles.createButton} onPress={handleSubmit}>
											<Text style={{ color: nowTheme.COLORS.WHITE, fontWeight: "700", fontSize: 14 }}>Đăng ký</Text>
										</Button>
									)}
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
		height: "80%",
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
		paddingTop: 10,
		paddingHorizontal: 15
	},
	loginText: {
		fontSize: 25,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 20,
		marginTop: 20
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
	inputWrapper: {
		marginBottom: 15
	},
	inputs: {
		borderWidth: 1,
		borderColor: "#F1F1FA",
		borderRadius: 24
	},
	textError: {
		fontSize: 12,
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
