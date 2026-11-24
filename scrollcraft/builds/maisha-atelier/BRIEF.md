# BRIEF: Atelier

Self-authored under explicit creative delegation.

The user said: "the current design is shit and it doesnt represent a proper portfolio website that is clean and beautiful. please redesign the whole thing from scratch."

Facts about the person and the work come from `src/content/`. Nothing is invented.

## 1. Vibe

Authored: a gallery hang in daylight. Calm, warm, precise. References: an architecture monograph with plates on uncoated stock; a museum wall label; a drawing pinned square on limewash.

## 2. Sequence

1. Her name, one line, and one print of the thesis.
2. The eight projects, hung at different sizes.
3. One sentence about what ties them together.
4. What she is doing now.
5. The address, set large.

## 3. Energy

Quiet at the name. The loudest moment is the print opening to the full frame. The index is a steady walk. The statement slows down. The close is still.

## 4. Feeling curve

1. Recognition. A name and a real building, side by side.
2. Arrival (the peak). The print widens until the visitor is standing on the terraces above Kaptai Lake.
3. Range. Eight projects, each a different size, each opening like a print being unwrapped.
4. Understanding. One sentence fills in word by word under the scroll.
5. Trust. Three facts about current work, in ruled columns.
6. Invitation. The email address, large and still.

## The peak

"It's the site where her drawing opens up and you're suddenly standing in the place."

## Tell-someone sentence

It's the site where a framed print turns into the place it shows.

## Authored silence

The hero copy and the print hold still until the reader scrolls. The close does not animate away.

## 5. Signature seed

The hung print opens into the place: a clip-path window widens from the right-hand print to the full viewport while the image settles from a slight zoom and the name lifts away.

## 6. Distance from premium-minimal

Editorial, restrained. The three earlier builds leaned on concept chrome (title blocks, playheads, plotter rolls) and were rejected for not reading as a clean portfolio. This one lets the work and the type carry it.

## 7. World or scenes

Distinct scenes. Home, project, record.

## 8. Assets

Her own renders and drawings only. Four crops cut by `scripts/make-crops.mjs` to remove baked-in titles. No generated imagery.

## Grammar

Gallery index. Why the others lost: filmic one-shot and continuous world need one geography, and these are eight places. Chaptered editorial and split desk were rejected builds. Typographic poster hides the drawings. Live surface has no tool to run. Rhythmic cutlist fights the long hold the peak needs.

## Score, home

| Beat | Device | Why |
|---|---|---|
| Recognition | flow, rise on load | Name and print at rest. |
| Arrival | pin + clip reveal | The peak. Longest hold, 1.3 viewports. |
| Range | reveal per picture + drift | Each print unwraps; images drift against the scroll. |
| Understanding | scrub word fill | Reading speed set by the reader's hand. |
| Trust | rise | A record should not perform. |
| Invitation | flow | The close holds. |

Project pages: rise, sticky chapter text beside the plates, reveal per plate, next project as a hung print. About: rise only.

## Engine

GSAP ScrollTrigger (already a dependency) drives the motion instead of the vendored scrollcraft engine, which re-initialised poorly across React route changes. Native scroll. Reduced motion shows every element at rest.
