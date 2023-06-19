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
});
// Fetch Andy's Toys
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  
  fetchToys()
    .then(toys => {
      toys.forEach(toy => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    })
    .catch(error => {
      console.log("Error fetching toys:", error);
    });
});

function fetchToys() {
  return fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .catch(error => {
      throw new Error("Failed to fetch toys:", error);
    });
}

function createToyCard(toy) {
  const card = document.createElement("div");
  card.className = "card";

  const toyName = document.createElement("h2");
  toyName.textContent = toy.name;

  const toyImage = document.createElement("img");
  toyImage.src = toy.image;
  toyImage.className = "toy-avatar";

  const toyLikes = document.createElement("p");
  toyLikes.textContent = `${toy.likes} Likes`;

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.id = toy.id;
  likeButton.textContent = "Like ❤️";

  likeButton.addEventListener("click", () => {
    increaseLikes(toy.id)
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        toyLikes.textContent = `${toy.likes} Likes`;
      })
      .catch(error => {
        console.log("Error increasing toy likes:", error);
      });
  });

  card.appendChild(toyName);
  card.appendChild(toyImage);
  card.appendChild(toyLikes);
  card.appendChild(likeButton);

  return card;
}

function increaseLikes(toyId) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  return fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({
      likes: 1
    })
  })
    .then(response => response.json())
    .catch(error => {
      throw new Error("Failed to increase toy likes:", error);
    });
}

// Add a New Toy
const toyForm = document.querySelector(".add-toy-form");

toyForm.addEventListener("submit", event => {
  event.preventDefault();

  const nameInput = document.querySelector('input[name="name"]');
  const imageInput = document.querySelector('input[name="image"]');

  const newToy = {
    name: nameInput.value,
    image: imageInput.value,
    likes: 0
  };

  createToy(newToy)
    .then(createdToy => {
      const toyCard = createToyCard(createdToy);
      const toyCollection = document.getElementById("toy-collection");
      toyCollection.appendChild(toyCard);

      nameInput.value = "";
      imageInput.value = "";
    })
    .catch(error => {
      console.log("Error creating toy:", error);
    });
});

function createToy(toy) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  return fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(toy)
  })
    .then(response => response.json())
    .catch(error => {
      throw new Error("Failed to create toy:", error);
    });
}
