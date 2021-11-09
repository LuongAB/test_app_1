import { Formik } from "formik";
import { Block, Input } from "galio-framework";
import React, { Component } from "react";
import { Dimensions, Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import * as Progress from "react-native-progress";
import * as Yup from "yup";
import { Button } from "../components";
import { nowTheme } from "../constants";
const { width } = Dimensions.get("screen");
import { forgotPassOTP } from "../services/AuthServices";

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const ResetPassSchema = Yup.object().shape({
	email: Yup.string().required("Trường này là bắt buộc").email("Email không hợp lệ"),
	newPassword: Yup.string().required("Trường này là bắt buộc"),
	confirmNewPassword: Yup.mixed()
		.required("Trường này là bắt buộc")
		.test("match", "Mật khẩu không trùng khớp", function (value) {
			let { newPassword } = this.parent;
			return newPassword === value;
		}),
	token: Yup.string().required("Trường này là bắt buộc")
});

export default class ResetPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			newPassword: "",
			confirmNewPassword: "",
			token: "",
			error: "",
			loading: false
		};
	}

	onRegister = values => {
		forgotPassOTP(values)
			.then(({ data }) => {
				if (data.dât) {
					this.props.navigation.navigate("Login");
				} else {
					this.setState({
						error: "Mã OTP không đúng. Vui lòng kiểm tra lại"
					});
				}
			})
			.catch(err => console.log(err));
	};

	render() {
		const { loading, error } = this.state;

		return (
			<DismissKeyboard>
				<Block style={styles.registerContainer} flex>
					<Text style={styles.loginText}>Lấy lại mật khẩu</Text>
					<Formik
						initialValues={{
							email: this.props.route.params?.email,
							newPassword: "",
							confirmNewPassword: "",
							token: ""
						}}
						validationSchema={ResetPassSchema}
						onSubmit={values => this.onRegister(values)}
					>
						{({ handleChange, handleSubmit, values, errors, touched }) => (
							<Block>
								<Block>
									<Input
										placeholder="Email"
										disabled
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										value={values.email}
										color={nowTheme.COLORS.BLACK}
									/>
								</Block>

								<Block>
									<Input
										placeholder="Mã OTP*"
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										onChangeText={handleChange("token")}
										value={values.token}
										color={nowTheme.COLORS.BLACK}
									/>
									{errors.token && touched.token ? <Text style={styles.textError}>{errors.token}</Text> : null}
								</Block>

								<Block>
									<Input
										placeholder="Mật khẩu mới*"
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										onChangeText={handleChange("newPassword")}
										value={values.newPassword}
										password
										viewPass
										color={nowTheme.COLORS.BLACK}
									/>
									{errors.newPassword && touched.newPassword ? (
										<Text style={styles.textError}>{errors.newPassword}</Text>
									) : null}
								</Block>

								<Block style={styles.inputWrapper}>
									<Input
										placeholder="Xác nhận lại mật khẩu*"
										placeholderTextColor={nowTheme.COLORS.MUTED}
										style={styles.inputs}
										onChangeText={handleChange("confirmNewPassword")}
										value={values.confirmNewPassword}
										password
										viewPass
										color={nowTheme.COLORS.BLACK}
									/>
									{errors.confirmNewPassword && touched.confirmNewPassword ? (
										<Text style={styles.textError}>{errors.confirmNewPassword}</Text>
									) : null}
								</Block>
								{error !== "" && <Text style={styles.textError}>{error}</Text>}

								<Block center>
									{loading ? (
										<Progress.Circle size={30} indeterminate={true} />
									) : (
										<Button round style={styles.createButton} onPress={handleSubmit}>
											<Text style={{ color: nowTheme.COLORS.WHITE, fontWeight: "700", fontSize: 14 }}>Xác nhận</Text>
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
		height: "70%",
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
		paddingHorizontal: 40
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
