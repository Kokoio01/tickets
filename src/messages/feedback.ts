import {EmbedBuilder, type InteractionReplyOptions, MessageFlags} from "discord.js";
import type {AppError} from "../structures/apperror.js";

export function errorMessage(err: AppError): InteractionReplyOptions {
    const embed = new EmbedBuilder()
        .setTitle(err.title)
        .setDescription(err.message)
        .setColor(0xF47174)

    return {
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    }
}

export function successMessage(
    title: string,
    description: string,
): InteractionReplyOptions {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(0x70f4b0)

    return {
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    }
}