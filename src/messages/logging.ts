import type {Tickets} from "../db/model/tickets.js";
import {EmbedBuilder, type User} from "discord.js";

export function createTicketLogMessage(ticket: Tickets) {
    const embed = new EmbedBuilder()
        .setTitle("New Ticket")
        .setDescription([
            `**ID:** ${ticket.ticketId}`,
            `**Opener:** <@${ticket.openerId}>`,
            `**Reason:** ${ticket.reason || "No reason available"}`,
            `**Channel:** <#${ticket.channelId}>`,
        ].join("\n"))
        .setColor(0x70f4b0)
        .setTimestamp(new Date());

    return {
        embeds: [embed],
    }
}

export function closeTicketLogMessage(ticket: Tickets) {
    const embed = new EmbedBuilder()
        .setTitle("Ticket closed")
        .setDescription([
            `**ID:** ${ticket.ticketId}`,
            `**Closed by:** <@${ticket.closerId}>`,
            `**Close Reason:** ${ticket.closeReason || "No reason available"}`,
        ].join("\n"))
        .setColor(0xF47174)
        .setTimestamp(new Date());

    return {
        embeds: [embed],
    }
}

export function claimTicketLogMessage(ticket: Tickets) {
    const embed = new EmbedBuilder()
        .setTitle("Ticket claimed")
        .setDescription([
            `**ID:** ${ticket.ticketId}`,
            `**Claimed by:** <@${ticket.claimerId}>`,
        ].join("\n"))
        .setColor(0xFF8C00)
        .setTimestamp(new Date());

    return {
        embeds: [embed],
    }
}

export function unclaimTicketLogMessage(ticket: Tickets, user: User) {
    const embed = new EmbedBuilder()
        .setTitle("Ticket claimed")
        .setDescription([
            `**ID:** ${ticket.ticketId}`,
            `**Unclaimed by:** <@${user.id}>`,
        ].join("\n"))
        .setColor(0xFF8C00)
        .setTimestamp(new Date());

    return {
        embeds: [embed],
    }
}