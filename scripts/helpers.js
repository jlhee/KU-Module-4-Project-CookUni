function getCurrentHash() {
	return window.location.hash;
}

// return current user obj in sessionStorage, null if no user
function getSessionUser() {
	try {
		return JSON.parse(sessionStorage.getItem("user"));
	} catch (err) {
		console.log(err.message);
		return;
	}
}

// returns object of all users { userID:{ key:val, key:val }, ..., }
async function getUsers() {
	let data = await fetch("https://cookuni-project-default-rtdb.firebaseio.com/users.json")
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
	return data;
}

// returns object { username:userID, ..., }
async function getUsernames() {
	let users = await getUsers();
	let usernames = {};
	for (let user of Object.entries(users)) {
		usernames[user[1].username] = user[0];
	}
	return usernames;
}

// no id arg => return object of all recipe objects { recipeID:{key:val, key:val}, ..., }
// with id arg => return requested recipe object { key:val, key:val, ..., }
async function getRecipe(recipeID = "") {
	let data = await fetch(`https://cookuni-project-default-rtdb.firebaseio.com/recipes/${recipeID}.json`)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
	return await data;
}

// write to recipes db => return response
async function postRecipe(method, body = "", recipeID = "") {
	let headers = {
		method: method,
		headers: { "Content-Type": "application/json" },
		body: body,
	};
	let response = await fetch(`https://cookuni-project-default-rtdb.firebaseio.com/recipes/${recipeID}.json`, headers);
	return response;
}

// write to users db => return response
async function postUser(method, body = "", userID = "") {
	let headers = {
		method: method,
		headers: { "Content-Type": "application/json" },
		body: body,
	};
	let response = await fetch(`https://cookuni-project-default-rtdb.firebaseio.com/users/${userID}.json`, headers);
	return response;
}

function recipeValidation(
	meal,
	ingredients,
	prepMethod,
	description,
	foodImageURL,
	category,
	id = "",
	likesCounter = 0
) {
	let mealRE = /.{4,}/;
	let ingRE = /(.+, )+.+/;
	let prepDescRE = /.{10,}/;
	let urlRE = /(http|https):\/\/\S+/;

	if (!mealRE.test(meal)) {
		showError("Invalid Input - Meal name must be at least 4 characters long");
	} else if (!ingRE.test(ingredients)) {
		showError(
			"Invalid Input - Ingredients must have at least 2 items, separated by a comma and space (ingredient1, ingredient2, ingredient3, ...)"
		);
	} else if (!prepDescRE.test(prepMethod) || !prepDescRE.test(description)) {
		showError("Invalid Input - Method of Preperation and Description must be at least 10 characters long");
	} else if (!urlRE.test(foodImageURL)) {
		showError("Invalid Input - URL must start with `http://` or 'https://'");
	} else if (category.value == "") {
		showError("Please select a category from dropdown list.");
	} else {
		let recipe = {
			meal,
			ingredients: ingredients.split(", "),
			prepMethod,
			description,
			foodImageURL,
			category: category.options[category.selectedIndex].innerText,
			categoryImageURL: categories[category.value],
			likesCounter,
			id,
			creator: getSessionUser().id,
		};
		return recipe;
	}
}

function showError(message) {
	errorBox.innerHTML = message;
	errorBox.addEventListener("click", function () {
		$(errorBox).hide();
	});
	$(errorBox).show();
	$(loadingBox).hide();
}

function showSuccess(message) {
	$(errorBox).hide();
	successBox.innerHTML = message;
	$(successBox).show();

	successBox.addEventListener("click", function () {
		$(successBox).hide();
	});

	setTimeout(function () {
		$(successBox).hide();
	}, 5000);
	window.location.hash = "#home";
}
