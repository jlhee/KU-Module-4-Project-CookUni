function getCurrentHash() {
	return window.location.hash;
}

// return current user obj in sessionStorage, null if no user
function getCurrentUser() {
	try {
		return JSON.parse(sessionStorage.getItem("user"));
	} catch (err) {
		console.log(err.message);
		return;
	}
}

// returns object of all users { userID:{ key:val, key:val }, ..., }
async function getUsers() {
	let data = await fetch("https://cookuni-project-default-rtdb.firebaseio.com/users.json");
	return data.json();
}

// returns object of usernames -> { username:userID, ..., }
async function getUsernames() {
	let users = await getUsers();
	let usernames = {};
	for (let user of Object.entries(users)) {
		usernames[user[1].username] = user[0];
	}
	return usernames;
}

// returns object of all recipe objects { recipeID:{key:val, key:val}, ..., }
async function getRecipes() {
	let data = await fetch("https://cookuni-project-default-rtdb.firebaseio.com/recipes.json").then((response) => {
		return response.json();
	});
	return await data;
}

// return recipe object { key:val, key:val, ..., }
async function getRecipe(recipeID) {
	let recipe = await fetch(`https://cookuni-project-default-rtdb.firebaseio.com/recipes/${recipeID}.json`)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
	return recipe;
}

// write to db
async function postRecipe(method, body, recipeID) {
	let headers = {
		method: method,
		headers: { "Content-Type": "application/json" },
		body: body,
	};

	return await fetch(`https://cookuni-project-default-rtdb.firebaseio.com/recipes/${recipeID}.json`, headers);
}

function showError(message) {
	errorBox.innerHTML = message;
	$(errorBox).show();
}

function showSuccess(message) {
	$(errorBox).hide();
	successBox.innerHTML = message;
	$(successBox).show();
	setTimeout(function () {
		$(successBox).hide();
		$(loadingBox).hide();
		window.location.hash = "#home";
	}, 2000);
}
