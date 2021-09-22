let hashRoute;
let users = {
	"-Mk53Gm87wJcT9rmRHBM": {
		active: false,
		firstName: "Peter",
		lastName: "Peshov",
		password: "testuserpass890",
		username: "testuser",
	},
	"-Mk5lQKNPeI65Eh38RXq": {
		active: true,
		firstName: "Booster",
		lastName: "Boye",
		password: "goodboysonly",
		username: "booster69",
	},
};
let recipes = {
	"-Mk57i9lfZ9_qNbg_2xs": {
		category: "Grain Food",
		categoryImageURL: "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
		creator: "-Mk5lQKNPeI65Eh38RXq",
		description: "Test description",
		foodImageURL:
			"https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/1-no-one-needs-to-know-pineapple-pizza-pineapple-on-pizza-yestic.jpg",
		ingredients: ["Pizza Dough", "Mozzarella Cheese", "Pizza Sauce"],
		likesCounter: 0,
		meal: "Hawaiian Pizza",
		prepMethod: "Make the pizza.",
	},
	"-Mk584f6FVl6MqxCTAcn": {
		category: "Fruits",
		categoryImageURL: "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg",
		creator: "-Mk53Gm87wJcT9rmRHBM",
		description: "Fruit salad, yummy yummy",
		foodImageURL: "https://fitfoodiefinds.com/wp-content/uploads/2020/05/salad-1-768x1152.jpg",
		ingredients: ["Melon", "Apple", "Strawberry"],
		likesCounter: "0",
		meal: "Fruit Salad",
		prepMethod: "Beat your dog",
	},
};

let currentUser = "-Mk5lQKNPeI65Eh38RXq";
let active = false;

function listen() {
	let current = getCurrent();
	if (current !== hashRoute) {
		console.log(current);
		hashRoute = current;
		refreshNavBar();

		if (hashRoute == "" || hashRoute == "#home") {
			home();
		} else if (hashRoute == "#register") {
			register();
		} else if (hashRoute == "#login") {
			login();
		} else if (hashRoute == "#share") {
			share();
		} else if (hashRoute.includes("view")) {
			let [, recipeID] = hashRoute.split("/");
			view(recipeID);
		}
	}
	setTimeout(listen, 200);
}

function getCurrent() {
	return window.location.hash;
}

listen();
