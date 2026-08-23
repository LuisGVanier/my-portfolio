# Personal Portfolio

Responsive single-page portfolio built for the Front-End Programming mini-project at Vanier College.

**Live site:** https://LuisGVanier.github.io/portfolio/

## Built with

- HTML5
- CSS3 (custom styling kept minimal — colour variables and a few overrides)
- Bootstrap 5.3
- JavaScript (ES6)

## Structure

```
index.html          single page: navbar, hero, about, skills, projects,
                    experience, education, contact, footer
css/style.css       colour palette and small overrides
js/data.js          renders the Projects section from JSON
data/portfolio.json project data
img/                images
```

## Running it

The Projects section loads `data/portfolio.json` with `fetch()`, which browsers
block on the `file://` protocol. Open the site through a local server:

- VS Code: right-click `index.html` → **Open with Live Server**
- or visit the live GitHub Pages link above

Every other section is plain HTML and renders without a server.

## Notes on the build

Sections required by the assignment are written as static HTML so they render
under any conditions. The Projects section — which the assignment does not
require — is generated from JSON to add a filter dropdown, dynamic cards and
detail modals without duplicating markup for each project.