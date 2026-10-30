# Kings of Watershallow

An original browser-based worker-placement game set in a coastal city. Compete against 1–4 AI rivals across eight rounds, place workers, collect resources, construct buildings, complete commissions and play Orders.

Play: https://bthompson91.github.io/watershallow/

## Run locally

Serve the repository with `python3 -m http.server 8000`, then open http://localhost:8000. The game has no runtime framework or package installation step. Font assets are stored in the repository.

## Current rules

- Resources are gold, guards, scouts, healers and mages.
- Workers resolve location actions; eligible commissions can then be completed before ending the turn.
- Harbour workers receive a later reassignment. Everyone gains an agent in round five.
- Buildings provide visit rewards and owner bonuses. Their market VP increases each round.
- Occupied non-Harbour spaces can be challenged during normal placement. Spend a worker and commit 0–3 guards. Both players roll d6; defence adds up to 3 guards and +1. Ties defend. Each side fielding guards loses one guard. The winner takes capped resources from the loser, with no additional normal location activation. Each space can be challenged once per round.
- Worker combat shows animated ASCII dice. AI-vs-AI results continue automatically; fights involving the human wait for Continue after the animation.
- Final scoring adds adventurers, half of remaining gold rounded down, and secret-agenda bonuses to earned VP.
- The experimental creature, HP and mana system has been removed.

## Presentation and content

- Unique persistent player colours appear on occupied worker buttons, sidebar entries and ASCII dice characters, not entire map tiles.
- The map and constructed district share a fit-to-space canvas. The district wraps rather than having its own scrollbar.
- Sea ASCII waves are sparser and blue. Roads use a roughened SVG treatment.
- The resource header is sticky on smaller screens.
- Fonts: Antraxja Goth 1938 headings, JuliaMetal ordinary text and Harting ASCII art; combat dice explicitly use a fixed-width Courier New fallback for alignment.
- Name pools include 60 rivals, 40 commissions, 30 Orders and 30 buildings. New voyages use these pools. Existing saves retain their names. Deck sizes remain 60 commissions, 50 Orders and 18 buildings; names can repeat once their pool is exhausted. These are name variants, not 100 new card effects.

## Saves

Voyages are stored locally in the current browser under `watershallow-v2`. Clearing site data removes them. Creature-era fields are removed when those saves load; worker progress is retained. New names require a new voyage.

## Active application files

- `index.html`: entry page, font declarations and interface wrappers.
- `atlas.css`: base styling and responsive layout.
- `watershallow.js`: core rules, state, rendering and AI.
- `emoji-atlas.js`: city scenery and map presentation.
- `combat.js`: worker-space challenges and ASCII dice results.
- `presentation-polish.js`: larger headings and mixed-case display text.
- `expansion.js`: retained dice animation, rough roads, sticky header and creature-save migration. Despite its historical filename, it no longer implements creature battles.
- `player-colours.js`: colour identities, occupied worker buttons, sidebar accents, dice characters and AI-only automatic continuation.
- `map-fit.js`: fit-to-space map and constructed district.
- `name-pools.js`: new-voyage rival and card names.
- `fonts/`: font assets and available source notices.

`game.js` and `style.css` are retained legacy files and are not loaded by the current entry page. Historical font assets and installer workflows are also retained; rerunning old installers can overwrite newer presentation choices.

## Validation and deployment

The repository validation workflow checks all JavaScript files, inline entry-page scripts and referenced local scripts, stylesheets and font files. Passing these checks is not browser testing or proof that GitHub Pages has deployed the revision.

Historical installers commit generated changes back to main. A successful installer commit is not itself proof of a successful Pages deployment. No claim about the currently live commit is made here.

## Licence

Game code is released under the MIT licence in `LICENSE`. Bundled fonts retain their own upstream terms; the game licence does not relicense font assets.
