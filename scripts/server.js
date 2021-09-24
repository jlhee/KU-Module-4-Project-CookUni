let hashRoute;

let currentUser;
let users;

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
	if (currentHash !== hashRoute) {
		hashRoute = currentHash;
		currentUser = getCurrentUser();
		refreshNavBar();

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
			view(recipeID);
		}
	}
	setTimeout(listen, 200);
}

listen();
