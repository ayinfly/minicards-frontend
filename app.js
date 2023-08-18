// canvas
const main = document.getElementById("main");

// buttons
const allCardsBtn = document.getElementById("all-cards");
const usersBtn = document.getElementById("users");
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");
const allCardsTempBtn = document.getElementById("all-cards-temp");
const registerTempBtn = document.getElementById("register-temp");

allCardsBtn.addEventListener("click", folders);
usersBtn.addEventListener("click", users);
loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);
allCardsTempBtn.addEventListener("click", folders);
registerTempBtn.addEventListener("click", register);

// checks if token exists
function checkToken(){
    let token = localStorage.getItem("token");
    if(token){
      return token
    }
    return;
}

// creates input form to create a new folder
function newFolderFunc() {
    const newFolderBox = document.getElementById("newFolderBox");
    newFolderBox.innerHTML = 
    `<form id="newFolderForm">
        <div class="form-group m-2">
            <input type="text" name="title" class="form-control" placeholder="title"
        </div>
        <button type="submit" class="btn btn-primary m-2">create</button>
    </form>
    <div id="setError">
    </div>`;

    const newFolderForm = document.getElementById("newFolderForm");
    newFolderForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const loginData = new FormData(newFolderForm).entries();
        const bearer = `Bearer ${localStorage.getItem("token")}`
        let res = await fetch("http://localhost:3000/api/folders/create",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearer,
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(Object.fromEntries(loginData))
        });

        let data = await res.json();
        if(res.status === 200){
            myCards()
        } else{
            document.getElementById("setError").innerHTML = data.error;
        }
    })
}

// edits folder name
async function editFolder(id) {
    const editBox = document.getElementById(id);
    editBox.innerHTML =
    `<form id="editFolderForm">
        <div class="form-group my-2">
            <input type="text" name="title" class="form-control" placeholder="new title"
        </div>
        <button type="submit" class="btn btn-primary m-2">edit</button>
    </form>
    <div id="editSetError">
    </div>`;

    const editFolderForm = document.getElementById("editFolderForm");
    editFolderForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const folderData = new FormData(editFolderForm).entries();
        const bearer = `Bearer ${localStorage.getItem("token")}`
        let res = await fetch(`http://localhost:3000/api/folders/${id}/edit`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearer,
            },
            body: JSON.stringify(Object.fromEntries(folderData))
        });

        let data = await res.json();
        if(res.status === 200){
            myCards()
        } else{
            document.getElementById("editSetError").innerHTML = data.error;
        }
    })
        
}

async function study(folder_id, name) {
    main.innerHTML = 
    `<div id="carouselExampleControls" class="carousel slide" data-ride="carousel" data-interval="false">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <div class="card mx-auto my-2" style="width: 25rem;">
                    <div class="card-body">
                        <a id="newFolder" href="#" class="card-link">create new set</a>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
            </div>
            <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>`
}

// deletes a specific card
async function deleteCard(card_id, folder_id, name) {
    const bearer = `Bearer ${localStorage.getItem("token")}`;
    let res = await fetch(`http://localhost:3000/api/folders/${folder_id}/cards/${card_id}/delete`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": bearer,
        }
    })
    const data = await res.json();
    if (res.status === 200){
        editCards(folder_id, name);
        return;
    }
}

// creates a new card
function newCardFunc(id, name) {
    const newCardBox = document.getElementById("newCardBox");
    newCardBox.innerHTML = 
    `<form id="newCardForm">
        <div class="form-group m-2">
            <input type="text" name="front" class="form-control" placeholder="front">
        </div>
        <div class="form-group m-2">
            <input type="text" name="back" class="form-control" placeholder="back">
        </div>
        <button type="submit" class="btn btn-primary m-2">create</button>
    </form>
    <div id="setError">
    </div>`;

    const newCardForm = document.getElementById("newCardForm");
    newCardForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const cardData = new FormData(newCardForm).entries();
        const bearer = `Bearer ${localStorage.getItem("token")}`
        let res = await fetch(`http://localhost:3000/api/folders/${id}/cards/`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearer,
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify(Object.fromEntries(cardData))
        });

        let data = await res.json();
        if(res.status === 200){
            editCards(id, name);
        } else{
            document.getElementById("setError").innerHTML = data.error;
        }
    })
}

// edits a specific card
async function editCard(card_id, folder_id, name) {
    const editBox = document.getElementById(card_id);
    editBox.innerHTML =
    `<form id="editCardForm">
        <div class="form-group my-2">
            <input type="text" name="front" class="form-control" placeholder="new front"
        </div>
        <div class="form-group my-2">
            <input type="text" name="back" class="form-control" placeholder="new back"
        </div>
        <button type="submit" class="btn btn-primary m-2">edit</button>
    </form>
    <div id="editSetError">
    </div>`;

    const editCardForm = document.getElementById("editCardForm");
    editCardForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const cardData = new FormData(editCardForm).entries();
        const bearer = `Bearer ${localStorage.getItem("token")}`
        let res = await fetch(`http://localhost:3000/api/folders/${folder_id}/cards/${card_id}/edit`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearer,
            },
            body: JSON.stringify(Object.fromEntries(cardData))
        });

        let data = await res.json();
        if(res.status === 200){
            editCards(folder_id, name);
        } else{
            document.getElementById("editSetError").innerHTML = data.error;
        }
    })
}

// gets cards for card editing
async function editCards(id, name) {
    main.innerHTML = 
        `<div class="mx-auto mt-4" style="width: 25rem;">
            <h3>${name}</h3>
            <a href="#">study</a>
        </div>`;

    let res = await fetch(`http://localhost:3000/api/folders/${id}/cards/`,{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curCard = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h5 class="card-title">${curCard["front"]}</h2>
                    <p class="card-text mb-2">${curCard["back"]}</p>
                    <p class="card-subtitle mb-2 text-muted">${curCard["timestamp"].substr(0, 10)}</p>
                    <a href="javascript:editCard('${curCard["_id"]}','${id}','${name}')" class="card-link">edit</a>
                    <a href="javascript:deleteCard('${curCard["_id"]}','${id}','${name}')" class="card-link">delete</a>
                    <div id="${curCard["_id"]}"></div>
                </div>
            </div>`
    }
    main.innerHTML += 
        `<div id="newCardBox" class="card mx-auto my-2" style="width: 25rem;">
            <div class="card-body">
                <a id="newCard" href="javascript:newCardFunc('${id}', '${name}')" class="card-link">create new card</a>
            </div>
        </div>`
}

// gets cards from logged in user
async function myCards() {
    main.innerHTML = 
        `<div class="mx-auto mt-4" style="width: 25rem;">
            <h3>${localStorage.getItem("username")}'s cards</h3>
        </div>`;

    let res = await fetch(`http://localhost:3000/api/users/${localStorage.getItem("id")}`,{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curFolder = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curFolder["title"]}</h2>
                    <p class="card-subtitle mb-2 text-muted">${curFolder["timestamp"].substr(0, 10)}</p>
                    <a href="javascript:study('${curFolder["_id"]}', '${curFolder["title"]}')" class="card-link">study</a>
                    <a href="javascript:editCards('${curFolder["_id"]}', '${curFolder["title"]}')" class="card-link">edit</a>
                    <a href="javascript:editFolder('${curFolder["_id"]}')" class="card-link">rename</a>
                    <a href="javascript:deleteSet('${curFolder["_id"]}')" class="card-link">delete</a>
                    <div id="${curFolder["_id"]}"></div>
                </div>
            </div>`
    }
    main.innerHTML += 
        `<div id="newFolderBox" class="card mx-auto my-2" style="width: 25rem;">
            <div class="card-body">
                <a id="newFolder" href="#" class="card-link">create new set</a>
            </div>
        </div>`
    const newFolder = document.getElementById("newFolder");
    newFolder.addEventListener("click", newFolderFunc);   
}

// deletes folder with specific id
async function deleteSet(id) {
    const bearer = `Bearer ${localStorage.getItem("token")}`;
    let res = await fetch(`http://localhost:3000/api/folders/${id}/delete`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": bearer,
        }
    })
    const data = await res.json();
    if (res.status === 200){
      myCards();
      return;
    }
}

// changes login and register btns
function hasToken() {
    loginBtn.innerHTML = "my cards";
    loginBtn.removeEventListener("click", login);
    loginBtn.addEventListener("click", myCards);

    registerBtn.innerHTML = "logout";
    registerBtn.removeEventListener("click", register);
    registerBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.reload();
    });
}

// checks if token exists on reloads
function init() {
    let token = checkToken()
    if (token){
      hasToken();
    }
}
init();

// gets cards from a specific user
async function userFunc(id, name) {
    main.innerHTML = 
        `<div class="mx-auto mt-4" style="width: 25rem;">
            <h3>${name}'s cards</h3>
        </div>`;

    let res = await fetch(`http://localhost:3000/api/users/${id}`,{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curFolder = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curFolder["title"]}</h2>
                    <p class="card-subtitle mb-2 text-muted">${curFolder["timestamp"].substr(0, 10)}</p>
                    <a href="#" class="card-link">study</a>
                </div>
            </div>`
    }
}

// gets all users
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
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curUser["username"]}</h2>
                    <a href="javascript:userFunc('${curUser["_id"]}', '${curUser["username"]}',)" class="card-link">visit</a>
                </div>
            </div>`
    }
}

// gets all folders
async function folders() {
    main.innerHTML = ""
    let res = await fetch("http://localhost:3000/api/folders/",{
        method: "GET",
        headers: {"Content-Type": "application/json" },
    });
    let data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let curFolder = data[i];
        main.innerHTML += 
            `<div class="card mx-auto my-2" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title">${curFolder["title"]}</h2>
                    <p class="card-subtitle mb-2 text-muted">${curFolder["timestamp"].substr(0, 10)}</p>
                    <a href="#" class="card-link">study</a>
                </div>
            </div>`
    }

}


// login form
function login() {
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
            '<button type="submit" class="btn btn-primary">Submit</button>' +
            '<div id="error" class="mt-2"></div>' +
        '</form>';

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", async function (e){
        e.preventDefault();
        const loginData = new FormData(registerForm).entries();
        let res = await fetch("http://localhost:3000/api/users/login",{
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


// register form
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

// saves token to localstorage
function saveTokenData(data){
    localStorage.setItem("token", data.token)
    localStorage.setItem("username", data.user.username )
    localStorage.setItem("id", data.user._id)
    hasToken();
    myCards();
}
