import { Text } from "galio-framework";
import React from "react";
import { withTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { searchByPage } from "../services/ArticleServices";
import Card from "./CustomCard";

class Articles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			articles: [],
			pageIndex: 1,
			pageSize: 5,
			loading: false,
			isAllArticle: false,
			language: ""
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (props.route.params.id) {
			return {
				category: {
					id: props.route.params.id
				}
			};
		}
		return null;
	}

	componentDidMount() {
		this.updateData();
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
				() => this.updateData()
			);
		}
	}

	updateData = () => {
		this.setState({
			pageIndex: 1,
			loading: true
		});
		const option = {};
		option.category = this.state.category;
		option.pageIndex = this.state.pageIndex;
		option.pageSize = this.state.pageSize;
		option.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;

		searchByPage(option)
			.then(({ data }) => {
				this.setState({
					articles: data.content,
					loading: false
				});
			})
			.catch(() => {
				this.setState({ articles: [], loading: false });
			});
	};

	loadMore = () => {
		if (this.state.isAllArticle) {
			return;
		}
		this.setState({ pageIndex: this.state.pageIndex + 1, loading: true }, () => {
			const option = {};
			option.pageIndex = this.state.pageIndex;
			option.pageSize = this.state.pageSize;
			option.category = this.state.category;
			option.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;

			searchByPage(option)
				.then(response => {
					if (this.state.articles.length === response.data.totalElements) {
						this.setState({
							isAllArticle: true
						});
					}
					this.setState({
						articles: [...this.state.articles, ...response.data.content],
						loading: false
					});
				})
				.catch(() => {
					this.setState({
						loading: false,
						articles: []
					});
				});
		});
	};

	// onSearch = () => {
	// 	const option = {};
	// 	this.setState({
	// 		loading: true
	// 	});

	// 	option.pageIndex = 1;
	// 	option.pageSize = this.state.pageSize;
	// 	searchByPage(option)
	// 		.then(({ data }) => {
	// 			this.setState({
	// 				articles: data.content,
	// 				loading: false
	// 			});
	// 		})
	// 		.catch(() => {
	// 			this.setState({
	// 				articles: [],
	// 				loading: false
	// 			});
	// 		});
	// };

	renderRow = ({ item }) => {
		return (
			<View>
				<Card item={item} horizontal />
			</View>
		);
	};

	render() {
		const { articles, loading } = this.state;
		const { item } = this.props.route.params;
		const { navigation, t } = this.props;

		return (
			<View style={styles.container}>
				<View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
					<Icon
						{...navigation}
						color={"black"}
						size={40}
						name="arrow-back-outline"
						onPress={() => this.props.navigation.goBack()}
					/>
					<Text style={styles.categoryTitle}>
						{t("topic")} {this.props.route.params?.title}
					</Text>
				</View>

				{loading && <ActivityIndicator size="large" color="#00ff00" style={styles.loading} />}

				{!loading && articles.length === 0 ? (
					<Text style={styles.loading}>{t("noContent")}</Text>
				) : (
					<FlatList
						style={styles.articleList}
						data={articles}
						renderItem={this.renderRow}
						keyExtractor={item => item.id}
						onEndReached={this.loadMore}
						onEndReachedThreshold={0.02}
						showsVerticalScrollIndicator={false}
					/>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		padding: 15,
		paddingTop: 0,
		backgroundColor: "#fff"
	},
	search: {
		minWidth: "100%",
		height: 50,
		borderWidth: 1,
		padding: 10,
		borderColor: "#A9E4D7",
		borderRadius: 5
	},
	scrollMenu: {
		width: "100%"
	},
	category: {
		width: "auto",
		paddingHorizontal: 15,
		borderRadius: 5
	},
	articleList: {
		height: "80%"
	},
	loading: {
		position: "absolute",
		bottom: "50%",
		left: "35%",
		zIndex: 999
	},
	categoryTitle: {
		fontSize: 18,
		fontWeight: "700"
	}
});

export default withTranslation()(Articles);
