import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { nowTheme, Images } from "../constants";
import { withTranslation } from "react-i18next";
import { Button, Block } from "galio-framework";

const { width, height } = Dimensions.get("screen");

class Home extends Component {
	render() {
		const { t } = this.props;

		return (
			<View style={styles.container}>
				<Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center", color: "red" }}>{t("homeTitle")}</Text>
				<Image
					source={Images.poster}
					style={{
						width: width - 20,
						maxHeight: height / 2,
						borderRadius: 2,
						marginVertical: 20
					}}
					resizeMode="contain"
					resizeMethod="auto"
				/>

				<TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate("Categories")}>
					<Text style={styles.title}>{t("dengueNews")}</Text>
					<Text>
						<Icon name="arrow-forward-outline" style={styles.icon} />
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		flexWrap: "wrap"
	},
	card: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: nowTheme.COLORS.SUCCESS,
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginTop: 20,
		minWidth: width - 160
	},
	icon: {
		fontSize: 30,
		padding: 15,
		paddingBottom: 40,
		color: "#fff"
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		padding: 10,
		color: "#fff",
		textAlign: "center"
	}
});

export default withTranslation()(Home);
