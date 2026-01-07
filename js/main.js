const container = document.getElementById("career-cards");

for (let key in skillData) {
  const career = skillData[key];
  const card = document.createElement("div");
  card.className = "career-card";
  card.innerHTML = `
    <h2>${career.title}</h2>
    <p>${career.description}</p>
    <a href="roadmap.html?career=${key}" class="btn">Explore Skills</a>
  `;
  container.appendChild(card);
}
