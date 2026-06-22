import {type ModalSubmitInteraction} from "discord.js";
import {ModalHandler} from "../structures/modalhandler.js";
import {checkGuild, checkStaff} from "../utils/checks.js";
import {closeTicket} from "../utils/tickets.js";
import {AppError} from "../structures/apperror.js";
import {settings, tickets} from "../db/index.js";
import {closingSoonMessage} from "../messages/close.js";

export default class CloseModal extends ModalHandler {
    public name: string = "close";

    async execute(interaction: ModalSubmitInteraction): Promise<void> {
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

        const reason = interaction.fields.getTextInputValue("reason");
        if (!reason || reason.length > 1024) throw new AppError("TICKET_CLOSE_REASON_REQUIRED")

        await interaction.reply(closingSoonMessage(interaction.user, reason));
        await new Promise(resolve => setTimeout(resolve, 5000));

        await closeTicket(interaction, ticket, guildSettings, reason);
    }
}