Hooks.once("init", () => {
    game.settings.register("character-oracle", "openaiKey", {
        name: "OpenAI API Key",
        hint: "Enter your personal OpenAI API key",
        scope: "world",
        config: true,
        type: String,
        isSecret: true,
        default: "sk-..."
    });
    game.settings.register("character-oracle", "openaiModel", {
        name: "OpenAI Model",
        hint: "Model to use with the OpenAI API (e.g., gpt-3.5-turbo, gpt-4o-mini, gpt-4.1-nano)",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "gpt-3.5-turbo": "gpt-3.5-turbo (Fast, Low Cost)",
            "gpt-4o-mini": "gpt-4o-mini (Faster GPT-4, Recommended)",
            "gpt-4.1-nano": "gpt-4.1 (Fastest, most cost-effective GPT-4.1 model)"
        },
        default: "gpt-3.5-turbo"
    });

    game.settings.register("character-oracle", "path.age", {
        name: "Character Age Path",
        hint: "Data path to the character's age (e.g., system.details.age)",
        scope: "world",
        config: true,
        type: String,
        default: "system.details.age"
    });
    game.settings.register("character-oracle", "path.gender", {
        name: "Character Gender Path",
        hint: "Data path to the character's sex/gender (e.g., system.details.gender)",
        scope: "world",
        config: true,
        type: String,
        default: "system.details.gender"
    });
    game.settings.register("character-oracle", "path.origin", {
        name: "Character Race/Ancestry Path",
        hint: "Data path to the character's racial origin or ancestry (e.g., system.details.race)",
        scope: "world",
        config: true,
        type: String,
        default: "system.details.race"
    });
    game.settings.register("character-oracle", "path.charClass", {
        name: "Character Class Path",
        hint: "Data path to the character's class or profession (e.g., system.details.class)",
        scope: "world",
        config: true,
        type: String,
        default: "system.details.class"
    });
    game.settings.register("character-oracle", "path.biography", {
        name: "Character Biography Path",
        hint: "Data path to the character's biography or personality (e.g., system.biography)",
        scope: "world",
        config: true,
        type: String,
        default: "system.biography"
    });
});

Hooks.once("ready", () => {
    game.hyp3eCharacterOracle = {
        showForm: (actor = null) => new TarotForm(actor).render(true)
    };

    // Optional: add to UI
    game.settings.registerMenu("character-oracle", "openForm", {
        name: "Character Oracle",
        label: "Test the Oracle",
        icon: "fas fa-id-card",
        type: TarotForm,
        restricted: false
    });

});

Hooks.on("renderActorSheet", (sheet, html, data) => {
    // Only for type "character"
    if (sheet.actor?.type !== "character") return;

    // Avoid adding the button multiple times
    const existing = html.closest('.app').find('.character-oracle');
    if (existing.length) return;

    // Create the button
    const button = $(`<a class="character-oracle"><i class="fas fa-id-card-alt"></i> 
        <span title="Generate tarot-based personality for this character">Character Oracle</span>
        </a>`);
    button.css({ margin: "5px 0", display: "inline-block" });

    // Handle button click
    button.on("click", () => {
        game.hyp3eCharacterOracle?.showForm(sheet.actor);
    });

    // Insert into sheet header
    const titleElement = html.closest('.app').find('.window-title');
    if (titleElement.length) {
        titleElement.after(button);
    }
});

const TAROT_DECK = [
    // Major Arcana (22 cards)
    { name: "The Fool", arcana: "Major" },
    { name: "The Magician", arcana: "Major" },
    { name: "The High Priestess", arcana: "Major" },
    { name: "The Empress", arcana: "Major" },
    { name: "The Emperor", arcana: "Major" },
    { name: "The Hierophant", arcana: "Major" },
    { name: "The Lovers", arcana: "Major" },
    { name: "The Chariot", arcana: "Major" },
    { name: "Strength", arcana: "Major" },
    { name: "The Hermit", arcana: "Major" },
    { name: "Wheel of Fortune", arcana: "Major" },
    { name: "Justice", arcana: "Major" },
    { name: "The Hanged Man", arcana: "Major" },
    { name: "Death", arcana: "Major" },
    { name: "Temperance", arcana: "Major" },
    { name: "The Devil", arcana: "Major" },
    { name: "The Tower", arcana: "Major" },
    { name: "The Star", arcana: "Major" },
    { name: "The Moon", arcana: "Major" },
    { name: "The Sun", arcana: "Major" },
    { name: "Judgement", arcana: "Major" },
    { name: "The World", arcana: "Major" },

    // Minor Arcana – Wands
    { name: "Ace of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Two of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Three of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Four of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Five of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Six of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Seven of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Eight of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Nine of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Ten of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Page of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Knight of Wands", arcana: "Minor", suit: "Wands" },
    { name: "Queen of Wands", arcana: "Minor", suit: "Wands" },
    { name: "King of Wands", arcana: "Minor", suit: "Wands" },

    // Minor Arcana – Cups
    { name: "Ace of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Two of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Three of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Four of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Five of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Six of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Seven of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Eight of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Nine of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Ten of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Page of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Knight of Cups", arcana: "Minor", suit: "Cups" },
    { name: "Queen of Cups", arcana: "Minor", suit: "Cups" },
    { name: "King of Cups", arcana: "Minor", suit: "Cups" },

    // Minor Arcana – Swords
    { name: "Ace of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Two of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Three of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Four of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Five of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Six of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Seven of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Eight of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Nine of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Ten of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Page of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Knight of Swords", arcana: "Minor", suit: "Swords" },
    { name: "Queen of Swords", arcana: "Minor", suit: "Swords" },
    { name: "King of Swords", arcana: "Minor", suit: "Swords" },

    // Minor Arcana – Pentacles
    { name: "Ace of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Two of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Three of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Four of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Five of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Six of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Seven of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Eight of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Nine of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Ten of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Page of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Knight of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "Queen of Pentacles", arcana: "Minor", suit: "Pentacles" },
    { name: "King of Pentacles", arcana: "Minor", suit: "Pentacles" }
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawTarotCards(count = 4) {
    // const shuffled = foundry.utils.shuffle([...TAROT_DECK]);
    const shuffled = shuffle([...TAROT_DECK]);
    return shuffled.slice(0, count).map(card => ({
        ...card,
        reversed: Math.random() < 0.5
    }));
}

function formatDrawnCards(cards) {
    return cards.map((c, i) => `${i + 1}. ${c.name}${c.reversed ? " (reversed)" : ""}`).join("\n");
}

class TarotForm extends FormApplication {
    constructor(actor) {
        super();
        this.actor = actor;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "tarot-form",
            title: "Character Oracle",
            template: "modules/character-oracle/templates/tarot-form.html",
            width: 400
        });
    }

    getValueAtPath(obj, path) {
        return path?.split('.').reduce((o, key) => o?.[key], obj);
    }

    async getData() {
        const data = await super.getData();
        const actor = this.actor;

        const path = (name) => game.settings.get("character-oracle", `path.${name}`);

        if (actor) {
            data.name = actor.name;
            data.age = this.getValueAtPath(actor, path("age")) ?? "";
            data.gender = this.getValueAtPath(actor, path("gender")) ?? "";
            data.origin = this.getValueAtPath(actor, path("origin")) ?? "";
            data.charClass = this.getValueAtPath(actor, path("charClass")) ?? "";
            data.biography = this.getValueAtPath(actor, path("biography")) ?? "";
            data.tone = "";
        }
        data.saveToBio = false;
        return data;
    }

    async _updateObject(event, formData) {
        // Ask the user to be patient
        const overlay = this.element.find(".oracle-wait-overlay");
        overlay.show();

        try {
            // OpenAI API call
            const openaiKey = game.settings.get("character-oracle", "openaiKey");
            const model = game.settings.get("character-oracle", "openaiModel");

            // Format the prompt
            const prompt = this.buildPrompt(formData);

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8
                })
            });

            const json = await response.json();
            if (!response.ok) {
                console.error("OpenAI API error:", json);
                ui.notifications.error(`OpenAI API Error: ${json.error?.message}`);
                return;
            }
            const result = json.choices?.[0]?.message?.content || "Error getting response.";
            const formatted = `<h3>Thus Saith the Oracle...</h3><p>${result.replace(/\n/g, "<br/>")}</p>`;

            new Dialog({
                title: "Character Oracle Result",
                content: `<div style="white-space: normal;">${formatted}</div>`,
                buttons: { ok: { label: "OK" } }
            }).render(true);

            // Save to actor biography if requested
            if (formData.saveToBio && this.actor) {
                const biographyPath = game.settings.get("character-oracle", "path.biography");
                const current = foundry.utils.getProperty(this.actor, biographyPath) ?? "";
                const separator = `<hr><p><em>Generated on ${new Date().toLocaleDateString()}</em></p>`;
                const newBio = `${current}${separator}${formatted}`;
                const updateData = {};
                foundry.utils.setProperty(updateData, biographyPath, newBio);
                await this.actor.update(updateData);
                ui.notifications.info("Tarot result added to biography.");
            }
        } catch (err) {
            ui.notifications.error("Error querying the Oracle.");
            console.error(err);
        } finally {
            overlay.hide();
        }
    }

    buildPrompt(data) {
        // Draw the cards
        const cards = drawTarotCards();
        const cardText = formatDrawnCards(cards);

        return `
You are an impersonal character oracle that interprets four tarot cards to generate a personality summary for a tabletop RPG character.

Respond in a concise and atmospheric tone, suitable for sword-and-sorcery fantasy.
Do not include greetings, introductions, or explanations.
Do not explain what you are doing.

Format the output as a short, evocative personality profile in prose. Limit it to 3–4 short paragraphs. Avoid excessive flourish.

The character is:
- Name: ${data.name}
- Gender: ${data.gender}
- Age: ${data.age}
- Culture/Origin: ${data.origin}
- Class: ${data.charClass}
- Tone: ${data.tone}

Tarot Draw:
${cardText}

Each card should describe: Core Self, Emotional Self, Shadow Self, and Path Forward. Generate the personality profile now.`;
    }
}
