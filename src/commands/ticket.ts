import {
    type ChatInputCommandInteraction,
    SlashCommandBuilder, SlashCommandSubcommandBuilder,
} from "discord.js";
import {SlashCommand} from "../structures/slashcommand.js";
import {AppError} from "../structures/apperror.js";
import {settings, tickets} from "../db/index.js";
import {checkGuild, checkStaff} from "../utils/checks.js";
import {openCloseDefaults} from "../utils/default.js";
import {closingSoonMessage} from "../messages/close.js";
import {closeTicket} from "../utils/tickets/close.js";
import {claimTicket, unclaimTicket} from "../utils/tickets/claim.js";
import {claimMessage, unclaimMessage} from "../messages/claim.js";

export default class TicketCommand extends SlashCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ticket")
                .setDescription("Commands to manage your tickets.")
                .addSubcommand(
                    new SlashCommandSubcommandBuilder()
                        .setName("close")
                        .setDescription("Close your ticket.")
                        .addStringOption(
                            reason => reason
                                .setName("reason")
                                .setDescription("Your reason for closing this ticket.")
                                .setRequired(false),
                        )
                )
                .addSubcommand(
                    new SlashCommandSubcommandBuilder()
                        .setName("claim")
                        .setDescription("Claims the ticket.")
                )
                .addSubcommand(
                    new SlashCommandSubcommandBuilder()
                        .setName("unclaim")
                        .setDescription("Unclaims the ticket.")
                )
        );
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        checkGuild(interaction);

        const guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});
        if (!guildSettings) throw new AppError("MISSING_CONFIG")

        const ticket = await tickets.findOne({where: {channelId: interaction.channelId}});
        if (!ticket) {
            throw new AppError("NO_TICKET_CHANNEL")
        }

        switch(subcommand) {
            case "close": {
                await interaction.deferReply()

                if (!guildSettings.userCloseAllowed) {
                    checkStaff(interaction, guildSettings.staffRoleId)
                } else {
                    if (interaction.user.id != ticket.openerId) {
                        checkStaff(interaction, guildSettings.staffRoleId)
                    }
                }

                const requireClosingReason = guildSettings?.closingReasonRequired || openCloseDefaults.closingReasonRequired;
                const reason = interaction.options.getString("reason");
                if (requireClosingReason && !reason) {
                    throw new AppError("TICKET_CLOSE_REASON_REQUIRED")
                }

                await interaction.followUp(closingSoonMessage(interaction.user, reason))
                await new Promise(resolve => setTimeout(resolve, 5000));

                await closeTicket(interaction, ticket, guildSettings, reason);
                return;
            }
            case "claim": {
                checkStaff(interaction, guildSettings.staffRoleId);

                await claimTicket(interaction, ticket)

                await interaction.reply(claimMessage(interaction.user))
                return;
            }
            case "unclaim": {
                checkStaff(interaction, guildSettings.staffRoleId);

                await unclaimTicket(interaction, ticket)

                await interaction.reply(unclaimMessage(interaction.user))
                return;
            }
            default: {
                throw new AppError("UNKNOWN_CMD");
            }
        }
    }
}