## Disney Take-Home Assignment
A minimal, performant tile-based UI built with vanilla Javascript. This project demonstrates core frontend engineering principles, state management, and attention to usability. Optimized for Google Chrome.

## Overview
This project was built to showcase a simple layout for presenting media tiles. The UI emphasizes clean grid alignment, modular component structure, and fast load times. It’s focused on delivering a smooth MVP experience.

## Design Considerations
- **Smooth UI** – Grid layout and navigation tuned for a straightforward user experience. Further grid and tile alignment improvements would refine the experience.
- **No Video on Tiles** – Due to poor video art availability, I opted to preserve a consistent tile-nav experience and display video art in the modal rather active tiles.
- **Tile Navigation** - Like the Disney+ app, vertical navigation preserves visible (rather than absolute) tile index for a natural feel.
- **Scalable Styleguide** – In a full production app, I’d create a master style guide with a semantic color palette and unified typography. This approach keeps styles modular, clean, and aligned with brand standards.
- **Data Issues** - In dev mode, data issues are logged to console and can be reported to Sentry or other monitoring services in prod. 

### Tech Stack
* [Node](https://nodejs.org/en) & [Vite](https://vite.dev/): dev environment and bundler for fast refresh and builds.

## Notes
* Tested on Google Chrome only.
* As a real production app, this would be built with a frontend framework and include test coverage and GitHub CI/CD workflows.

## Installation
   ```bash
  git clone https://github.com/samrod/disney.git
  cd disney
  yarn
  yarn dev
  ```
**`yarn export` will fail as it uses my own deployment script, keys, and server.*
