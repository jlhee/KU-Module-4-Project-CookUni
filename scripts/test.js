let nameRE = /^[a-zA-Z]{2,}$/gm;
let usernameRE = /\S{3,}/gm;
let passwordRE = /\S{6,}/gm;

// console.log(nameRE.test("first1"));

// console.log(JSON.parse("test"));
let obj = { test: "test" };
console.log(obj.poo); // undefined
console.log("test".poo); // undefined
let test = null;
// console.log(test.user); // error

let user = { username: "gudetoby" };
console.log(JSON.stringify(user));
