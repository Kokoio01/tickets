import {
    type Guild,
    type Interaction, PermissionsBitField
} from "discord.js";
import {AppError} from "../structures/apperror.js";

type GuildInteraction = (Interaction) & { guild: Guild };

export function checkGuild(interaction: Interaction): interaction is GuildInteraction {
    if (!interaction.guild) throw new AppError("NO_GUILD");
    return true;
}

export function checkAdministrator(interaction: Interaction): boolean {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
        throw new AppError("PERM_ADMINISTRATOR")
    }
    return true;
}

export function isValidURL(input: string | undefined): boolean {
    if (!input) return false;
    try {
        const url = new URL(input);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
        return false;
    }
}