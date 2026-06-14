import {
    ButtonBuilder,
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags,
    ButtonStyle,
    ActionRowBuilder} from "discord.js";
import {SlashCommand} from "../structures/slashcommand.js";

export default class PingCommand extends SlashCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Ping! Pong!")
        );
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder().setLabel("Test").setCustomId("test").setStyle(ButtonStyle.Secondary),
            ]
        })

        await interaction.reply({content: "Pong!", components: [row], flags: MessageFlags.Ephemeral});
    }
}