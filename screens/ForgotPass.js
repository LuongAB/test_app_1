import { Block, Input } from "galio-framework";
import React, { Component } from "react";
import { Dimensions, Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "../components";
import { nowTheme } from "../constants";
const { width, height } = Dimensions.get("screen");
import { Formik } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../services/AuthServices";

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const ForgotPassSchema = Yup.object().shape({
	email: Yup.string().required("Trường này là bắt buộc").email("Email không hợp lệ")
});

export default class ForgotPass extends Component {
	constructor(props) {
		super(props);

		this.state = {
			error: "",
			loading: false
		};
	}

	componentDidMount() {}

	onHandleSubmit = values => {
		this.setState({ loading: true });
		forgotPassword(values)
			.then(() => this.props.navigation.navigate("ResetPassword", { email: values.email }))
			.catch(() =>
				this.setState({
					error: "Email không tồn tại",
					loading: false
				})
			);
	};

	render() {
		const { error, loading } = this.state;

		return (
			<DismissKeyboard>
				<Block style={styles.container} flex center>
					<Text style={styles.loginText}>Quên mật khẩu</Text>
					<Formik
						initialValues={{ email: "" }}
						validationSchema={ForgotPassSchema}
						onSubmit={values => this.onHandleSubmit(values)}
					>
						{({ handleChange, handleSubmit, values, errors, touched }) => (
							<Block center>
								<Block>
									<Block width={width * 0.8} style={{ marginBottom: 3 }}>
										<Input
											placeholder="Email*"
											placeholderTextColor={nowTheme.COLORS.MUTED}
											style={styles.inputs}
											onChangeText={handleChange("email")}
											name="email"
											type="email-address"
											value={values.email}
											color={nowTheme.COLORS.BLACK}
											iconContent={<Icon size={16} name="email" style={styles.inputIcons} />}
										/>
										{errors.email && touched.email ? <Text style={styles.textError}>{errors.email}</Text> : null}
										{error !== "" && <Text style={styles.textError}>{error}</Text>}
									</Block>
								</Block>

								{loading ? (
									<Progress.Circle size={30} indeterminate={true} />
								) : (
									<Button round style={styles.createButton} onPress={handleSubmit}>
										<Text style={{ color: nowTheme.COLORS.WHITE, fontWeight: "700", fontSize: 14 }}>Gửi</Text>
									</Button>
								)}
							</Block>
						)}
					</Formik>
				</Block>
			</DismissKeyboard>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "60%",
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
	loginText: {
		fontSize: 25,
		fontWeight: "700",
		textAlign: "center",
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
		fontSize: 12,
		color: nowTheme.COLORS.ERROR
	},
	createButton: {
		width: width * 0.5,
		marginTop: 15,
		backgroundColor: nowTheme.COLORS.BUTTON
	}
});
