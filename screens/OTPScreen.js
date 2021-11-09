import { Block, Button } from "galio-framework";
import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import { nowTheme } from "../constants";
const { width } = Dimensions.get("screen");
import { OTPVerify } from "../services/AuthServices";

const CELL_COUNT = 5;

const VerifyCode = props => {
	const [value, setValue] = useState("");
	const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
	const [otherprops, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue
	});

	const onHandleVerify = () => {
		const data = {
			email: props.route.params.email,
			token: value
		};
		OTPVerify(data).then(result => {
			if (result.data.data) {
				props.navigation.navigate("Login");
			}
		});
	};

	return (
		<SafeAreaView style={styles.root}>
			<Text style={styles.title}>Xác thực địa chỉ email</Text>
			<Text style={styles.subTitle}>
				Nhập mã xác thực được gửi đến địa chỉ email
				<Text style={{ color: "blue", fontWeight: "bold" }}> {props.route.params.email}</Text>
			</Text>
			<CodeField
				ref={ref}
				{...otherprops}
				value={value}
				onChangeText={setValue}
				cellCount={CELL_COUNT}
				rootStyle={styles.codeFieldRoot}
				keyboardType="default"
				textContentType="oneTimeCode"
				renderCell={({ index, symbol, isFocused }) => (
					<View
						onLayout={getCellOnLayoutHandler(index)}
						key={index}
						style={[styles.cellRoot, isFocused && styles.focusCell]}
					>
						<Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
					</View>
				)}
			/>

			<Block center style={{ marginTop: 30 }}>
				<Button color="success" style={styles.button} onPress={() => onHandleVerify()}>
					Xác nhận
				</Button>
			</Block>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: {
		padding: 20,
		paddingTop: 30,
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
		overflow: "hidden"
	},
	title: {
		textAlign: "center",
		fontSize: 20,
		fontWeight: "bold"
	},
	subTitle: {
		fontSize: 16,
		marginStart: 20,
		marginTop: 10
	},
	codeFieldRoot: {
		marginTop: 40,
		width: "90%",
		marginLeft: 20,
		marginRight: 20
	},
	cellRoot: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderBottomColor: "#ccc",
		borderBottomWidth: 1
	},
	cellText: {
		color: "#000",
		fontSize: 28,
		textAlign: "center"
	},
	focusCell: {
		borderBottomColor: "#007AFF",
		borderBottomWidth: 2
	},
	button: {
		width: width * 0.5,
		marginTop: 15,
		backgroundColor: nowTheme.COLORS.BUTTON,
		borderRadius: 24
	},
	resendCode: {
		color: "blue",
		marginStart: 20,
		marginTop: 40
	},
	resendCodeText: {
		marginStart: 20,
		marginTop: 40
	},
	resendCodeContainer: {
		flexDirection: "row",
		alignItems: "center"
	}
});

export default VerifyCode;
