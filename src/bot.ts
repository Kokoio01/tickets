import {Cluster} from "galactic.ts";
import {ExtendedClient} from "./structures/extendclient.js";
import {Client, Events} from "discord.js";
import {logger} from "./utils/logger.js";

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

client.login(cluster.token);