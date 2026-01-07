// Get career key from URL
const params = new URLSearchParams(window.location.search);
let careerKey = params.get("career");

// Default career if none provided
if (!careerKey || !skillData[careerKey]) careerKey = "web-developer";

const career = skillData[careerKey];

// Update header
document.getElementById("career-title").innerText = career.title;
document.getElementById("career-desc").innerText = career.description;

const skillsList = document.getElementById("skills-list");

// Load completed skills from localStorage
let completedSkills = JSON.parse(localStorage.getItem(`completed_${careerKey}`)) || [];

// Add progress bar at the top
const progressContainer = document.createElement("div");
progressContainer.id = "progress-bar-container";
progressContainer.innerHTML = `
  <div id="progress-bar"></div>
  <p id="progress-text"></p>
`;
document.body.insertBefore(progressContainer, skillsList);

// Update progress
function updateProgress() {
  const total = career.skills.length;
  const completed = completedSkills.length;
  const percent = Math.round((completed / total) * 100);
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").innerText = `${completed} / ${total} skills completed (${percent}%)`;
}

// Render skills dynamically
function displaySkills(filter="") {
  skillsList.innerHTML = "";

  career.skills
    .filter(skill => skill.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(skill => {
      const skillDiv = document.createElement("div");
      skillDiv.className = "skill-card";

      // Build resources list
      const resourcesHTML = skill.resources ? skill.resources.map(r => `<li><a href="${r.link}" target="_blank">${r.name}</a></li>`).join('') : '';

      skillDiv.innerHTML = `
        <h3>${skill.name}</h3>
        <p>${skill.description}</p>
        <ul>${resourcesHTML}</ul>
        <label><input type="checkbox" class="completed"> Completed</label>
      `;

      // Checkbox logic
      const checkbox = skillDiv.querySelector(".completed");
      if (completedSkills.includes(skill.name)) {
        checkbox.checked = true;
        skillDiv.style.backgroundColor = "#065f46"; // completed green
      }

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          completedSkills.push(skill.name);
          skillDiv.style.backgroundColor = "#065f46";
        } else {
          completedSkills = completedSkills.filter(s => s !== skill.name);
          skillDiv.style.backgroundColor = "#1e293b"; // default card color
        }
        localStorage.setItem(`completed_${careerKey}`, JSON.stringify(completedSkills));
        updateProgress();
      });

      skillsList.appendChild(skillDiv);
    });

  updateProgress();
}

// Initial render
displaySkills();

// Search input
document.getElementById("search-skill").addEventListener("input", e => {
  displaySkills(e.target.value);
});
