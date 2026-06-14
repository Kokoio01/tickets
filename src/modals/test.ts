import {MessageFlags, type ModalSubmitInteraction} from "discord.js";
import {ModalHandler} from "../structures/modalhandler.js";

export default class TestModal extends ModalHandler {
    public name: string = "test";

    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        await interaction.reply({content: "Modal", flags: MessageFlags.Ephemeral});
    }

}