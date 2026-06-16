import type {ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} from "discord.js";

export abstract class SlashCommand {
    public readonly data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;

    protected constructor(data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder) {
        this.data = data;
    }

    abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}