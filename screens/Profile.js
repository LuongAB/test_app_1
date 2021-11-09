import DateTimePicker from "@react-native-community/datetimepicker";
import { Block, Input, Radio, Text, theme } from "galio-framework";
import React, { Component } from "react";
import {
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { Images, nowTheme } from "../constants";
import { getUserInfo } from "../services/UserServices";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 2;

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			showDatePicker: false
		};
	}

	componentDidMount() {
		getUserInfo().then(({ data }) => {
			this.setState({
				...data,
				loading: false
			});
		});
	}

	onHandleDateChange = (e, date) => {
		console.log(date);
	};

	render() {
		const { displayName, email, imagePath, active, showDatePicker, loading } = this.state;

		const genderOptions = [
			{
				label: "Nam",
				value: 1
			},
			{
				label: "Nữ",
				value: 2
			},
			{
				label: "Khác",
				value: 3
			}
		];

		return (
			<SafeAreaView style={{ flex: 1 }}>
				{loading ? (
					<ActivityIndicator size="large" color="#00ff00" style={styles.loading} />
				) : (
					<ScrollView style={styles.container}>
						<Block style={{ top: height * 0.02 }} center>
							<Image source={Images.ProfilePicture} style={styles.avatar} />
							<Block style={{ top: height * 0.02 }}>
								<Text
									style={{
										fontFamily: "montserrat-bold",
										marginBottom: theme.SIZES.BASE / 2,
										fontWeight: "900",
										fontSize: 26
									}}
									color="#000"
								>
									{displayName}
								</Text>
								<Radio label="Đang hoạt động" color="success" initialValue={true} />
							</Block>
						</Block>

						<Block style={styles.info}>
							<Block row space="between">
								<Block style={styles.infoItem}>
									<Text style={styles.label}>Họ</Text>
									<Input color={nowTheme.COLORS.BLACK} style={styles.input} />
								</Block>
								<Block style={styles.infoItem}>
									<Text style={styles.label}>Tên</Text>
									<Input color={nowTheme.COLORS.BLACK} style={styles.input} />
								</Block>
							</Block>

							<Block row space="between">
								<Block style={styles.infoItem}>
									<Text style={styles.label}>Ngày sinh</Text>
									<TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
										<Text color={nowTheme.COLORS.BLACK} style={styles.dob}>
											{`${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`}
										</Text>
									</TouchableOpacity>
									{showDatePicker && (
										<DateTimePicker
											testID="dateTimePicker"
											value={new Date()}
											mode="date"
											display="spinner"
											dateFormat="day month year"
											onChange={this.onHandleDateChange}
										/>
									)}
								</Block>
								<Block style={styles.infoItem}>
									<Text style={styles.label}>Giới tính</Text>
									<ModalDropdown
										testID="gender"
										style={[styles.dob, { paddingVertical: 15 }]}
										options={["Nam", "Nữ", "Khác"]}
									/>
								</Block>
							</Block>

							<Block row space="between">
								<Block style={styles.infoItem}>
									<Text style={styles.label}>Tên hiển thị</Text>
									<Input color={nowTheme.COLORS.BLACK} style={styles.input} />
								</Block>

								<Block style={styles.infoItem}>
									<Text style={styles.label}>Số điện thoại</Text>
									<Input color={nowTheme.COLORS.BLACK} type="numeric" style={styles.input} />
								</Block>
							</Block>

							<Block>
								<Text style={styles.label}>Email</Text>
								<Input color={nowTheme.COLORS.BLACK} type="email-address" style={styles.input} />
							</Block>

							<Block>
								<Text style={styles.label}>Địa chỉ</Text>
								<Input color={nowTheme.COLORS.BLACK} style={styles.input} />
							</Block>
						</Block>
					</ScrollView>
				)}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20
	},
	avatar: {
		width: thumbMeasure,
		height: thumbMeasure
	},
	info: {
		marginTop: height * 0.05
	},
	infoItem: {
		width: "48%",
		marginTop: 10
	},
	label: {
		fontSize: 12,
		color: "#000",
		fontWeight: "700"
	},
	input: {
		borderWidth: 0.5,
		borderColor: "#e6e6e7",
		padding: 5,
		fontWeight: "600",
		color: "#000"
	},
	dob: {
		backgroundColor: "#fff",
		borderWidth: 0.5,
		borderColor: "#e6e6e7",
		padding: 13,
		borderRadius: 8,
		marginTop: 5
	},
	loading: {
		position: "absolute",
		bottom: "50%",
		left: "50%"
	}
});

export default Profile;
