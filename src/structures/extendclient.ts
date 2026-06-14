import {Client, Collection, type ClientOptions} from "discord.js";
import {Cluster} from "galactic.ts";
import type {SlashCommand} from "./slashcommand.js";
import type {ButtonHandler} from "./buttonhandler.js";

export class ExtendedClient extends Client {
    cluster: Cluster<ExtendedClient>;
    commands: Collection<string, SlashCommand>;
    buttons: Collection<string, ButtonHandler>;

    constructor(options: ClientOptions, cluster: Cluster<ExtendedClient>) {
        super(options);
        this.cluster = cluster;
        this.commands = new Collection();
        this.buttons = new Collection();
    }
}