import {AppError} from "../../structures/apperror.js";
import {type Interaction, TextChannel} from "discord.js";
import type {Tickets} from "../../db/model/tickets.js";
import type {Settings} from "../../db/model/settings.js";
import {checkGuild} from "../checks.js";
import {settings} from "../../db/index.js";
import {logger} from "../logger.js";
import {closeTicketLogMessage} from "../../messages/logging.js";

export async function closeTicket(
    interaction: Interaction,
    ticket: Tickets,
    guildSettings?: Settings | null,
    reason?: string | null
): Promise<void> {
    if(!checkGuild(interaction)) throw new AppError("NO_GUILD")
    if (!guildSettings) {
        guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});
        if (!guildSettings) throw new AppError("MISSING_CONFIG")
    }

    const ticketChannel = interaction.guild.channels.cache.get(ticket.channelId)
        || await interaction.guild.channels.fetch(ticket.channelId);
    const logChannel = interaction.guild.channels.cache.get(guildSettings.logChannelId)
        || await interaction.guild.channels.fetch(guildSettings.logChannelId);
    const username = interaction.user.username;

    if (!(ticketChannel instanceof TextChannel)) {
        throw new AppError("TICKET_DELETION_FAILED")
    }

    try {
        await ticketChannel.delete(
            `${username} - ${ticketChannel.id} - Ticket deleted - ${reason || "No reason available"}`,
        )
    } catch (error) {
        logger.error(`Ticket Channel Error: ${error}`)
        throw new AppError("TICKET_DELETION_FAILED");
    }

    await ticket.update({
        closed: true,
        closeReason: reason,
        closerId: interaction.user.id,
    });

    if (logChannel instanceof TextChannel) {
        try {
            await logChannel.send(closeTicketLogMessage(ticket))
        } catch (error) {
            logger.error(`Log Channel Error: ${error}`)
        }
    }
}