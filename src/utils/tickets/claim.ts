import {ActionRowBuilder, ButtonBuilder, ButtonStyle, type Interaction, type Message, TextChannel} from "discord.js";
import type {Tickets} from "../../db/model/tickets.js";
import {AppError} from "../../structures/apperror.js";
import {checkGuild} from "../checks.js";
import {logger} from "../logger.js";
import {claimTicketLogMessage, unclaimTicketLogMessage} from "../../messages/logging.js";
import {settings} from "../../db/index.js";
import type {Settings} from "../../db/model/settings.js";

export async function claimTicket(
    interaction: Interaction,
    ticket: Tickets,
    message?: Message,
    guildSettings?: Settings | null
) {
    if(!checkGuild(interaction)) throw new AppError("NO_GUILD")
    if (!guildSettings) {
        guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});
        if (!guildSettings) throw new AppError("MISSING_CONFIG")
    }
    if (!message) {
        message = interaction.channel?.messages.cache.get(ticket.messageId || "") || await interaction.channel?.messages.fetch(ticket.messageId || "");
    }
    if (!message) logger.error(`Unable to locate welcome message`);

    if (ticket.claimerId) throw new AppError("TICKET_ALREADY_CLAIMED")

    const logChannel = interaction.guild?.channels.cache.get(guildSettings?.logChannelId)
        || await interaction.guild?.channels.fetch(guildSettings.logChannelId);

    if (message) {
        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder()
                    .setCustomId("claim:remove")
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Unclaim"),
                new ButtonBuilder()
                    .setCustomId("close")
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Close"),
            ]
        })

        try {
            await message.edit({components: [row]});
        } catch (e) {
            logger.error(`Error while claiming ticket: ${e}`);
            throw new AppError("TICKET_WELCOME_ClAIM_UPDATE_FAILED")
        }
    }

    await ticket.update({
        claimerId: interaction.user.id,
    })

    if (logChannel instanceof TextChannel) {
        try {
            await logChannel.send(unclaimTicketLogMessage(ticket, interaction.user))
        } catch (error) {
            logger.error(`Log Channel Error: ${error}`)
        }
    }
}

export async function unclaimTicket(
    interaction: Interaction,
    ticket: Tickets,
    message?: Message,
    guildSettings?: Settings | null
) {
    if(!checkGuild(interaction)) throw new AppError("NO_GUILD")
    if (!guildSettings) {
        guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});
        if (!guildSettings) throw new AppError("MISSING_CONFIG")
    }
    if (!message) {
        message = interaction.channel?.messages.cache.get(ticket.messageId || "") || await interaction.channel?.messages.fetch(ticket.messageId || "");
    }
    if (!message) logger.error(`Unable to locate welcome message`);

    if (!ticket.claimerId) throw new AppError("TICKET_NOT_CLAIMED")

    const logChannel = interaction.guild?.channels.cache.get(guildSettings?.logChannelId)
        || await interaction.guild?.channels.fetch(guildSettings.logChannelId);

    if (message) {
        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder()
                    .setCustomId("claim:add")
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Claim"),
                new ButtonBuilder()
                    .setCustomId("close")
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Close"),
            ]
        })

        try {
            await message.edit({components: [row]});
        } catch (e) {
            logger.error(`Error while claiming ticket: ${e}`);
            throw new AppError("TICKET_WELCOME_ClAIM_UPDATE_FAILED")
        }
    }

    await ticket.update({
        claimerId: null,
    })

    if (logChannel instanceof TextChannel) {
        try {
            await logChannel.send(claimTicketLogMessage(ticket))
        } catch (error) {
            logger.error(`Log Channel Error: ${error}`)
        }
    }
}