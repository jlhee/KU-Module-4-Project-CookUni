async function home(user) {
	let users = Object.keys(await getUsernames());
	let html;

	if (user != null && user.username != undefined && users.includes(user.username)) {
		let recipes = await getRecipe();
		let recipesArr = Object.values(recipes);
		let src = document.getElementById("home").innerHTML;
		let template = Handlebars.compile(src);
		let context = { recipesArr };
		html = template(context);
	} else {
		html = document.getElementById("anon-home").innerHTML;
	}
	render(html);
	$(loadingBox).hide();
}

async function register() {
	let src = document.getElementById("register").innerHTML;
	let template = Handlebars.compile(src);
	let html = template({});
	render(html);

	let nameRE = /^\S{2,}$/;
	let usernameRE = /^\S{3,}$/;
	let passwordRE = /^\S{6,}$/;

	document.getElementById("register-btn").addEventListener("click", async function (event) {
		event.preventDefault();
		$(loadingBox).show();
		let usernames = Object.keys(await getUsernames());

		let firstName = document.getElementById("defaultRegisterFormFirstName").value;
		let lastName = document.getElementById("defaultRegisterFormLastName").value;
		let username = document.getElementById("defaultRegisterFormUsername").value;
		let password = document.getElementById("defaultRegisterFormPassword").value;
		let repeatPassword = document.getElementById("defaultRegisterRepeatPassword").value;

		if (!nameRE.test(firstName) || !nameRE.test(lastName)) {
			showError("Invalid Input - First and last name must be at least 2 characters long.");
		} else if (!usernameRE.test(username)) {
			showError("Invalid Input - Username must be at least 3 characters long.");
		} else if (usernames.includes(username)) {
			showError(`Username "${username}" is already taken. Please enter a different username.`);
		} else if (!passwordRE.test(password)) {
			showError("Invalid Input - Password must be at least 6 characters long.");
		} else if (password != repeatPassword) {
			showError(
				"Re-entered password does not match original. Please re-enter password to match first password provided."
			);
		} else {
			let user = {
				firstName,
				lastName,
				username,
				password,
				loggedIn: true,
			};

			postUser("POST", JSON.stringify(user))
				.then((response) => {
					if (response.status == 200) {
						return response.json();
					} else {
						console.log(response.status);
					}
				})
				.then((data) => {
					user.id = data.name;
					delete user.password;
					sessionStorage.setItem("user", JSON.stringify(user));
					showSuccess("User registration successful.");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});

	$(loadingBox).hide();
}

async function login() {
	let src = document.getElementById("login").innerHTML;
	let template = Handlebars.compile(src);
	let html = template({});
	render(html);

	document.getElementById("loginBtn").addEventListener("click", async function (event) {
		event.preventDefault();
		$(loadingBox).show();
		let users = await getUsers();
		let usernames = await getUsernames();

		let username = document.getElementById("defaultRegisterFormUsername").value;
		let password = document.getElementById("defaultRegisterFormPassword").value;

		if (usernames.hasOwnProperty(username)) {
			// username exists
			let userID = usernames[username];
			let user = users[userID]; // current user object
			if (password == user.password) {
				delete user.password;
				user.id = userID;
				sessionStorage.setItem("user", JSON.stringify(user));
				showSuccess("Login successful.");
			} else {
				showError("Incorrect password. Please re-enter your password.");
			}
		} else {
			showError("ERROR: Username does not exist.");
		}
	});

	$(loadingBox).hide();
}

function logout() {
	sessionStorage.clear();
	document.getElementById("container").innerHTML = "";
	showSuccess("Logout successful.");
}

async function view(recipeID, user) {
	let src = document.getElementById("view").innerHTML;
	let template = Handlebars.compile(src);
	let recipe = await getRecipe(recipeID);
	let html = template(recipe);
	render(html);

	if (recipe.creator != user.id) {
		$(document.getElementById("like-btn")).show();
	} else {
		$(document.getElementById("archive-btn")).show();
		$(document.getElementById("edit-btn")).show();
	}

	$(loadingBox).hide();
}

function archive(recipeID) {
	postRecipe("DELETE", "", recipeID)
		.then((response) => {
			if (response.status == 200) {
				showSuccess("Your recipe was archived.");
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

async function like(recipeID) {
	let recipe = await getRecipe(recipeID);
	recipe.likesCounter++;
	postRecipe("PATCH", JSON.stringify({ likesCounter: recipe.likesCounter }), recipeID)
		.then((response) => {
			if (response.status == 200) {
				showSuccess("You liked that recipe.");
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

async function edit(recipeID) {
	let src = document.getElementById("edit").innerHTML;
	let template = Handlebars.compile(src);
	let recipe = await getRecipe(recipeID);
	recipe.ingredients = recipe.ingredients.join(", ");
	let html = template(recipe);
	render(html);

	let options = document.getElementById("edit-category").children;
	for (let i in options) {
		if (options[i].innerText == recipe.category) {
			options[i].setAttribute("selected", true);
		}
	}

	document.getElementById("editBtn").addEventListener("click", function (event) {
		event.preventDefault();
		$(loadingBox).show();
		let meal = document.getElementById("defaultRecepieEditMeal").value;
		let ingredients = document.getElementById("defaultRecepieEditIngredients").value;
		let prepMethod = document.getElementById("defaultRecepieEditMethodOfPreparation").value;
		let description = document.getElementById("defaultRecepieEditDescription").value;
		let foodImageURL = document.getElementById("defaultRecepieEditFoodImageURL").value;
		let category = document.getElementById("edit-category");
		let editedRecipe = recipeValidation(
			meal,
			ingredients,
			prepMethod,
			description,
			foodImageURL,
			category,
			recipeID,
			recipe.likesCounter
		);

		if (editedRecipe) {
			postRecipe("PATCH", JSON.stringify(editedRecipe), recipeID)
				.then((response) => {
					if (response.status == 200) {
						showSuccess("Recipe edited successfully!");
					} else {
						console.log(response.status);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});

	$(loadingBox).hide();
}

function share() {
	let src = document.getElementById("share").innerHTML;
	let template = Handlebars.compile(src);
	let html = template({});
	render(html);

	document.getElementById("share-btn").addEventListener("click", function (event) {
		event.preventDefault();
		$(loadingBox).show();

		let meal = document.getElementById("defaultRecepieShareMeal").value;
		let ingredients = document.getElementById("defaultRecepieShareIngredients").value;
		let prepMethod = document.getElementById("defaultRecepieShareMethodOfPreparation").value;
		let description = document.getElementById("defaultRecepieShareDescription").value;
		let foodImageURL = document.getElementById("defaultRecepieShareFoodImageURL").value;
		let category = document.getElementById("share-category");

		let recipe = recipeValidation(meal, ingredients, prepMethod, description, foodImageURL, category);

		if (recipe) {
			postRecipe("POST", JSON.stringify(recipe))
				.then((response) => {
					if (response.status == 200) {
						return response.json();
					} else {
						console.log(response.status);
					}
				})
				.then((data) => {
					postRecipe("PATCH", JSON.stringify({ id: data.name }), data.name)
						.then((response) => {
							if (response.status == 200) {
								meal = "";
								ingredients = "";
								prepMethod = "";
								description = "";
								foodImageURL = "";
								category.value = "";
								showSuccess("Recipe shared successfully!");
							} else {
								console.log(response.status);
							}
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});

	$(loadingBox).hide();
}

function render(html) {
	document.getElementById("container").innerHTML = html;
}
