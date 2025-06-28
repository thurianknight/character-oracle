# Hyperborea Character Personality Oracle

**A tarot-inspired character personality generator for the Hyperborea TTRPG, powered by OpenAI.**

This Foundry VTT module uses symbolic tarot draws interpreted by GPT to generate evocative, immersive personality descriptions for newly created characters in the world of Hyperborea.

---

## Features

- 🃏 Simulates a four-card tarot draw (with reversals).
- 🔮 Feeds character details and card symbols to OpenAI to generate a unique personality profile.
- ✍️ Optional tone/theme field to steer the character's flavor.
- 📜 Generated output can be saved to the actor’s biography.
- ⚙️ Includes UI overlay and async feedback while querying the oracle.
- 🧩 Modular design, with future support planned for other systems beyond Hyperborea.

---

## Requirements

- Foundry VTT v12 or v13.
- An [OpenAI](https://platform.openai.com/) API key (you must supply your own).
- Internet connection (for API calls).

---

## Installation

To install manually:

1. Download the latest release from:
   [https://github.com/thurianknight/hyp3e-character-oracle/releases/latest](https://github.com/thurianknight/hyp3e-character-oracle/releases/latest)
2. Extract into your Foundry `modules/` directory.
3. Or install via manifest URL:
https://github.com/thurianknight/hyp3e-character-oracle/releases/latest/download/module.json

---

## Usage

1. Open a character sheet (actor).
2. Click the **“Character Oracle”** button.
3. Fill in basic details (age, sex, origin, class, tone).
4. Click **Generate Personality**.
5. Optionally save the result to the biography tab.

You’ll see a temporary overlay while the oracle is consulted. Within a few seconds, your character will receive a rich, personalized profile drawn from the mists of Hyperborea.

---

## Configuration

In **Module Settings**, you can:

- Set your OpenAI API key.
- Choose which model to use (e.g., `gpt-3.5-turbo` or `gpt-4`).
- Control whether output is automatically added to the actor biography.

---

## Development Status

- ✅ Core features complete and working in Hyperborea system (`hyp3e`).
- 🚧 Multi-system support and localization planned.
- 💬 Accepting feedback and suggestions via GitHub issues.

---

## Credits

Created by **@thurianknight**  
Inspired by the eerie magic of Hyperborea and the ancient symbols of the tarot.

---

## License

MIT License
