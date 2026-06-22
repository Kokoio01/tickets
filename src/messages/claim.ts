import {EmbedBuilder, type User} from "discord.js";

export function claimMessage(claimer: User) {
    const embed = new EmbedBuilder()
        .setTitle(`Ticket claimed`)
        .setDescription(`This ticket was claimed by <@${claimer.id}>`)

    return {
        embeds: [embed],
    }
}

export function unclaimMessage(user: User) {
    const embed = new EmbedBuilder()
        .setTitle(`Ticket unclaimed`)
        .setDescription(`This ticket has been unclaimed by <@${user.id}>`)

    return {
        embeds: [embed],
    }
}