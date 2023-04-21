const characterContainer = document.createElement("div");
characterContainer.id = "character-container";
document.getElementById("container-background").appendChild(characterContainer);


const fetchCharacterTemplate = async () => {
  const response = await fetch("template.html");
  const templateHTML = await response.text();
  return templateHTML;
};


const fetchStarWarsCharacters = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};


const createCharacterDiv = (character, templateHTML) => {
  const newCharacterDiv = document.createElement("div");
  newCharacterDiv.id = "character";
  newCharacterDiv.innerHTML = templateHTML;
  newCharacterDiv.querySelector("#character-name").textContent = character.name;
  newCharacterDiv.querySelector("#height").textContent = `Height: ${character.height}`;
  newCharacterDiv.querySelector("#mass").textContent = `Mass: ${character.mass}`;
  newCharacterDiv.querySelector("#gender").textContent = `Gender: ${character.gender}`;
  newCharacterDiv.querySelector("#skin-color").textContent = `Skin color: ${character.skin_color}`;
  newCharacterDiv.querySelector("#eye-color").textContent = `Eye color: ${character.eye_color}`;
  const characterImage = document.createElement("img");
  if (character.gender === "male") {
    characterImage.src = "./images/male.jpg";
  } else if (character.gender === "female") {
    characterImage.src = "./images/female.jpg";
  } else if (character.gender === "n/a" || character.gender === "none" || character.gender === "hermaphrodite") {
    characterImage.src = "./images/robot.jpg";
  }
  newCharacterDiv.appendChild(characterImage);
  return newCharacterDiv;
};


const showStarWarsCharacters = async (url) => {
  console.log("showStarWarsCharacters called with URL:", url);
  const characterTemplate = await fetchCharacterTemplate();
  const starWarsData = await fetchStarWarsCharacters(url);
  characterContainer.innerHTML = "";

  starWarsData.results.forEach(character => {
    const newCharacterDiv = createCharacterDiv(character, characterTemplate);
    characterContainer.appendChild(newCharacterDiv);
  });

  const previousButton = document.createElement("button");
  previousButton.id = "previous-button";
  previousButton.textContent = "Previous characters ←";
  previousButton.addEventListener("click", async () => {
    characterContainer.innerHTML = "";
    await showStarWarsCharacters(starWarsData.previous);
  });
  if (starWarsData.previous) {
    characterContainer.insertBefore(previousButton, characterContainer.firstChild);
  } else {
    previousButton.style.display = "none";
  }

  const nextButton = document.createElement("button");
  nextButton.id = "next-button";
  nextButton.textContent = "More characters →";
  nextButton.addEventListener("click", async () => {
    characterContainer.innerHTML = "";
    await showStarWarsCharacters(starWarsData.next);
  });
  if (starWarsData.next) {
    characterContainer.appendChild(nextButton);
  }
};


const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", async () => {
  const characterName = searchInput.value.toLowerCase();
  const searchUrl = `https://swapi.dev/api/people/?search=${characterName}`;
  await showStarWarsCharacters(searchUrl);
});

showCharacters("https://swapi.dev/api/people/").catch(error => {
  console.error("Error:", error);
})