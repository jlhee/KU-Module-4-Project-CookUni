let hashRoute;
let user;

let users;

let welcome = document.getElementById("nav-welcome");
let shareNav = document.getElementById("nav-share");
let logoutNav = document.getElementById("nav-logout");
let loginNav = document.getElementById("nav-login");
let registerNav = document.getElementById("nav-register");

let successBox = document.getElementById("successBox");
let loadingBox = document.getElementById("loadingBox");
let errorBox = document.getElementById("errorBox");

let categories = {
	vegetable: "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg",
	fruit: "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg",
	grain: "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
	dairy: "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
	protein: "https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg",
};

async function listen() {
	let currentHash = getCurrentHash();
	let currentUser = getSessionUser();

	if (currentHash !== hashRoute) {
		$(loadingBox).show();

		if (currentUser !== user) {
			user = currentUser;
			if (currentUser == null) {
				$(welcome).hide();
				$(shareNav).hide();
				$(logoutNav).hide();
				$(loginNav).show();
				$(registerNav).show();
			} else {
				welcome.innerHTML = `Welcome, ${currentUser.firstName} ${currentUser.lastName}!`;
				$(welcome).show();
				$(shareNav).show();
				$(logoutNav).show();
				$(loginNav).hide();
				$(registerNav).hide();
			}
		}

		hashRoute = currentHash;
		if (hashRoute == "" || hashRoute == "#home") {
			home(currentUser);
		} else if (hashRoute == "#register") {
			register();
		} else if (hashRoute == "#login") {
			login();
		} else if (hashRoute == "#logout") {
			logout();
		} else if (hashRoute == "#share") {
			share();
		} else if (hashRoute.includes("view")) {
			let [, recipeID] = hashRoute.split("/");
			view(recipeID, currentUser);
		} else if (hashRoute.includes("edit")) {
			let [, recipeID] = hashRoute.split("/");
			edit(recipeID);
		} else if (hashRoute.includes("archive")) {
			let [, recipeID] = hashRoute.split("/");
			archive(recipeID);
		} else if (hashRoute.includes("like")) {
			let [, recipeID] = hashRoute.split("/");
			like(recipeID);
		}
	}

	setTimeout(listen, 200);
}

listen();
