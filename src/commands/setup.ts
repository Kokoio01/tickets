import {
    type ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import {SlashCommand} from "../structures/slashcommand.js";
import {checkAdministrator, checkGuild} from "../utils/checks.js";
import {settingsMenu} from "../messages/settings.js";

export default class SetupCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName("setup")
            .setDescription("Change the settings of the Bot!"));
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        checkGuild(interaction);
        if (!checkAdministrator(interaction)) return;

        await interaction.reply(settingsMenu())
    }
}