import { withNavigation } from "@react-navigation/compat";
import { Block, theme } from "galio-framework";
import moment from "moment";
import React from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { nowTheme, Images } from "../constants";
import { API_ENDPOINT } from "../constants/appConfig";

const IMAGE_API = API_ENDPOINT + "/public/api/getImage";

class Card extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.videoRef = React.createRef();
	}

	render() {
		const { navigation, item, horizontal, full, style, imageStyle, titleStyle } = this.props;

		return (
			<Block row={horizontal} card flex style={styles.card}>
				<TouchableWithoutFeedback onPress={() => navigation.navigate("ArticleDetail", { id: item.id })}>
					<Block flex>
						<Image
							source={
								item.titleImageUrl === null || item.titleImageUrl === ""
									? Images.placeholder
									: {
											uri: `${IMAGE_API}/${item.titleImageUrl}`
									  }
							}
							resizeMode="cover"
							resizeMethod="auto"
							style={styles.horizontalImage}
						/>
					</Block>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback onPress={() => navigation.navigate("ArticleDetail", { id: item.id })}>
					<Block flex>
						<Block flex>
							<Text style={styles.cardTitle} ellipsizeMode="head" numberOfLines={3}>
								{item.title}
							</Text>
							{item.subtitle ? (
								<Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={2} color={"#9A9A9A"}>
									{item?.subtitle}
								</Text>
							) : (
								<Block />
							)}
						</Block>

						<Block right style={{ paddingRight: 10, paddingTop: 20 }}>
							{item.publishDate && <Text>{moment(item.publishDate).format("HH:MM, DD-MM-yyyy")}</Text>}
						</Block>
					</Block>
				</TouchableWithoutFeedback>
			</Block>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		marginVertical: theme.SIZES.BASE,
		borderWidth: 0,
		minHeight: 180,
		marginBottom: 4,
		paddingVertical: 20,
		paddingHorizontal: 10,
		elevation: 1,
		alignItems: "flex-start"
	},
	cardTitle: {
		paddingHorizontal: 10,
		fontSize: 18,
		color: nowTheme.COLORS.BLACK,
		fontWeight: "700",
		marginLeft: 6
	},
	subtitle: {
		padding: 10,
		textAlign: "left",
		marginLeft: 6
	},
	horizontalImage: {
		height: 120,
		width: "100%",
		borderRadius: 4,
		marginTop: 6
	},
	horizontalStyles: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0
	},
	verticalStyles: {
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0
	},
	articleButton: {
		fontFamily: "montserrat-bold",
		paddingHorizontal: 5,
		paddingVertical: 5
	}
});

export default withNavigation(Card);
