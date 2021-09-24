async function home(user) {
	let users = Object.keys(await getUsernames());
	let html;

	if (user != null && user.username != undefined && users.includes(user.username)) {
		// logged in
		let recipes = await getRecipes();
		let recipesArr = Object.values(recipes);
		let src = document.getElementById("home").innerHTML;
		let template = Handlebars.compile(src);
		let context = { recipesArr };
		html = template(context);
	} else {
		// logged out
		html = document.getElementById("anon-home").innerHTML;
	}
	render(html);
}

async function register() {
	let src = document.getElementById("register").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);

	let usernames = Object.keys(await getUsernames());

	let nameRE = /^\S{2,}$/;
	let usernameRE = /^\S{3,}$/;
	let passwordRE = /^\S{6,}$/;

	let registerBtn = document.getElementById("register-btn");

	registerBtn.addEventListener("click", function (event) {
		event.preventDefault();
		$(loadingBox).show();

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
			let url = "https://cookuni-project-default-rtdb.firebaseio.com/users.json";
			let headers = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(user),
			};
			fetch(url, headers)
				.then((response) => {
					if ((response.status = 200)) {
						return response.json();
					} else {
						console.log(response.status);
					}
				})
				.then((data) => {
					user.id = data.name;
					delete user.password;
					sessionStorage.setItem("user", JSON.stringify(user));
				})
				.catch((err) => {
					console.log(err);
				});

			showSuccess("User registration successful. Redirecting to home page...");
		}
	});
}

async function login() {
	let src = document.getElementById("login").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);

	let users = await getUsers();
	let usernames = await getUsernames();
	let loginBtn = document.getElementById("loginBtn");

	loginBtn.addEventListener("click", function (event) {
		event.preventDefault();
		$(loadingBox).show();
		let username = document.getElementById("defaultRegisterFormUsername").value;
		let password = document.getElementById("defaultRegisterFormPassword").value;

		if (usernames.hasOwnProperty(username)) {
			// username exists
			let userID = usernames[username];
			let user = users[userID]; // current user object
			if (password == user.password) {
				// and password matches
				delete user.password;
				user.id = userID;
				sessionStorage.setItem("user", JSON.stringify(user));
				showSuccess("Login successful. Redirecting to home page...");
			} else {
				// wrong password
				showError("Incorrect password. Please re-enter your password.");
			}
		} else {
			// username does not exist
			showError("ERROR: Username does not exist.");
		}
	});
}

function logout() {
	sessionStorage.removeItem("user");
	refreshNavBar();
	render("");
	showSuccess("Logout successful.");
}

async function view(recipeID) {
	let src = document.getElementById("view").innerHTML;
	let template = Handlebars.compile(src);
	let recipe = await getRecipe(recipeID);
	let html = template(recipe);
	render(html);

	let archive = document.getElementById("archive-btn");
	let edit = document.getElementById("edit-btn");
	let like = document.getElementById("like-btn");

	if (recipe.creator != getCurrentUser().id) {
		$(archive).hide();
		$(edit).hide();
		like.addEventListener("click", function () {
			recipe.likesCounter++;
			postRecipe("PATCH", JSON.stringify(recipe), recipeID);
			showSuccess("You liked that recipe.");
		});
	} else {
		$(like).hide();
		archive.addEventListener("click", function () {
			// delete from db
			postRecipe("DELETE", "", recipeID)
				.then((response) => {
					if (response.status == 200) {
						showSuccess("Your recipe was archived.");
					} else {
						console.log(response.status);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		});
		edit.addEventListener("click", function () {
			// TODO: edit(recipeID) display edit page with old recipe info
		});
	}
}

function share() {
	let src = document.getElementById("share").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);

	let mealRE = /.{4,}/;
	let ingRE = /(.+, )+.+/;
	let prepDescRE = /.{10,}/;
	let urlRE = /(http|https):\/\/\S+/;

	document.getElementById("share-btn").addEventListener("click", function (event) {
		event.preventDefault();

		let meal = document.getElementById("defaultRecepieShareMeal").value;
		let ingredients = document.getElementById("defaultRecepieShareIngredients").value;
		let prepMethod = document.getElementById("defaultRecepieShareMethodOfPreparation").value;
		let description = document.getElementById("defaultRecepieShareDescription").value;
		let foodImageURL = document.getElementById("defaultRecepieShareFoodImageURL").value;
		let category = document.getElementById("share-category");

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
				likesCounter: 0,
				creator: getCurrentUser().id,
			};

			console.log(recipe);

			let url = "https://cookuni-project-default-rtdb.firebaseio.com/recipes.json";
			let headers = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(recipe),
			};
			fetch(url, headers)
				.then((response) => {
					if ((response.status = 200)) {
						return response.json();
					} else {
						console.log(response.status);
					}
				})
				.then((data) => {
					let patchHeaders = {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id: data.name }),
					};
					fetch(`https://cookuni-project-default-rtdb.firebaseio.com/recipes/${data.name}.json`, patchHeaders)
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
}

function edit() {
	let src = document.getElementById("edit").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function render(html) {
	document.getElementById("container").innerHTML = html;
}

function refreshNavBar() {
	let src = document.getElementById("navbar").innerHTML;
	let template = Handlebars.compile(src);
	let context = getCurrentUser();
	document.getElementById("nav").innerHTML = template(context);

	let welcome = document.getElementById("nav-welcome");
	let share = document.getElementById("nav-share");
	let logout = document.getElementById("nav-logout");
	let login = document.getElementById("nav-login");
	let register = document.getElementById("nav-register");

	if (context == null) {
		$(login).show();
		$(register).show();

		if (
			hashRoute == "#share" ||
			hashRoute == "logout" ||
			hashRoute.includes("#edit") ||
			hashRoute.includes("#view")
		) {
			window.location.hash = "#home";
		}
	} else {
		$(welcome).show();
		$(share).show();
		$(logout).show();

		if (hashRoute == "#login" || hashRoute == "register") {
			window.location.hash = "#home";
		}
	}
}
