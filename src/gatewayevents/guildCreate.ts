import {GatewayEvent} from "../structures/gatewayevents.js";
import type {Guild} from "discord.js";
import {welcomeMessage} from "../messages/welcome.js";

export default class GuildCreate extends GatewayEvent {
    public name = "guildCreate";

    async execute(guild: Guild): Promise<void> {
        const channel = guild.systemChannel;

        if (channel) {
            await channel.send(welcomeMessage());
        }
    }
}