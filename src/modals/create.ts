import {MessageFlags, type ModalSubmitInteraction} from "discord.js";
import {ModalHandler} from "../structures/modalhandler.js";
import {checkGuild} from "../utils/checks.js";
import {openTicket} from "../utils/tickets.js";
import {AppError} from "../structures/apperror.js";
import {successMessage} from "../messages/feedback.js";

export default class CreateModal extends ModalHandler {
    public name: string = "create";

    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        checkGuild(interaction);

        const reason = interaction.fields.getTextInputValue("reason")
        if (!reason || reason.length > 1024) throw new AppError("TICKET_OPEN_REASON_REQUIRED");

        const channel = await openTicket(interaction, undefined, reason);

        await interaction.followUp(successMessage("Your Ticket has been created", `Access it here: <#${channel.id}>`))
    }

}