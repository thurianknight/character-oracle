/**
 * Universal actor sheet render hook for both ApplicationV1 and ApplicationV2.
 *
 * @param {Function} callback - Function that receives (app, html)
 *                              when an actor sheet finishes rendering.
 */
function onAnyActorSheetRendered(callback) {
    // For legacy (Application V1)
    Hooks.on("renderActorSheet", (app, html) => {
        callback(app, html);
    });

    // For new (Application V2)
    Hooks.on("renderActorSheetV2", (app, html) => {
        callback(app, html);
    });
}

Hooks.once("init", () => {
    console.log("[Character Oracle] Initializing module...");

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
    game.settings.register("character-oracle", "showWelcomeMessage", {
        name: "Show Welcome Message on World Load",
        hint: "Show a quick-start guide in the chat log each time the world loads.",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
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

Hooks.once("ready", async () => {
    console.log("[Character Oracle] Ready and waiting for actor sheets...");

    game.hyp3eCharacterOracle = {
        showOracleForm: (actor = null) => new TarotForm(actor).render(true)
    };

    // NEW (works for both V1 and V2)
    onAnyActorSheetRendered(async (app, html) => {
        if (app.actor?.type !== "character") return;
        await insertOracleButton(app, html);
    });

    // Testing these hooks...
    Hooks.on('renderDocumentSheetV2', (app, element) => console.log("[Character Oracle] Hook 'renderDocumentSheetV2' fired.", app, element));
    Hooks.on('getActorSheetHeaderButtons', (sheet, buttons) => console.log("[Character Oracle] Hook 'getActorSheetHeaderButtons' fired.", sheet, buttons)); // v12 and prior

    // Add to Foundry config UI
    game.settings.registerMenu("character-oracle", "openForm", {
        name: "Character Oracle",
        label: "Test the Oracle",
        icon: "fas fa-id-card",
        type: TarotForm,
        restricted: false
    });

    // Show welcome message in chat, if enabled
    const shouldShow = game.settings.get("character-oracle", "showWelcomeMessage");
    if (!shouldShow) return;

    let gm_content = ""
    let all_content = "<h2>🃏 Character Personality Oracle</h2>";

    if (game.user.isGM) {
        gm_content = `
            <p><strong>Configuration:</strong><br>
            In <em>Module Settings</em>, you can:
            <ul>
            <li>Set your OpenAI API key.</li>
            <li>Choose which model to use (e.g., <code>gpt-3.5-turbo</code>, <code>gpt-4o-mini</code>).</li>
            <li>Update the data paths to character info fields.</li>
            <li>Refer to <a href='https://github.com/thurianknight/character-oracle/blob/main/system-configurations.md'>system-configurations.md</a> for known system mappings.</li>
            </ul></p>`
    }
    all_content += gm_content + `
        <p><strong>Usage:</strong><br>
        <ul>
        <li>Open a character sheet (Actor).</li>
        <li>Click the <strong>“Character Oracle”</strong> button in the title bar.</li>
        <li>Verify or fill in basic details (age, gender, ancestry, class, tone).</li>
        <li>Click <strong>Speak the Oracle</strong>.</li>
        </ul>
        <p>The result is a personalized, flavorful character profile drawn from the mists of Hyperborea... or whatever world your character may dwell in.</p>
    `;

    ChatMessage.create({
        user: game.user.id,
        whisper: [game.user.id],
        content: all_content
    });
});

async function insertOracleButton(app, html) {
    console.log("[Character Oracle] Actor sheet rendering...", app, html)
    // Only for type "character"
    if (app.actor?.type !== "character") return;

    // Avoid adding a button multiple times
    const titleBar = html.closest('.app') || html.closest('.application')
    if (!titleBar) return;
    const existing = $(titleBar).find('.character-oracle');
    if (existing.length) return;

    // Add the oracle button to the title bar
    await this.addOracleButton(app, html);
}

function addOracleButton(app, html) {
    console.log("[Character Oracle] Adding Character Oracle button to character sheet");

    let button;

    if (app instanceof foundry.applications.api.ApplicationV2) {
        // Configure the button for AppV2
        button = document.createElement('button');
        button.type = "button";
        button.classList.add('header-control', 'fas', 'fa-id-card-alt', 'character-oracle', 'icon');
        button.dataset.tooltip = "Generate tarot-based personality";
        // Handle the button click event
        button.dataset.action = "showOracleForm";
        console.log("[Character Oracle] App V2 button:", button);
        app.options.actions.showOracleForm ??= function (_event, _el) {
            game.hyp3eCharacterOracle?.showOracleForm(app.actor);
        };
    } else {
        // Configure the button for AppV1
        button = document.createElement('a');
        // button.classList.add('header-button', 'control', 'character-oracle', 'icon');
        button.classList.add('control', 'character-oracle', 'icon');
        button.dataset.tooltip = "Generate tarot-based personality";
        // Add a Font-Awesome icon to the button
        const i = document.createElement('i');
        i.classList.add('fas', 'fa-id-card-alt');
        i.inert = true;
        button.append(i);
        // Handle the button click event
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            game.hyp3eCharacterOracle?.showOracleForm(app.actor);
        });
    }

    // Insert into sheet header
    const titleBar = html.closest('.app') || html.closest('.application');
    if (!titleBar) return;
    const titleElement = $(titleBar).find('.window-title');
    if (titleElement.length) {
        titleElement.after(button);
    }
}

/**
 * Data for a full 74-card Tarot deck
 */
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
        return foundry.utils.mergeObject(super.defaultOptions, {
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
                console.error("[Character Oracle] OpenAI API error:", json);
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

            // Mark the Oracle as used
            await this.actor?.setFlag("character-oracle", "oracleUsed", true);

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
            console.error("[Character Oracle]", err);
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
