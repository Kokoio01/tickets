import {type ButtonInteraction, MessageFlags} from "discord.js";
import {ButtonHandler} from "../structures/buttonhandler.js";

export default class TestButton extends ButtonHandler {
    public name = 'test';

    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.reply({content: 'TEST', flags: MessageFlags.Ephemeral});
    }
}