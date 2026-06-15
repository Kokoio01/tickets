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
import {settings} from "../db/index.js";

export default class SetupButton extends ButtonHandler {
    public name: string = "setup";

    async execute(interaction: ButtonInteraction): Promise<void> {
        checkGuild(interaction);
        if (!checkAdministrator(interaction)) return;
        const action = interaction.customId.split(":")[1]
        const settingsData = await settings.findOne({where: {guildId: interaction.guild?.id}});

        switch (action) {
            case "ticket": {
                await interaction.showModal(settingsTicketModal(
                    settingsData?.categoryId,
                    settingsData?.staffRoleId,
                    settingsData?.logChannelId,
                    settingsData?.maxTicketsPerUser
                ));
                return;
            }
            case "open": {
                await interaction.showModal(settingsOpenModal(
                    settingsData?.closingReasonRequired,
                    settingsData?.openingReasonRequired,
                    settingsData?.userCloseAllowed,
                    settingsData?.pingOnOpen
                ));
                return;
            }
            case "panel": {
                await interaction.showModal(settingsPanelModal(
                    settingsData?.panelTitle,
                    settingsData?.panelDescription,
                    settingsData?.panelImageUrl,
                    settingsData?.panelThumbnailUrl,
                ))
                return;
            }
            case "welcome": {
                await interaction.showModal(settingsWelcomeModal(
                    settingsData?.welcomeTitle,
                    settingsData?.welcomeDescription,
                    settingsData?.welcomeImageUrl,
                    settingsData?.welcomeThumbnailUrl,
                ));
                return;
            }
            default: {
                throw new AppError("UNKNOWN_BUTTON")
            }
        }
    }

}