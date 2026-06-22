import {LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export function openingReasonModal() {
    return new ModalBuilder()
        .setCustomId("create")
        .setTitle("Create a Ticket")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Reason")
                .setDescription("Please state the reason for this ticket.")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("reason")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(1024)
                        .setRequired(true)
                )
        )
}