import {ActionRowBuilder, ButtonBuilder, ButtonStyle, type Interaction, type Message} from "discord.js";
import type {Tickets} from "../../db/model/tickets.js";
import {AppError} from "../../structures/apperror.js";
import {checkGuild} from "../checks.js";
import {logger} from "../logger.js";

export async function claimTicket(
    interaction: Interaction,
    ticket: Tickets,
    message?: Message
) {
    checkGuild(interaction);
    if (!message) {
        message = interaction.channel?.messages.cache.get(ticket.messageId || "") || await interaction.channel?.messages.fetch(ticket.messageId || "");
    }
    if (!message) logger.error(`Unable to locate welcome message`);

    if (ticket.claimerId) throw new AppError("TICKET_ALREADY_CLAIMED")

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
}

export async function unclaimTicket(
    interaction: Interaction,
    ticket: Tickets,
    message?: Message
) {
    checkGuild(interaction);
    if (!message) {
        message = interaction.channel?.messages.cache.get(ticket.messageId || "") || await interaction.channel?.messages.fetch(ticket.messageId || "");
    }
    if (!message) logger.error(`Unable to locate welcome message`);

    if (!ticket.claimerId) throw new AppError("TICKET_NOT_CLAIMED")

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
}