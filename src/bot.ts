import {Cluster} from "galactic.ts";
import {ExtendedClient} from "./structures/extendclient.js";
import {Client, Events} from "discord.js";
import {logger} from "./utils/logger.js";
import {readdirSync} from "node:fs";
import {join} from "path";
import type {GatewayEvent} from "./structures/gatewayevents.js";

const __dirname = new URL(".", import.meta.url).pathname;

const cluster = Cluster.initial<ExtendedClient>();

const client = new ExtendedClient(
    {
        shards: cluster.shardList,
        shardCount: cluster.totalShards,
        intents: cluster.intents,
    },
    cluster
)
cluster.client = client;

client.once( Events.ClientReady, async (readyClient: Client<true>) => {
    logger.info(`Started cluster ${cluster.clusterID} with shards ${cluster.shardList}`);

    cluster.triggerReady(readyClient.guilds.cache.size, 0)
})

cluster.onSelfDestruct = async (): Promise<void> => {
    await client.destroy();
}

const gatewayEventFiles = readdirSync(join(__dirname, "gatewayevents"))
for (const file of gatewayEventFiles) {
    const eventClass = await import(join(__dirname, "gatewayevents", file));
    const event: GatewayEvent = new eventClass.default(client);
    client.on(event.name, async (...args) => event.execute(...args))
}

client.login(cluster.token);