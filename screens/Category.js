import * as Notifications from "expo-notifications";
import React, { Component } from "react";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity
} from "react-native";
import { Images, nowTheme } from "../constants";
import { API_ENDPOINT } from "../constants/appConfig";
import { getAllCategory } from "../services/CategoryServices";
import { withTranslation } from "react-i18next";

const { width, height } = Dimensions.get("screen");

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true
	})
});

class Category extends Component {
	constructor(props) {
		super(props);

		this.state = {
			categories: [],
			loading: true,
			language: ""
		};
	}

	componentDidMount() {
		this.onGetAllCategory();
		this.setState({
			language: this.props.i18n.language
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.i18n.language !== this.state.language) {
			this.setState(
				{
					language: this.props.i18n.language
				},
				() => this.onGetAllCategory()
			);
		}
	}

	onGetAllCategory = () => {
		this.setState({
			loading: true
		});
		getAllCategory({
			pageIndex: 1,
			pageSize: 50,
			checkLanguage: this.props.i18n.language === "vi" ? 1 : 0
		}).then(({ data }) => {
			this.setState({
				categories: data.content,
				loading: false
			});
		});
	};

	renderItem = ({ item }) => (
		<TouchableOpacity
			style={{ borderRadius: 8 }}
			onPress={() => this.props.navigation.navigate("Article", { title: item.title, id: item.id })}
		>
			<ImageBackground
				source={
					item.titleImageUrl === null || item.titleImageUrl === ""
						? Images.Mosquito
						: {
								uri: API_ENDPOINT + "/public/api/getImage/" + item?.titleImageUrl
						  }
				}
				style={styles.item}
				resizeMode="contain"
				resizeMethod="auto"
				imageStyle={{
					borderRadius: 4
				}}
			>
				<Text style={styles.itemTitle}>{item.title}</Text>
			</ImageBackground>
		</TouchableOpacity>
	);

	render() {
		const { categories, loading } = this.state;
		const { t } = this.props;

		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.categoryTitle}>{t("newsTopic")}</Text>
				{loading ? (
					<ActivityIndicator size="large" color="#00ff00" style={styles.loading} />
				) : (
					<FlatList
						data={categories}
						renderItem={this.renderItem}
						keyExtractor={item => item.id}
						horizontal={false}
						numColumns={2}
						style={{ marginBottom: 40 }}
						showsVerticalScrollIndicator={false}
					/>
				)}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		marginTop: 5
	},
	item: {
		marginVertical: 10,
		marginHorizontal: 10,
		borderRadius: 12,
		backgroundColor: "#fff",
		width: width / 2 - 30,
		height: height / 4,
		flex: 1
	},
	itemTitle: {
		width: "100%",
		textAlign: "center",
		padding: 10,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		fontSize: 14,
		fontWeight: "700",
		color: nowTheme.COLORS.WHITE,
		backgroundColor: nowTheme.COLORS.MENU_ITEM,
		position: "absolute",
		bottom: 0,
		left: 0
	},
	categoryTitle: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 24,
		marginHorizontal: 8
	},
	title: {
		fontSize: 24
	},
	loading: {
		position: "absolute",
		bottom: "50%",
		left: "50%",
		zIndex: 999
	}
});

export default withTranslation()(Category);
