## Disney Take-Home Assignment
A minimal, performant tile-based UI built with Handlebars and TailwindCSS. This project demonstrates core frontend engineering principles, state management, and attention to usability. Optimized for Google Chrome.

## Overview

This project was built to showcase a simple layout for presenting media tiles. The UI emphasizes clean grid alignment, modular component structure, and fast load times. It’s focused on delivering a smooth MVP experience.

## Design Considerations

- **Smooth UI** – Grid layout and navigation tuned for a straightforward user experience. Further grid and tile alignment improvements would refine the experience.
- **No Video on Tiles** – Due to poor video art availability, videos aren't displayed in active tiles to preserve a consistent experience.
- **Styling** – Normally, I’d use styled components or CSS modules. Here, TailwindCSS was chosen for speed and simplicity.
- **Scalable Styleguide** – In a full production app, I’d create a master style guide with a semantic color palette and unified typography. This approach keeps styles modular, clean, and aligned with brand standards.

### Tech Stack
* [Handlebars](https://handlebarsjs.com/): templating engine, especially helpful with no frontend framework.
* [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction): lightweight "state" management for high performance, minimal setup.
* [Immer](https://immerjs.github.io/immer/): simplifies immutable state updates.
* [TailwindCSS](https://tailwindcss.com/): rapid styling and a clean codebase.
* [Splide](https://splidejs.com/): lightweight carousel for the top banner slider.
* [Axios](https://axios-http.com/docs/intro): easy data fetching.
* [Typescript](https://www.typescriptlang.org): type safety.
* [Lodash](https://lodash.com/docs/4.17.15): utility functions for cleaner code.
* [Node](https://nodejs.org/en) & [Vite](https://vite.dev/): dev environment and bundler for fast refresh and builds.

## Notes
* Tested on Google Chrome only.
* As a real production app, this would be built with a frontend framework and include test coverage.

## Installation
   ```bash
  git clone https://github.com/samrod/disney.git
  cd disney
  yarn
  yarn dev
  ```
**`yarn export` will fail as it uses my own deployment script, keys, and server.*
