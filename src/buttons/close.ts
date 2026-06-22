import {type ButtonInteraction, MessageFlags} from "discord.js";
import {ButtonHandler} from "../structures/buttonhandler.js";
import {checkGuild, checkStaff} from "../utils/checks.js";
import {settings, tickets} from "../db/index.js";
import {openCloseDefaults} from "../utils/default.js";
import {closingReasonModal, closingSoonMessage} from "../messages/close.js";
import {AppError} from "../structures/apperror.js";
import {closeTicket} from "../utils/tickets/close.js";

export default class CloseButton extends ButtonHandler {
    public name: string = "close";

    async execute(interaction: ButtonInteraction): Promise<void> {
        checkGuild(interaction);

        const guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});
        if (!guildSettings) throw new AppError("MISSING_CONFIG")

        const ticket = await tickets.findOne({where: {channelId: interaction.channelId}});
        if (!ticket) {
            throw new AppError("NO_TICKET_CHANNEL")
        }

        if (!guildSettings.userCloseAllowed) {
            checkStaff(interaction, guildSettings.staffRoleId)
        } else {
            if (interaction.user.id != ticket.openerId) {
                checkStaff(interaction, guildSettings.staffRoleId)
            }
        }

        const requireClosingReason = guildSettings?.closingReasonRequired || openCloseDefaults.closingReasonRequired;
        if (requireClosingReason) {
            await interaction.showModal(closingReasonModal())
            return;
        }

        await interaction.reply(closingSoonMessage(interaction.user))
        await new Promise(resolve => setTimeout(resolve, 5000));

        await closeTicket(interaction, ticket, guildSettings);
    }
}