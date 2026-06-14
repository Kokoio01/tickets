import {type ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags} from "discord.js";
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
        await interaction.reply({content: "Pong!", flags: MessageFlags.Ephemeral});
    }
}