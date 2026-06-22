import {type ButtonInteraction} from "discord.js";
import {ButtonHandler} from "../structures/buttonhandler.js";
import {checkGuild, checkStaff} from "../utils/checks.js";
import {settings, tickets} from "../db/index.js";
import {AppError} from "../structures/apperror.js";
import {claimMessage, unclaimMessage} from "../messages/claim.js";
import {claimTicket, unclaimTicket} from "../utils/tickets/claim.js";

export default class ClaimButton extends ButtonHandler {
    public name: string = "claim";

    async execute(interaction: ButtonInteraction): Promise<void> {
        checkGuild(interaction);

        const type = interaction.customId.split(":")[1];
        const guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});
        if (!guildSettings) throw new AppError("MISSING_CONFIG")

        const ticket = await tickets.findOne({where: {channelId: interaction.channelId}});
        if (!ticket) {
            throw new AppError("NO_TICKET_CHANNEL")
        }

        checkStaff(interaction, guildSettings.staffRoleId);

        const message = interaction.message;
        if (!message) throw new AppError("UNABLE_MESSAGE")


       switch (type) {
           case "add": {
               await claimTicket(interaction, ticket, message)

               await interaction.reply(claimMessage(interaction.user))
               return;
           }
           case "remove": {
               await unclaimTicket(interaction, ticket, message)

               await interaction.reply(unclaimMessage(interaction.user))
               return;
           }
           default: {
               throw new AppError("UNKNOWN_BUTTON")
           }
       }
    }

}