let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(json => {
    for (const toyData of json) {
      createCard(toyData)
    }
  })

  document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    createNewToy();
  });
});

function createCard(toyData) {
  const newDiv = document.createElement('div')
  newDiv.className = "card"
  newDiv.innerHTML = `
  <h2>${toyData.name}</h2>
  <img src="${toyData.image}" class="toy-avatar" />
  <p>${toyData.likes} likes</p>`

  const btn = document.createElement("button")
  btn.className = "like-btn"
  btn.id = toyData.id
  btn.innerText = "Like <3"
      
  btn.addEventListener("click", () => {
    fetch(`http://localhost:3000/toys/${btn.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": toyData.likes + 1
      })
    })
    .then(resp => resp.json())
    .then(json => {
      document.getElementById(json.id).previousSibling.innerText = `${json.likes} likes`
    })
  })

  document.getElementById("toy-collection").appendChild(newDiv)
  newDiv.appendChild(btn)
};

function createNewToy() {
  const textFields = document.getElementsByClassName("input-text")
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": textFields[0].value,
      "image": textFields[1].value,
      "likes": 0
    })
  })
  .then(resp => resp.json())
  .then(data => createCard(data))
  textFields[0].value = ""
  textFields[1].value = ""
};
