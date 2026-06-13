import {Client, type ClientOptions} from "discord.js";
import {Cluster} from "galactic.ts";

export class ExtendedClient extends Client {
    cluster: Cluster<ExtendedClient>;

    constructor(options: ClientOptions, cluster: Cluster<ExtendedClient>) {
        super(options);
        this.cluster = cluster;
    }
}