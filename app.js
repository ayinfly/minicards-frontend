const main = document.getElementById("main");
const allCardsBtn = document.getElementById("all-cards");
const usersBtn = document.getElementById("users");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");
const allCardsTempBtn = document.getElementById("all-cards-temp");
const registerTempBtn = document.getElementById("register-temp");

registerBtn.addEventListener("click", () => {
    register();
});

registerTempBtn.addEventListener("click", () => {
    register();
});

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
            '<span id="error"></span>' +
        '</form>';

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const loginData = new FormData(registerForm).entries();
        alert(loginData.username);
        let res = await fetch("http://localhost:3000/api/users/signup",{
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(loginData))
        });

        let data = await res.json();
        if(res.status === 200){
            saveTokenData(data);
        } else{
            print(data)
            error.innerHTML = data.info.message
        }
    })
}

function saveTokenData(data){
    localStorage.setItem("token", data.token)
    localStorage.setItem("username", data.user.username )
}
