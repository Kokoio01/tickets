import {EmbedBuilder, type MessageCreateOptions} from "discord.js";

export function welcomeMessage(): MessageCreateOptions {
    const embed = new EmbedBuilder()
        .setTitle("Thank you!")
        .setDescription([
            "Thank you for inviting this Bot!"
        ].join("\n"))

    return {
        embeds: [embed],
    }
}