import {GatewayEvent} from "../structures/gatewayevents.js";
import type {Interaction} from "discord.js";
import {logger} from "../utils/logger.js";
import {AppError} from "../structures/apperror.js";
import {errorMessage} from "../messages/feedback.js";

export default class InteractionCreate extends GatewayEvent {
    public name: string = "interactionCreate";

    async execute(interaction: Interaction): Promise<void> {
        try {
            if (!interaction.isAutocomplete()) {
                try {
                    if (interaction.isChatInputCommand()) {
                        const command = this.client.commands.get(interaction.commandName)
                        if (!command) throw new AppError("UNKNOWN_CMD")
                        await command.execute(interaction);
                    }

                    if (interaction.isButton()) {
                        const componentName = interaction.customId.split(":")[0] || "ERR_BUTTON_NOT_FOUND";
                        const button = this.client.buttons.get(componentName)
                        if (!button) throw new AppError("UNKNOWN_BUTTON")
                        await button.execute(interaction)
                    }

                    if (interaction.isModalSubmit()) {
                        const componentName = interaction.customId.split(":")[0] || "ERR_MODAL_NOT_FOUND";
                        const modal = this.client.modals.get(componentName)
                        if (!modal) throw new AppError("UNKNOWN_MODAL")
                        await modal.execute(interaction)
                    }
                } catch (error) {
                    if (!(error instanceof AppError)) logger.error(error);
                    const err = error instanceof AppError ? error : new AppError("UNEXPECTED");

                    const response = errorMessage(err);
                    (interaction.replied || interaction.deferred)
                        ? await interaction.followUp(response)
                        : await interaction.reply(response);
                }
            }
        } catch (err) {
            logger.error(err);
        }
    }
}