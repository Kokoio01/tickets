import {EmbedBuilder, type MessageCreateOptions} from "discord.js";

export function welcomeMessage(): MessageCreateOptions {
    const embed = new EmbedBuilder()
        .setTitle("Thank you!")
        .setDescription([
            "Thank you for inviting this Bot!",
            "",
            "Command Overview:",
            "- **/setup** - Opens configuration menu",
            "- **/panel send** - Send ticket panel",
            "",
            "- **/ticket close [reason]** - Close ticket",
            "- **/ticket claim** - Claim Ticket",
            "- **/ticket unclaim** - Unclaim Ticket"
        ].join("\n"))

    return {
        embeds: [embed],
    }
}