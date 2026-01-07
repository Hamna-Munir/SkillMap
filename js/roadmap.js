const params = new URLSearchParams(window.location.search);
const careerKey = params.get("career");
const career = skillData[careerKey];

document.getElementById("career-title").innerText = career.title;
document.getElementById("career-desc").innerText = career.description;

const skillsList = document.getElementById("skills-list");

// Load completed skills from localStorage
let completedSkills = JSON.parse(localStorage.getItem(`completed_${careerKey}`)) || [];

// Create progress bar
const progressBar = document.createElement("div");
progressBar.id = "progress-bar-container";
progressBar.innerHTML = `
  <div id="progress-bar"></div>
  <p id="progress-text"></p>
`;
document.body.insertBefore(progressBar, skillsList);

function updateProgress() {
    const total = career.skills.length;
    const completed = completedSkills.length;
    const percent = Math.round((completed / total) * 100);
    document.getElementById("progress-bar").style.width = percent + "%";
    document.getElementById("progress-text").innerText = `${completed} / ${total} skills completed (${percent}%)`;
}

// Render skills
function displaySkills(filter="") {
    skillsList.innerHTML = "";
    career.skills
        .filter(skill => skill.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(skill => {
            const skillDiv = document.createElement("div");
            skillDiv.className = "skill-card";

            const resourcesHTML = skill.resources ? skill.resources.map(r => `<li><a href="${r.link}" target="_blank">${r.name}</a></li>`).join('') : '';

            skillDiv.innerHTML = `
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <ul>${resourcesHTML}</ul>
                <label><input type="checkbox" class="completed"> Completed</label>
            `;

            const checkbox = skillDiv.querySelector(".completed");
            if (completedSkills.includes(skill.name)) {
                checkbox.checked = true;
                skillDiv.style.backgroundColor = "#065f46"; // Dark green for completed
            }

            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    completedSkills.push(skill.name);
                    skillDiv.style.backgroundColor = "#065f46";
                } else {
                    completedSkills = completedSkills.filter(s => s !== skill.name);
                    skillDiv.style.backgroundColor = "#1e293b"; // Default card color
                }
                localStorage.setItem(`completed_${careerKey}`, JSON.stringify(completedSkills));
                updateProgress();
            });

            skillsList.appendChild(skillDiv);
        });
    updateProgress();
}

// Initial display
displaySkills();

// Search functionality
document.getElementById("search-skill").addEventListener("input", e => {
    displaySkills(e.target.value);
});
