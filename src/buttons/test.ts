import {
    type ButtonInteraction,
    LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ButtonHandler} from "../structures/buttonhandler.js";

export default class TestButton extends ButtonHandler {
    public name = 'test';

    async execute(interaction: ButtonInteraction): Promise<void> {
        const action = interaction.customId.split(":")[1]
        if (action === "modal") {
            const modal = new ModalBuilder().setTitle("test").setCustomId("test").addLabelComponents(new LabelBuilder().setLabel("TEST").setTextInputComponent(new TextInputBuilder().setCustomId("test").setStyle(TextInputStyle.Short)))
            await interaction.showModal(modal)
        } else {
            await interaction.reply({content: 'TEST', flags: MessageFlags.Ephemeral});
        }
    }
}