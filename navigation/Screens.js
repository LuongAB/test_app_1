import { Picker } from "@react-native-picker/picker";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { withTranslation } from "react-i18next";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import About from "../screens/About";
import ArticleDetail from "../screens/ArticleDetail";
import Articles from "../screens/Articles";
import Category from "../screens/Category";
import Feedback from "../screens/Feedback";
import HealthOrganize from "../screens/HealthOrganize";
import Home from "../screens/Home";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
	const { t, i18n } = props;

	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props} />
			<DrawerItem
				icon={({ focused, color, size }) => (
					<Icon color={"#000"} size={24} name={focused ? "language" : "language-outline"} />
				)}
				style={{ borderTopColor: "#00c", borderTopWidth: 0.5 }}
				label={(focused, color) => (
					<Picker
						selectedValue={i18n.language}
						mode="dropdown"
						style={{
							minWidth: 170,
							maxHeight: 100
						}}
						itemStyle={{
							minWidth: 140,
							maxHeight: 100
						}}
						onValueChange={(itemValue, itemIndex) => i18n.changeLanguage(itemValue)}
					>
						<Picker.Item label={"🇻🇳 " + t("vietnamese")} value="vi" />
						<Picker.Item label={"🇺🇸 " + t("english")} value="en" />
					</Picker>
				)}
			/>
		</DrawerContentScrollView>
	);
}

const CategoryStack = props => (
	<Stack.Navigator initialRouteName="Category">
		<Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
		<Stack.Screen name="Article" component={Articles} options={{ headerShown: false }} />
		<Stack.Screen
			name="ArticleDetail"
			component={ArticleDetail}
			options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid }}
		/>
	</Stack.Navigator>
);

const MenuStack = props => {
	const { t } = props;

	return (
		<Drawer.Navigator
			initialRouteName="Home"
			drawerContent={contentProps => <CustomDrawerContent {...props} {...contentProps} />}
		>
			<Drawer.Screen
				name="Home"
				component={Home}
				options={{
					drawerLabel: t("home"),
					drawerIcon: ({ focused, color, size }) => (
						<Icon color={"black"} size={24} name={focused ? "home" : "home-outline"} />
					)
				}}
			/>
			<Drawer.Screen
				name="Categories"
				component={CategoryStack}
				options={{
					title: t("newsCategory"),
					drawerIcon: ({ focused, color, size }) => (
						<Icon color={"black"} size={24} name={focused ? "shapes" : "shapes-outline"} />
					),
					unmountOnBlur: true
				}}
			/>
			<Drawer.Screen
				name="Health"
				component={HealthOrganize}
				options={{
					title: t("nearestMedical"),
					drawerIcon: ({ focused, color, size }) => (
						<Icon color={"black"} size={24} name={focused ? "medkit" : "medkit-outline"} />
					)
				}}
			/>
			<Drawer.Screen
				name="Feedback"
				component={Feedback}
				options={{
					title: t("feedback"),
					drawerIcon: ({ focused, color, size }) => (
						<Icon color={"black"} size={24} name={focused ? "chatbubbles" : "chatbubbles-outline"} />
					)
				}}
			/>
		</Drawer.Navigator>
	);
};

const config = {
	animation: "spring",
	config: {
		stiffness: 1000,
		damping: 500,
		mass: 3,
		overshootClamping: true,
		restDisplacementThreshold: 0.01,
		restSpeedThreshold: 0.01
	}
};

const RootNavigation = props => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="About"
				component={About}
				options={{
					headerShown: false,
					transitionSpec: {
						open: config,
						close: config
					}
				}}
			/>
			<Stack.Screen
				name="Menu"
				children={() => <MenuStack {...props} />}
				options={({ navigation }) => ({
					transitionSpec: {
						open: config,
						close: config
					},
					headerStyle: {
						height: 80,
						elevation: 0
					},
					headerTitle: props => (
						<Text
							{...props}
							{...navigation}
							style={{ textAlign: "center", fontSize: 20, fontWeight: "700" }}
							onPress={() => navigation.navigate("Home")}
						>
							Dengue Alert
						</Text>
					),
					headerLeft: props => (
						<Icon
							{...props}
							{...navigation}
							onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
							name="grid-outline"
							size={25}
							style={{ paddingLeft: 20 }}
						/>
					),
					headerRight: props => (
						<Icon
							{...props}
							{...navigation}
							name="medkit-outline"
							size={25}
							style={{ paddingRight: 20 }}
							onPress={() => navigation.navigate("Health")}
						/>
					)
				})}
			/>
		</Stack.Navigator>
	);
};

export default withTranslation()(RootNavigation);
