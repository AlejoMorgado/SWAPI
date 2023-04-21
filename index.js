const container = document.createElement("div");
container.id = "container";
document.getElementById("containerBackground").appendChild(container);

const fetchTemplate = async () => {
  const response = await fetch("template.html");
  const templateHTML = await response.text();
  return templateHTML;
};

const fetchCharacters = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const createCharacterDiv = (character, templateHTML) => {
  const newDiv = document.createElement("div");
  newDiv.id = "character";
  newDiv.innerHTML = templateHTML;
  newDiv.querySelector("#characterName").textContent = character.name;
  newDiv.querySelector("#height").textContent = `Height: ${character.height}`;
  newDiv.querySelector("#mass").textContent = `Mass: ${character.mass}`;
  newDiv.querySelector("#gender").textContent = `Gender: ${character.gender}`;
  newDiv.querySelector("#skinColor").textContent = `Skin color: ${character.skin_color}`;
  newDiv.querySelector("#eyeColor").textContent = `Eye color: ${character.eye_color}`;
  const img = document.createElement("img");
  if (character.gender === "male") {
    img.src = "./images/male.jpg";
  } else if (character.gender === "female") {
    img.src = "./images/female.jpg";
  } else if (character.gender === "n/a" || character.gender === "none" || character.gender === "hermaphrodite") {
    img.src = "./images/robot.jpg";
  }
  newDiv.appendChild(img);
  return newDiv;
};

const newContainer = document.getElementById("container");

const showCharacters = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  const filteredResults = data.results.filter((character) => {
    return character.name.toLowerCase().startsWith(searchInput.value.toLowerCase());
  });
  newContainer.innerHTML = "";
  const template = await fetchTemplate();
  filteredResults.forEach(character => {
    const newDiv = createCharacterDiv(character, template);
    newContainer.appendChild(newDiv);
  });
  const nextPage = filteredResults.next;
  const previousButton = document.createElement("button");
  previousButton.id = "previous";
  previousButton.textContent = "Previous characters ←";
  previousButton.addEventListener("click", async () => {
    newContainer.innerHTML = "";
    await showCharacters(data.previous);
  });
  if (data.previous) {
    newContainer.insertBefore(previousButton, newContainer.firstChild);
  } else {
    previousButton.style.display = "none";
  }
  const nextButton = document.createElement("button");
  nextButton.id = "next";
  nextButton.textContent = "More characters →";
  nextButton.addEventListener("click", async () => {
    newContainer.innerHTML = "";
    await showCharacters(data.next);
  });
  if (data.next) {
    newContainer.appendChild(nextButton);
  }
};

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", async () => {
  const searchUrl = `https://swapi.dev/api/people/?search=`;
  const results = await showCharacters(`${searchUrl}${searchInput.value.toLowerCase()}`);
  console.log(results);
});

showCharacters("https://swapi.dev/api/people/")
.catch(error => {
  console.error("Error:", error);
});
