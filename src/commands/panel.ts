import {
    ButtonBuilder,
    type ChatInputCommandInteraction,
    SlashCommandBuilder, SlashCommandSubcommandBuilder, TextChannel, EmbedBuilder,
    ActionRowBuilder, ButtonStyle,
} from "discord.js";
import {SlashCommand} from "../structures/slashcommand.js";
import {AppError} from "../structures/apperror.js";
import {settings} from "../db/index.js";
import {checkAdministrator, checkGuild, isValidURL} from "../utils/checks.js";
import {panelDefaults} from "../utils/default.js";
import {successMessage} from "../messages/feedback.js";

export default class PanelCommand extends SlashCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("panel")
                .setDescription("The panel where users can create tickets.")
                .addSubcommand(
                    new SlashCommandSubcommandBuilder()
                        .setName("send")
                        .setDescription("Send your ticket panel!")
                        .addChannelOption(
                            channel => channel
                                .setName("channel")
                                .setDescription("The channel where you want the panel to be sent.")
                                .setRequired(false)
                        )
                )
        );
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        checkGuild(interaction);
        if (!checkAdministrator(interaction)) return;

        let channel = interaction.options.getChannel("channel");
        if (!channel) {
            if (!(interaction.channel instanceof TextChannel)) throw new AppError("NO_TEXTCHANNEL");
            channel = interaction.channel;
        }

        if (!(channel instanceof TextChannel)) throw new AppError("NO_TEXTCHANNEL");

        const settingsData = await settings.findOne({where: {guildId: interaction.guild?.id}});

        const imageUrl = settingsData && isValidURL(settingsData.panelImageUrl)
            ? settingsData.panelImageUrl
            : undefined;
        const thumbnailUrl = settingsData && isValidURL(settingsData.panelThumbnailUrl)
            ? settingsData.panelThumbnailUrl
            : undefined;

        const embed = new EmbedBuilder()
            .setTitle(settingsData?.panelTitle || panelDefaults.title)
            .setDescription(settingsData?.panelDescription || panelDefaults.description)
            .setImage(imageUrl || panelDefaults.imageUrl)
            .setThumbnail(thumbnailUrl || panelDefaults.thumbnailUrl)

        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder()
                    .setCustomId("create")
                    .setLabel("Create Ticket")
                    .setStyle(ButtonStyle.Secondary)
            ]
        })

        try {
            await channel.send({embeds: [embed], components: [row]});
        } catch {
            throw new AppError("UNABLE_CHANNEL");
        }

        await interaction.reply(successMessage(
            "Successfully send ticket panel!",
            "The ticket panel has been sent in the desired channel!"
        ))
    }
}