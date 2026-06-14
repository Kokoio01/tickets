import {Client, Collection, type ClientOptions} from "discord.js";
import {Cluster} from "galactic.ts";
import type {SlashCommand} from "./slashcommand.js";

export class ExtendedClient extends Client {
    cluster: Cluster<ExtendedClient>;
    commands: Collection<string, SlashCommand>;

    constructor(options: ClientOptions, cluster: Cluster<ExtendedClient>) {
        super(options);
        this.cluster = cluster;
        this.commands = new Collection();
    }
}