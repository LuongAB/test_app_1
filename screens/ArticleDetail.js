import { Video } from "expo-av";
import moment from "moment";
import React, { Component } from "react";
import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import HTML from "react-native-render-html";
import { IGNORED_TAGS } from "react-native-render-html/src/HTMLUtils";
import Icon from "react-native-vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import { Images, nowTheme } from "../constants";
import { API_ENDPOINT } from "../constants/appConfig";
import { getArticleByID } from "../services/ArticleServices";
import * as ScreenOrientation from "expo-screen-orientation";
import { withTranslation } from "react-i18next";

const { width, height } = Dimensions.get("screen");
const IMAGE_API = API_ENDPOINT + "/public/api/getImage";

class ArticleDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true
		};
		this.videoRef = React.createRef();
	}

	componentDidMount() {
		this.setState({
			loading: true
		});
		if (this.props.route.params.id) {
			getArticleByID(this.props.route.params.id).then(({ data }) =>
				this.setState({
					...data,
					loading: false
				})
			);
		}
	}

	onFullscreenUpdate = async ({ fullscreenUpdate }) => {
		switch (fullscreenUpdate) {
			case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
				await ScreenOrientation.unlockAsync();
				break;
			case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
				await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
				break;
		}
	};

	render() {
		const {
			title,
			subtitle,
			content,
			summary,
			publishDate,
			view,
			realAuthor,
			tags,
			source,
			categories,
			titleImageUrl,
			loading
		} = this.state;

		const { navigation, t } = this.props;

		return (
			<SafeAreaView style={styles.container}>
				<View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
					<Icon
						color={"black"}
						size={40}
						name="arrow-back-outline"
						onPress={() => {
							this?.videoRef?.current?.pauseAsync();
							this.props.navigation.goBack();
						}}
					/>
					<Text style={{ fontSize: 18, fontWeight: "700" }}>{t("newsContent")}</Text>
				</View>

				<ScrollView showsVerticalScrollIndicator={false}>
					{loading ? (
						<ActivityIndicator size="large" color="#00ff00" style={styles.loading} />
					) : (
						<>
							<Text style={styles.category}>{categories?.title}</Text>
							<Text style={styles.title}>{title}</Text>
							<Text style={styles.category}>{subtitle}</Text>
							<Text style={styles.category}>{summary}</Text>
							<Text style={styles.date}>
								{moment(publishDate).format("L")} {t("byAuthor")}
								<Text style={[styles.author, { color: nowTheme.COLORS.BLACK }]}> {realAuthor}</Text>
							</Text>

							<Image
								source={
									titleImageUrl === ""
										? Images.placeholder
										: {
												uri: `${IMAGE_API}/${titleImageUrl}`
										  }
								}
								resizeMode="cover"
								resizeMethod="auto"
								style={{
									width: width - 20,
									height: 220
								}}
							/>

							<HTML
								ignoredTags={IGNORED_TAGS.filter(tag => tag !== "video")}
								source={{ html: content }}
								renderers={{
									video: (htmlAttribs, children, convertedCSSStyles, passProps) => {
										const { domNode } = passProps;
										return (
											<View
												key={passProps.key}
												style={{ width: "100%", aspectRatio: 16.0 / 9.0, marginBottom: 20, marginTop: 16 }}
											>
												<Video
													ref={this.videoRef}
													source={{ uri: domNode?.children[0].next.attribs.src }}
													useNativeControls
													resizeMode="cover"
													style={{
														width: width - 40,
														minHeight: 220
													}}
													onPlaybackStatusUpdate={status => {
														if (status.didJustFinish && !status.isLooping) {
															this.videoRef.current.setStatusAsync({ positionMillis: 10, shouldPlay: false });
														}
													}}
													onFullscreenUpdate={this.onFullscreenUpdate}
												/>
											</View>
										);
									}
								}}
							/>

							<View>
								{source !== "" ? (
									<Text style={styles.date}>
										{t("source")} : {source}
									</Text>
								) : null}
							</View>

							<View style={styles.tagList}>
								{tags !== "" ? (
									<>
										<Text>Tags : </Text>
										{tags.split(",").map(item => (
											<Text key={item} style={styles.tag}>
												{item}
											</Text>
										))}
									</>
								) : null}
							</View>

							<View style={styles.countView}>
								{view !== "" ? (
									<>
										<Icon size={16} name="eye-outline" style={styles.iconView} />
										<Text>
											{view} {t("view")}
										</Text>
									</>
								) : null}
							</View>
						</>
					)}
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 0,
		backgroundColor: nowTheme.COLORS.WHITE
	},
	category: {
		fontSize: 15,
		fontWeight: "700",
		color: nowTheme.COLORS.MUTED
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		paddingVertical: 20
	},
	date: {
		fontSize: 13,
		fontWeight: "400",
		color: nowTheme.COLORS.MUTED,
		paddingVertical: 10
	},
	author: {
		fontWeight: "700",
		fontSize: 15
	},
	imageView: {
		width: "100%",
		minHeight: 200
	},
	content: {
		fontSize: 16,
		textAlign: "left",
		marginTop: 20
	},
	tagList: {
		flexDirection: "row",
		alignItems: "flex-end",
		maxWidth: "60%"
	},
	tag: {
		backgroundColor: nowTheme.COLORS.BUTTON_COLOR,
		color: nowTheme.COLORS.WHITE,
		fontSize: 13,
		fontWeight: "700",
		paddingVertical: 3,
		paddingHorizontal: 6,
		borderRadius: 3,
		marginRight: 3
	},
	countView: {
		display: "flex",
		flexDirection: "row",
		alignItems: "baseline",
		alignSelf: "flex-end"
	},
	iconView: {
		marginRight: 5
	},
	loading: {
		display: "flex",
		marginVertical: height / 3,
		marginHorizontal: "auto"
	}
});

export default withTranslation()(ArticleDetail);
