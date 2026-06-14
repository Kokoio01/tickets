import {GatewayEvent} from "../structures/gatewayevents.js";
import type {Interaction} from "discord.js";
import {logger} from "../utils/logger.js";

export default class InteractionCreate extends GatewayEvent {
    public name: string = "interactionCreate";

    async execute(interaction: Interaction): Promise<void> {
        try {
            if (interaction.isChatInputCommand()) {
                const command = this.client.commands.get(interaction.commandName)
                if (command) {
                    await command.execute(interaction)
                }
            }

            if (interaction.isButton()) {
                const componentName = interaction.customId.split(":")[0] || "ERR_BUTTON_NOT_FOUND";
                const button = this.client.buttons.get(componentName)
                if (button) {
                    await button.execute(interaction)
                }
            }

            if (interaction.isModalSubmit()) {
                const componentName = interaction.customId.split(":")[0] || "ERR_MODAL_NOT_FOUND";
                const modal = this.client.modals.get(componentName)
                if (modal) {
                    await modal.execute(interaction)
                }
            }
        } catch (err) {
            logger.error(err);
        }
    }
}