import { Block, Button } from "galio-framework";
import React, { Component } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Images, nowTheme } from "../constants";
import { addFeedback } from "../services/FeedbackServices";
import { withTranslation } from "react-i18next";

const { width, height } = Dimensions.get("screen");

class Feedback extends Component {
	constructor(props) {
		super(props);

		this.state = {
			feedback: "",
			loading: false
		};
	}

	handleChange = text => {
		this.setState({
			...this.state,
			feedback: text
		});
	};

	sendFeedback = () => {
		const { t } = this.props;

		if (this.state.feedback) {
			this.setState({
				loading: true
			});
			addFeedback(this.state).then(({ data }) => {
				this.setState({
					feedback: "",
					loading: false
				});
				Alert.alert(t("notification"), t("receiveFeedback"), [
					{
						text: t("close")
					}
				]);
			});
		} else {
			Alert.alert(t("notification"), t("requiredFeedback"));
		}
	};

	render() {
		const { t } = this.props;

		return (
			<View style={styles.container}>
				<Image style={styles.image} source={Images.Review} resizeMethod="resize" resizeMode="center" />
				<Text style={styles.title}>{t("appFeedback")}</Text>
				<Text style={styles.subtitle}>{t("detailFeedback")}</Text>
				<Block>
					<TextInput
						style={styles.content}
						value={this.state.feedback}
						onChangeText={text => this.handleChange(text)}
						multiline
						textAlign="left"
						textAlignVertical="top"
						numberOfLines={8}
						minHeight={Platform.OS === "ios" ? 20 * 8 : null}
						placeholder={t("yourFeedback")}
					/>

					<Block center>
						{this.state.loading ? (
							<ActivityIndicator size="large" color="#00ff00" />
						) : (
							<Button style={styles.buttonSend} round color="info" onPress={() => this.sendFeedback()}>
								{t("sendFeedback")}
							</Button>
						)}
					</Block>
				</Block>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 25,
		backgroundColor: "#fff",
		flex: 1
	},
	image: {
		width: width,
		height: height / 6,
		marginLeft: "-10%"
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		textAlign: "center"
	},
	subtitle: {
		fontSize: 14,
		color: "#003",
		textAlign: "center",
		marginTop: 15,
		marginBottom: 30,
		lineHeight: 20
	},
	content: {
		fontSize: 16,
		margin: 10,
		padding: 15,
		borderWidth: 1,
		borderColor: nowTheme.COLORS.BUTTON_COLOR,
		borderRadius: 10
	},
	buttonSend: {
		fontWeight: "700"
	}
});

export default withTranslation()(Feedback);
