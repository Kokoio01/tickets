import type { ButtonInteraction } from "discord.js";
import {ButtonHandler} from "../structures/buttonhandler.js";
import {checkAdministrator, checkGuild} from "../utils/checks.js";
import {
    settingsOpenModal,
    settingsPanelModal,
    settingsTicketModal,
    settingsWelcomeModal
} from "../messages/settings.js";
import {AppError} from "../structures/apperror.js";

export default class SetupButton extends ButtonHandler {
    public name: string = "setup";

    async execute(interaction: ButtonInteraction): Promise<void> {
        checkGuild(interaction);
        if (!checkAdministrator(interaction)) return;
        const action = interaction.customId.split(":")[1]

        switch (action) {
            case "ticket": {
                await interaction.showModal(settingsTicketModal());
                return;
            }
            case "open": {
                await interaction.showModal(settingsOpenModal());
                return;
            }
            case "panel": {
                await interaction.showModal(settingsPanelModal())
                return;
            }
            case "welcome": {
                await interaction.showModal(settingsWelcomeModal());
                return;
            }
            default: {
                throw new AppError("UNKNOWN_BUTTON")
            }
        }
    }

}