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
		} else if (hashRoute == "#login") {
			login();
		}
	}
	setTimeout(listen, 200);
}

function getCurrent() {
	return window.location.hash;
}

listen();
