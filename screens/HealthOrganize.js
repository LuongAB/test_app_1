import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { nowTheme } from "../constants";
import { searchByPage } from "../services/HealOrganizeServices";
import { withTranslation } from "react-i18next";

class HealOrganize extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			healOrganizes: [],
			pageIndex: 1,
			pageSize: 5,
			loading: false,
			language: ""
		};
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
		option.pageIndex = this.state.pageIndex;
		option.pageSize = this.state.pageSize;
		option.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;

		searchByPage(option)
			.then(({ data }) => {
				this.setState({
					healOrganizes: data.content,
					loading: false
				});
			})
			.catch(() => {
				this.setState({ healOrganizes: [], loading: false });
			});
	};

	renderRow = ({ item }) => {
		const { t } = this.props;
		return (
			<View style={styles.category}>
				<Icon name="ambulance" color="red" size={30} style={{ marginRight: 20 }} />
				<View style={{ flexDirection: "column", marginRight: 20 }}>
					<Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>{item.name}</Text>
					<Text style={{ maxWidth: "95%" }}>
						{t("address")} : {item.address}
					</Text>
				</View>
			</View>
		);
	};

	render() {
		const { healOrganizes, loading } = this.state;
		const { t } = this.props;

		return (
			<View style={styles.container}>
				<Text style={styles.categoryTitle}>{t("nearestMedical")}</Text>

				{loading ? (
					<ActivityIndicator size="large" color="#00ff00" style={styles.loading} />
				) : (
					<FlatList
						style={styles.articleList}
						data={healOrganizes}
						renderItem={this.renderRow}
						keyExtractor={item => item.id}
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
		padding: 15
	},
	scrollMenu: {
		width: "100%"
	},
	category: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		width: "auto",
		paddingHorizontal: 20,
		paddingVertical: 25,
		borderRadius: 5,
		backgroundColor: nowTheme.COLORS.SCROLL_ITEM,
		shadowColor: nowTheme.COLORS.PRICE_COLOR,
		elevation: 1,
		shadowOffset: {
			width: 3,
			height: 5
		},
		marginBottom: 16,
		padding: 10
	},
	articleList: {
		height: "90%",
		marginTop: 10
	},
	loading: {
		position: "absolute",
		bottom: "50%",
		left: "50%",
		zIndex: 999
	},
	categoryTitle: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 16
	}
});

export default withTranslation()(HealOrganize);
