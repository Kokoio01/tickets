import type { ModalSubmitInteraction } from "discord.js"
import {checkAdministrator, checkGuild, isValidURL} from "../utils/checks.js";
import {AppError} from "../structures/apperror.js";
import {settings} from "../db/index.js";
import { ModalHandler } from "../structures/modalhandler.js";
import {successMessage} from "../messages/feedback.js";

export default class SetupButton extends ModalHandler {
    public name: string = "setup";

    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        checkGuild(interaction);
        if (!checkAdministrator(interaction)) return;
        const action = interaction.customId.split(":")[1];

        switch (action) {
            case "ticket": {
                const category = interaction.fields.getSelectedChannels("category")?.first();
                const staffRole = interaction.fields.getSelectedRoles("staffrole")?.first();
                const logChannel = interaction.fields.getSelectedChannels("logchannel")?.first();
                const ticketPerUser = interaction.fields.getTextInputValue("ticketsPerUser")

                await settings.upsert(
                    {
                        guildId: interaction.guild?.id,
                        categoryId: category?.id,
                        staffRoleId: staffRole?.id,
                        logChannelId: logChannel?.id,
                        maxTicketsPerUser: ticketPerUser,
                    }
                )

                await interaction.reply(successMessage("Successfully saved new settings", [
                    `**Category:** ${category?.name || "Undefined"}`,
                    `**Staff Role:** ${staffRole?.name || "Undefined"}`,
                    `**Log Channel:** ${logChannel?.name || "Undefined"}`,
                    `**Tickets Per User:** ${ticketPerUser|| "Undefined"}`,
                ].join("\n")))
                return;
            }
            case "open": {
                const reasonsRequired = interaction.fields.getCheckboxGroup("reasons");
                const openingReasonRequired = reasonsRequired.includes("open")
                const closingReasonRequired = reasonsRequired.includes("close")
                const userCloseAllowed = interaction.fields.getCheckboxGroup("userClose").length === 1;
                const pingOnOpen = interaction.fields.getCheckboxGroup("pingOnOpen").length === 1;

                await settings.upsert(
                    {
                        guildId: interaction.guild?.id,
                        openingReasonRequired,
                        closingReasonRequired,
                        userCloseAllowed,
                        pingOnOpen,
                    }
                )

                await interaction.reply(successMessage("Successfully saved new settings", [
                    `**Opening reason required:** ${openingReasonRequired ? "Yes" : "No"}`,
                    `**Closing reason required:** ${closingReasonRequired ? "Yes" : "No"}`,
                    `**Allow users to close:** ${userCloseAllowed ? "Yes" : "No"}`,
                    `**Ping on Open:** ${pingOnOpen ? "Yes" : "No"}`,
                ].join("\n")))
                return;
            }
            case "panel": {
                const title = interaction.fields.getTextInputValue("title");
                const description = interaction.fields.getTextInputValue("description");
                const imageUrl = interaction.fields.getTextInputValue("imageUrl");
                const thumbnailUrl = interaction.fields.getTextInputValue("thumbnailUrl");

                if (thumbnailUrl != "") {
                    if(!isValidURL(thumbnailUrl)) throw new AppError("INVALID_URL")
                }
                if (imageUrl != "") {
                    if(!isValidURL(imageUrl)) throw new AppError("INVALID_URL")
                }

                await settings.upsert(
                    {
                        guildId: interaction.guild?.id,
                        panelTitle: title,
                        panelDescription: description,
                        panelImageUrl: imageUrl,
                        panelThumbnailUrl: thumbnailUrl,
                    }
                )

                await interaction.reply(successMessage("Successfully saved new settings", [
                    `**Panel Title:** ${title}`,
                    `**Panel Description:** ${description}`,
                    `**Panel Image URL:** ${imageUrl}`,
                    `**Panel Thumbnail URL:** ${thumbnailUrl}`,
                ].join("\n")))
                return;
            }
            case "welcome": {
                const title = interaction.fields.getTextInputValue("title");
                const description = interaction.fields.getTextInputValue("description");
                const imageUrl = interaction.fields.getTextInputValue("imageUrl");
                const thumbnailUrl = interaction.fields.getTextInputValue("thumbnailUrl");

                if (thumbnailUrl != "") {
                    if(!isValidURL(thumbnailUrl)) throw new AppError("INVALID_URL")
                }
                if (imageUrl != "") {
                    if(!isValidURL(imageUrl)) throw new AppError("INVALID_URL")
                }

                await settings.upsert(
                    {
                        guildId: interaction.guild?.id,
                        welcomeTitle: title,
                        welcomeDescription: description,
                        welcomeImageUrl: imageUrl,
                        welcomeThumbnailUrl: thumbnailUrl,
                    },
                )

                await interaction.reply(successMessage("Successfully saved new settings", [
                    `**Welcome Title:** ${title}`,
                    `**Welcome Description:** ${description}`,
                    `**Welcome Image URL:** ${imageUrl}`,
                    `**Welcome Thumbnail URL:** ${thumbnailUrl}`,
                ].join("\n")))
                return;
            }
            default: {
                throw new AppError("UNKNOWN_MODAL")
            }
        }
    }

}