import {EmbedBuilder, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, type User} from "discord.js";

export function closingReasonModal() {
    return new ModalBuilder()
        .setCustomId("close")
        .setTitle("Closing Reason")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Reason")
                .setDescription("Please state the reason for the closing.")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("reason")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(1024)
                        .setRequired(true)
                )
        )
}

export function closingSoonMessage(user: User, reason?: string | null) {
    const embed = new EmbedBuilder()
        .setTitle("Closing ticket")
        .setDescription(reason ? `Closing Ticket in 5 seconds\n\n **Reason:** ${reason}`
        : "Closing Ticket in 5 seconds")
        .setAuthor({name: user.username})

    return {
        embeds: [embed],
    }
}