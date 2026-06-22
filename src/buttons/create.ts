import {type ButtonInteraction, MessageFlags} from "discord.js";
import {ButtonHandler} from "../structures/buttonhandler.js";
import {checkGuild} from "../utils/checks.js";
import {settings} from "../db/index.js";
import {openCloseDefaults} from "../utils/default.js";
import {openingReasonModal} from "../messages/create.js";
import {successMessage} from "../messages/feedback.js";
import {openTicket} from "../utils/tickets/open.js";

export default class CreateButton extends ButtonHandler {
    public name: string = "create";

    async execute(interaction: ButtonInteraction): Promise<void> {
        checkGuild(interaction);

        const guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});

        const requireOpeningReason = guildSettings?.openingReasonRequired || openCloseDefaults.openingReasonRequired;
        if (requireOpeningReason) {
            await interaction.showModal(openingReasonModal())
            return;
        }

        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const channel = await openTicket(interaction, guildSettings);

        await interaction.followUp(successMessage("Your Ticket has been created", `Access it here: <#${channel.id}>`))
    }

}