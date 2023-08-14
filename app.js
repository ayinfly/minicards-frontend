// canvas
const main = document.getElementById("main");

// buttons
const allCardsBtn = document.getElementById("all-cards");
const usersBtn = document.getElementById("users");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");
const allCardsTempBtn = document.getElementById("all-cards-temp");
const registerTempBtn = document.getElementById("register-temp");

usersBtn.addEventListener("click", () => {
    users();
});

registerBtn.addEventListener("click", () => {
    register();
});

registerTempBtn.addEventListener("click", () => {
    register();
});

async function users() {
    main.innerHTML = ""
    let res = await fetch("http://localhost:3000/api/users/",{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curUser = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-5" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curUser["username"]}</h5>
                    <a id="all-cards-temp" href="#" class="card-link">visit</a>
                </div>
            </div>`
    }
}

function myCards() {

}

function register() {
    // form code lmao
    main.innerHTML =
        '<form id="register-form" class="mx-auto mt-5 " style="width:25%;">' +
            '<div class="form-group">' +
                '<label for="exampleInputEmail1">username</label>' +
                '<input type="username" name="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="username">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="exampleInputPassword1">password</label>' +
                '<input type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="password">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="exampleInputPassword2">confirm password</label>' +
                '<input type="password" name="confirmPassword" class="form-control" id="exampleInputPassword2">' +
            '</div>' +
            '<button type="submit" class="btn btn-primary">Submit</button>' +
            '<div id="error" class="mt-2"></div>' +
        '</form>';

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const loginData = new FormData(registerForm).entries();
        let res = await fetch("http://localhost:3000/api/users/signup",{
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(loginData))
        });

        let data = await res.json();
        if(res.status === 200){
            saveTokenData(data);
        } else{
            error.innerHTML = data.error;
        }
    })
}

function saveTokenData(data){
    localStorage.setItem("token", data.token)
    localStorage.setItem("username", data.user.username )
}
