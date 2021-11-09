import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { GalioProvider } from "galio-framework";
import React from "react";
import { Image, View } from "react-native";
import { Images, nowTheme } from "./constants";
import i18n from "./i18n";
import Screens from "./navigation/Screens";

//cache app images
const assetImages = [Images.Splash, Images.logo, Images.Mosquito, Images.placeholder, Images.poster, Images.aboutImage];

function cacheImages(images) {
	return images.map(image => {
		if (typeof image === "string") {
			return Image.prefetch(image);
		} else {
			return Asset.fromModule(image).downloadAsync();
		}
	});
}
export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoadingComplete: false,
			fontLoaded: false
		};
	}
	render() {
		if (!this.state.isLoadingComplete) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		} else {
			return (
				<NavigationContainer>
					<GalioProvider theme={nowTheme}>
						<View style={{ flex: 1, paddingTop: 30 }}>
							<Screens />
						</View>
					</GalioProvider>
				</NavigationContainer>
			);
		}
	}

	_loadResourcesAsync = async () => {
		await Font.loadAsync({
			"montserrat-regular": require("./assets/font/Montserrat-Regular.ttf"),
			"montserrat-bold": require("./assets/font/Montserrat-Bold.ttf")
		});

		this.setState({ fontLoaded: true });
		return Promise.all([...cacheImages(assetImages)]);
	};

	_handleLoadingError = error => {
		console.warn(error);
	};

	_handleFinishLoading = () => {
		if (this.state.fontLoaded) {
			this.setState({ isLoadingComplete: true });
		}
	};
}
