const APPLICATION_PATH = "/";
const VOUCHER_TYPE = {
	Liquidate: -2, // Thanh lý
	StockOut: -1, //Xuất kho vật tư
	StockIn: 1, //Nhập kho vật tư
	Allocation: 2, //Cấp phát
	Transfer: 3, //Điều chuyển
	ReceivingAsset: 4, //Tiếp nhận tài sản
	TransferToAnotherUnit: 5 //Điều chuyển đơn vị khác
};

const ROLES = {
	ROLE_USER: "ROLE_USER", // người dùng
	ROLE_ASSET_MANAGER: "ROLE_ASSET_MANAGER", // người quản lí vật tư
	ROLE_ASSET_USER: "ROLE_ASSET_USER", // đại diện phòng ban
	ROLE_ADMIN: "ROLE_ADMIN", // admin
	ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN", // super admin
	ROLE_ORG_ADMIN: "ROLE_ORG_ADMIN" //
};

//const APPLICATION_PATH="/asset_develop/";//Đặt homepage tại package.json giống như tại đây nếu deploy develop
module.exports = Object.freeze({
	//ROOT_PATH : "/egret/",
	ROOT_PATH: APPLICATION_PATH,
	ACTIVE_LAYOUT: "layout1", //layout1 = vertical, layout2=horizontal
	URL_PREFIX: "/org", // org
	API_ENDPOINT: "http://api.oceantech.vn/demonimpe",
	//API_ENDPOINT: "http://localhost:8993/nimpe",
	//API_IMAGE: "http://localhost:8993/nimpe/public/api/getImage/",
	//API_ENDPOINT: "http://api.oceantech.vn/nimpe",
	//API_IMAGE: "http://api.oceantech.vn/nimpe/public/api/getImage/",
	// API_ENPOINT: "http://cloud.ammis.vn:8061/asset",
	// API_ENPOINT: "http://cloud.assetvn.net:8065/asset",
	// API_ENPOINT: "http://localhost:8093/asset/org",    //local org
	//API_ENPOINT: "http://demo.ammis.vn:8097/asset",
	//API_ENPOINT: "http://dev.ammis.vn:8094/asset",//Dev
	//API_ENPOINT: "http://tlu.ammis.vn:8098/asset",//TLU
	LOGIN_PAGE: APPLICATION_PATH + "session/signin", //Nếu là Spring
	HOME_PAGE: APPLICATION_PATH + "dashboard/analytics", //Nếu là Spring
	//HOME_PAGE:APPLICATION_PATH+"dashboard/learning-management"//Nếu là Keycloak
	//HOME_PAGE:APPLICATION_PATH+"landing3",//Link trang landing khi bắt đầu
	VOUCHER_TYPE: VOUCHER_TYPE,
	ROLES: ROLES,
	MATERIAL_DEPARTMENT_CODE: "VPB4"
});
