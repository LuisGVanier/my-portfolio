const DATA_URL = "data/portfolio.json";
const PLACEHOLDER_IMAGE = "img/placeholder.svg";

let allProjects = [];

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    allProjects = data.projects;
  } catch (error) {
    showLoadError(error.message);
    return;
  }

  populateFilter(allProjects);
  renderProjects(allProjects);

  document.getElementById("techFilter").addEventListener("change", handleFilterChange);
}

function populateFilter(projects) {
  const select = document.getElementById("techFilter");
  const tags = [...new Set(projects.flatMap((project) => project.tags))].sort();

  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    select.appendChild(option);
  });
}

function handleFilterChange(event) {
  const selected = event.target.value;
  const matches =
    selected === "all" ? allProjects : allProjects.filter((project) => project.tags.includes(selected));

  renderProjects(matches);
}

function renderProjects(projects) {
  const grid = document.getElementById("projectGrid");
  const modalContainer = document.getElementById("projectModals");
  const noResults = document.getElementById("noResults");

  grid.innerHTML = projects.map(buildCard).join("");
  modalContainer.innerHTML = projects.map(buildModal).join("");
  noResults.classList.toggle("d-none", projects.length > 0);
}

function buildCard(project) {
  const thumbnail = project.thumbnail || PLACEHOLDER_IMAGE;
  const badges = project.tags
    .map((tag) => `<span class="badge bg-secondary me-1">${escapeHtml(tag)}</span>`)
    .join("");
  const githubButton = project.github
    ? `<a href="${escapeHtml(project.github)}" class="btn btn-outline-secondary btn-sm" target="_blank" rel="noopener">GitHub</a>`
    : "";

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${escapeHtml(thumbnail)}" class="card-img-top" alt="Screenshot of ${escapeHtml(project.title)}">
        <div class="card-body d-flex flex-column">
          <h3 class="h5 card-title">${escapeHtml(project.title)}</h3>
          <p class="card-text">${escapeHtml(project.summary)}</p>
          <div class="mb-3">${badges}</div>
          <div class="mt-auto d-flex gap-2">
            <button type="button" class="btn btn-brand btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${project.id}">View details</button>
            ${githubButton}
          </div>
        </div>
      </div>
    </div>`;
}

function buildModal(project) {
  const githubButton = project.github
    ? `<a href="${escapeHtml(project.github)}" class="btn btn-brand" target="_blank" rel="noopener">View on GitHub</a>`
    : "";

  return `
    <div class="modal fade" id="modal-${project.id}" tabindex="-1" aria-labelledby="modal-${project.id}-label" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-${project.id}-label">${escapeHtml(project.title)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${buildMedia(project)}
            <p>${escapeHtml(project.description)}</p>
            <ul>
              <li><strong>Technologies:</strong> ${escapeHtml(project.technologies.join(", "))}</li>
              <li><strong>Role:</strong> ${escapeHtml(project.role)}</li>
            </ul>
          </div>
          <div class="modal-footer">
            ${githubButton}
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
}

// A single image renders on its own; two or more get carousel controls.
function buildMedia(project) {
  const images = project.images && project.images.length > 0 ? project.images : [PLACEHOLDER_IMAGE];

  if (images.length === 1) {
    return `<img src="${escapeHtml(images[0])}" class="d-block w-100 rounded mb-3" alt="${escapeHtml(project.title)} screenshot">`;
  }

  const carouselId = `carousel-${project.id}`;
  const slides = images
    .map(
      (src, index) => `
              <div class="carousel-item${index === 0 ? " active" : ""}">
                <img src="${escapeHtml(src)}" class="d-block w-100 rounded" alt="${escapeHtml(project.title)} screenshot ${index + 1}">
              </div>`
    )
    .join("");

  return `
            <div id="${carouselId}" class="carousel slide mb-3" data-bs-ride="false">
              <div class="carousel-inner">${slides}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>`;
}

function showLoadError(message) {
  document.getElementById("projectGrid").innerHTML = `
    <div class="col-12">
      <div class="alert alert-warning" role="alert">
        Projects could not be loaded (${escapeHtml(message)}). Make sure the page is running through Live Server.
      </div>
    </div>`;
}

// Prevents characters like & and < in the JSON from breaking the generated markup.
function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}
