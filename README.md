# Character Personality Oracle

**A tarot-inspired character personality generator, powered by OpenAI.**

This Foundry VTT module uses symbolic tarot draws interpreted by ChatGPT to generate evocative, immersive personality descriptions for newly created characters. Original created for the [Hyperborea 3rd Edition](https://hyperborea.tv) role-playing game, but is configurable for just about any game system that has character attributes like age, gender/sex, race/ancestry, and class/profession. All fields are optional, but they are used by ChatGPT to give more flavor and detail to the oracle.

---

## Features

- 🃏 Simulates a four-card tarot draw (with reversals).
- 🔮 Feeds character details and card symbols to OpenAI to generate a unique personality profile.
- ✍️ Optional tone/theme field to steer the character's flavor.
- 📜 Generated output can be saved to the character’s biography.
- ⚙️ Includes UI overlay and async feedback while querying the oracle.
- 🧩 Modular design, with configurable support for many systems.

---

## Requirements

- Foundry VTT v12 or v13.
- An [OpenAI](https://platform.openai.com/) API key (you must supply your own).
- Internet connection (for API calls).

---

## Installation

To install manually:

1. Download the latest release from:
   [https://github.com/thurianknight/character-oracle/releases/latest](https://github.com/thurianknight/character-oracle/releases/latest)
2. Extract into your Foundry `modules/` directory.
3. Or install via manifest URL:
https://github.com/thurianknight/character-oracle/releases/latest/download/module.json

---

## Usage

1. Open a character sheet (actor).
2. Click the **“Character Oracle”** button in the title bar of the sheet.
3. Verify or fill in basic details (age, gender, race/ancestry, character class, tone).
4. Optionally save the result to the character's biography field.
5. Click **Speak the Oracle**.

You’ll see a temporary overlay while the oracle is consulted. Within a few seconds, your character will receive a rich, personalized profile drawn from the mists of Hyperborea... or whatever world your character may dwell in.

---

## Configuration

In **Module Settings**, you can:

- Set your OpenAI API key.
- Choose which model to use (e.g., `gpt-3.5-turbo` or `gpt-4o-mini`).
- Update the data paths to character info fields, useful for most game systems.

---

## Development Status

- ✅ Core features complete and working in Hyperborea system (`hyp3e`).
- ✅ Additionally tested with Adventurer-Conqueror-King System (`acks`) and Worlds Without Number (`wwn`). Known-working system configurations can be found in [system-configurations.md](/system-configurations.md).
- 🚧 Localization planned.
- 💬 Accepting feedback and suggestions via GitHub issues.

---

## Credits

Created by **@thurianknight**  
Inspired by the eerie magic of [Hyperborea](https://hyperborea.tv) and the ancient symbols of the tarot.

---

## License

[MIT License](/LICENSE)
