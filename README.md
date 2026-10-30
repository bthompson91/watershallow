# Kings of Watershallow

Original browser-based coastal-city worker placement. Play https://bthompson91.github.io/watershallow/ or serve this repository with `python3 -m http.server 8000`.

## Rules

Eight rounds, one human and 1–4 AI rivals. Gather gold, guards, scouts, healers and mages; complete commissions, play Orders and construct buildings. Harbour workers reassign later. Round five grants an extra worker. Final VP includes remaining adventurers, half remaining gold rounded down and secret-agenda bonuses.

Worker challenges cost a placement worker. Spend 0–3 attack points; defence automatically spends up to 3. Each side rolls d6, defence adds +1 and wins ties. Both sides pay their points regardless of outcome. Maximum attack points start at 1, grow/refill each round to cap 10 and do not accumulate beyond that maximum. Guards are not committed or killed. Winner takes the location's resource reward from the loser, or 2 gold at special locations. Each unpaid resource unit costs the loser 1 VP, including missing gold; scores can go negative. Shortfalls do not award the winner VP. No extra location activation; one challenge per space per round; Harbour cannot be challenged.

The creature/HP/mana system is removed. Existing saved battle results retain their original outcomes.

## Interface

Unique red, green, blue, black and white player colours match sidebar rows and occupied worker buttons. Dice colour only their ASCII characters. AI-only battles continue automatically after the animation. The mobile resource header stays sticky. The map and constructed district share a measured fit-to-space canvas with no district scrollbar. Sea marks are sparse and blue; roads use rough SVG texture. Small-screen fitting may shrink labels and touch targets.

Antraxja Goth headings, JuliaMetal ordinary text, Harting ASCII art; dice use Courier New for alignment. Name pools: 60 rivals, 40 commissions, 30 Orders and 30 buildings. Decks remain 60/50/18 cards; names repeat after their pool is exhausted. Existing voyages retain their stored names. These are name variants, not new effects.

## Saves and files

Browser save key: `watershallow-v2`. Clearing site data deletes the voyage. Creature fields migrate away without resetting worker progress; current-round attack pools initialise on update.

Active files: `index.html`, `atlas.css`, `watershallow.js`, `emoji-atlas.js`, `combat.js`, `presentation-polish.js`, `expansion.js` (save migration, animation, road and mobile effects only), `player-colours.js`, `map-fit.js`, `name-pools.js` and the three active font folders. Legacy game/style files, superseded font folders and obsolete installers are removed by maintenance.

## Checks and publication

Run `node tests/combat.cjs` for combat checks. Repository validation checks JavaScript syntax and local assets. Syntax/unit checks are not browser tests or deployment verification. A committed change is not proof of the revision currently served by GitHub Pages.

Game code: MIT (`LICENSE`). Font assets retain their upstream terms and notices.

Constructed buildings are placed directly within the main map, without a separate South Quay section. The map bounds expand and the entire map scales to fit as buildings are added. Recruitment Orders show the current round reward explicitly; reward mechanics are unchanged.
