# Speed Reader (proof of concept)

A minimal rapid serial visual presentation (RSVP) reader. It streams one word at a time in the same on‑screen position, reducing eye movements (saccades) so you can read faster with less effort. Paste text into the input box and press start. Typical silent reading averages roughly 250–300 words per minute (varies with content complexity). With RSVP and practice, many readers reach about 600–900 WPM at comprehension levels similar to their normal reading, depending on text difficulty and training.

To use it effectively, stare directly at the red pivot letter in the middle of each word and use your peripheral vision to read the rest of the word. You can attain faster speeds by not internally vocalizing the words. Try to just absorb the meaning.


## Local development
If you want to run it locally:

```
clone the repo
npm install
npm run dev
```


## How timing works
Word display duration is adjusted dynamically by logic in `focal.js`. A variety of factors influence timing, such as:
- Word length and complexity
- Punctuation and sentence boundaries

## Optimal viewing position (pivot letter)
The app chooses a “pivot” letter for each word and keeps that letter aligned to a fixed focus point on the screen. This follows the optimal viewing position (OVP) effect: recognition is fastest when fixation lands near the middle or slightly left of center. Deviations from that optimal position slow recognition; a commonly reported rule of thumb is roughly +20 ms of lexical decision or naming latency for each letter away from the OVP.

Reference: J. K. O’Regan and A. M. Jacobs, “Optimal Viewing Position Effect in Word Recognition: A Challenge to Current Theory.”

## How to use
- Paste any text into the input box.
- Start the stream; each word will appear in the same position.
- Pause or restart as needed.

## Status
This is a proof of concept. A production version would add many features and polish.

## Possible future features
- Keyboard shortcuts; pause/resume controls
- Import from files (txt/pdf/epub) and reading history
- Native application with the ability to highlight any text in any app and stream RSVP with a key command
- Accessibility options (dark-mode, font choices, etc.)
