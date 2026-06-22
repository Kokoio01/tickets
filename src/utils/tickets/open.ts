import {logger} from "../logger.js";
import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    CategoryChannel,
    ChannelType, EmbedBuilder,
    type GuildTextBasedChannel,
    type Interaction,
    PermissionsBitField,
    type Role, TextChannel
} from "discord.js";
import type {Settings} from "../../db/model/settings.js";
import {checkGuild, isValidURL} from "../checks.js";
import {AppError} from "../../structures/apperror.js";
import {settings, tickets} from "../../db/index.js";
import {nanoid} from "nanoid";
import {welcomeDefaults} from "../default.js";
import {createTicketLogMessage} from "../../messages/logging.js";

export async function openTicket(
    interaction: Interaction,
    guildSettings?: Settings | null,
    reason?: string,
) {
    if(!checkGuild(interaction)) throw new AppError("NO_GUILD")
    if (!guildSettings) {
        guildSettings = await settings.findOne({where: {guildId: interaction.guild?.id}});
        if (!guildSettings) throw new AppError("MISSING_CONFIG")
    }

    const username = interaction.user.username;
    const maxTicketsPerUser = guildSettings.maxTicketsPerUser;
    const ticketsByUser = await tickets.findAll({where: {openerId: interaction.user.id}});
    if (ticketsByUser.length >= maxTicketsPerUser && maxTicketsPerUser != 0) throw new AppError("TICKET_LIMIT_REACHED")

    const category = interaction.guild.channels.cache.get(guildSettings.categoryId)
        || await interaction.guild.channels.fetch(guildSettings.categoryId);
    const staffRole = interaction.guild.roles.cache.get(guildSettings.staffRoleId)
        || await interaction.guild.roles.fetch(guildSettings.staffRoleId);
    const logChannel = interaction.guild.channels.cache.get(guildSettings.logChannelId)
        || await interaction.guild.channels.fetch(guildSettings.logChannelId);

    const missing: string[] = [];
    if (!category || !(category instanceof CategoryChannel)) missing.push("Category Configuration");
    if (!staffRole) missing.push("Staff Role");

    if (missing.length > 0) {
        throw new AppError("MISSING_CONFIG", "Missing following Values: " + missing.join(", "));
    }

    const validCategory = category as CategoryChannel;
    const validStaffRole = staffRole as Role;

    if (validCategory.children.cache.size >= 50) throw new AppError("TICKET_CATEGORY_FULL")

    let ticketChannel: GuildTextBasedChannel
    try {
        ticketChannel = await validCategory.children.create({
            name: `ticket-${username}`,
            type: ChannelType.GuildText,
            reason: `${username} - Ticket Opening`,
            permissionOverwrites: [
                {id: interaction.guild.id, deny: PermissionsBitField.Flags.ViewChannel},
                {id: interaction.user.id, allow: PermissionsBitField.Flags.ViewChannel},
                {id: validStaffRole.id, allow: PermissionsBitField.Flags.ViewChannel},
            ]
        })
    } catch (error) {
        logger.error(`Ticket Channel Error: ${error}`);
        throw new AppError("TICKET_CHANNEL_FAILED");
    }

    const ticket = await tickets.create({
        guildId: interaction.guild.id,
        ticketId: nanoid(8),
        channelId: ticketChannel.id,
        openerId: interaction.user.id,
        reason: reason,
    })

    let message;
    try {
        const imageUrl = isValidURL(guildSettings.welcomeImageUrl)
            ? guildSettings.welcomeImageUrl
            : undefined;
        const thumbnailUrl = isValidURL(guildSettings.welcomeThumbnailUrl)
            ? guildSettings.welcomeThumbnailUrl
            : undefined;

        const embed = new EmbedBuilder()
            .setTitle(guildSettings.welcomeTitle || welcomeDefaults.title)
            .setDescription(guildSettings.welcomeDescription || welcomeDefaults.description)
            .setImage(imageUrl || welcomeDefaults.imageUrl)
            .setThumbnail(thumbnailUrl || welcomeDefaults.thumbnailUrl)

        const embed2 = new EmbedBuilder()
            .setTitle("Reason for ticket")
            .setDescription(reason || " ")

        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder()
                    .setCustomId("claim:add")
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Claim"),
                new ButtonBuilder()
                    .setCustomId("close")
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Close"),
            ]
        })

        message = await ticketChannel.send({
            ...(guildSettings.pingOnOpen && {
                content: `<@${interaction.user.id}> <@&${validStaffRole.id}>`,
            }),
            embeds: [
                embed,
                ...(reason ? [embed2] : [])
            ],
            components: [row]
        });
    } catch (error) {
        logger.error(`Welcome Message Failed: ${error}`)
        throw new AppError("TICKET_WELCOME_FAILED");
    }

    await ticket.update({messageId: message.id})

    if (logChannel instanceof TextChannel) {
        try {
            await logChannel.send(createTicketLogMessage(ticket))
        } catch (error) {
            logger.error(`Log Channel Error: ${error}`)
        }
    }

    return ticketChannel;
}