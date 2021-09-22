function home() {
	if (currentUser == "") {
		// logged out
		let html = document.getElementById("anon-home").innerHTML;
		render(html);
	} else {
		// logged in
		fetch("https://cookuni-project-default-rtdb.firebaseio.com/recipes.json")
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				// let recipeArr = Object.entries(data).map((recipe) => {
				// 	let [id, recipeInfo] = recipe;
				// 	recipeInfo.id = id;
				// 	return recipeInfo;
				// });
				let recipesArr = Object.values(data);
				let src = document.getElementById("home").innerHTML;
				let template = Handlebars.compile(src);
				let context = { recipesArr };
				let html = template(context);
				render(html);
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

function register() {
	let src = document.getElementById("register").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function login() {
	// change active status to true
	let src = document.getElementById("login").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function view(recipeID) {
	fetch(`https://cookuni-project-default-rtdb.firebaseio.com/recipes/${recipeID}.json`)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			let src = document.getElementById("view").innerHTML;
			let template = Handlebars.compile(src);
			let html = template(data);
			render(html);
		})
		.catch((err) => {
			console.log(err);
		});
}

function share() {
	let src = document.getElementById("share").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);

	document.getElementById("share-btn").addEventListener("click", function (event) {
		event.preventDefault();
		let meal = document.getElementById("defaultRecepieShareMeal").value;
		let ingredients = document.getElementById("defaultRecepieShareIngredients").value.split(", ");
		let prepMethod = document.getElementById("defaultRecepieShareMethodOfPreparation").value;
		let description = document.getElementById("defaultRecepieShareDescription").value;
		let foodImageURL = document.getElementById("defaultRecepieShareFoodImageURL").value;
		let category = document.getElementById("share-category");

		let data = {
			meal,
			ingredients,
			prepMethod,
			description,
			foodImageURL,
			category: category.options[category.selectedIndex].value,
			categoryImageURL: "",
			likesCounter: 0,
			creator: currentUser,
		};
		if (data.category == "Vegetables and legumes/beans") {
			data.categoryImageURL = "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg";
		} else if (data.category == "Fruits") {
			data.categoryImageURL = "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg";
		} else if (data.category == "Grain Food") {
			data.categoryImageURL = "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg";
		} else if (data.category == "Milk, cheese, eggs and alternatives") {
			data.categoryImageURL =
				"https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg";
		} else if (data.category == "Lean meats and poultry, fish and alternatives") {
			data.categoryImageURL =
				"https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg";
		}
		// console.log(data);

		let url = "https://cookuni-project-default-rtdb.firebaseio.com/recipes.json";
		let headers = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
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
				// console.log(data.name);
				let patchHeaders = {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: data.name }),
				};
				fetch(`https://cookuni-project-default-rtdb.firebaseio.com/recipes/${data.name}.json`, patchHeaders)
					.then((response) => {
						if (response.status == 200) {
							window.location.hash = "#home";
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
	let context = users[currentUser];
	document.getElementById("nav").innerHTML = template(context);

	let welcome = document.getElementById("nav-welcome");
	let share = document.getElementById("nav-share");
	let logout = document.getElementById("nav-logout");
	let login = document.getElementById("nav-login");
	let register = document.getElementById("nav-register");

	if (currentUser == "") {
		welcome.style.display = "none";
		share.style.display = "none";
		logout.style.display = "none";
		login.removeAttribute("style");
		register.removeAttribute("style");

		if (
			hashRoute == "#share" ||
			hashRoute == "logout" ||
			hashRoute.includes("#edit") ||
			hashRoute.includes("#view")
		) {
			window.location.hash = "#home";
		}
	} else {
		welcome.removeAttribute("style");
		share.removeAttribute("style");
		logout.removeAttribute("style");
		login.style.display = "none";
		register.style.display = "none";

		if (hashRoute == "#login" || hashRoute == "register") {
			window.location.hash = "#home";
		}
	}
}
