import {Cluster} from "galactic.ts";
import {ExtendedClient} from "./structures/extendclient.js";
import {Client, Events} from "discord.js";
import {logger} from "./utils/logger.js";
import {readdirSync} from "node:fs";
import {join} from "path";
import type {GatewayEvent} from "./structures/gatewayevents.js";
import type {SlashCommand} from "./structures/slashcommand.js";
import type {ButtonHandler} from "./structures/buttonhandler.js";
import type {ModalHandler} from "./structures/modalhandler.js";

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
    logger.info(`Starting cluster ${cluster.clusterID} with shards ${cluster.shardList}`);

    const gatewayEventFiles = readdirSync(join(__dirname, "gatewayevents"))
    for (const file of gatewayEventFiles) {
        const eventClass = await import(join(__dirname, "gatewayevents", file));
        const event: GatewayEvent = new eventClass.default(client);
        client.on(event.name, async (...args) => event.execute(...args))
    }

    const commandFiles = readdirSync(join(__dirname, "commands"))
    for (const file of commandFiles) {
        const commandClass = await import(join(__dirname, "commands", file));
        const command: SlashCommand = new commandClass.default(client);
        client.commands.set(command.data.name, command);
    }

    const buttonFiles = readdirSync(join(__dirname, "buttons"))
    for (const file of buttonFiles) {
        const buttonClass = await import(join(__dirname, "buttons", file));
        const button: ButtonHandler = new buttonClass.default();
        client.buttons.set(button.name, button);
    }

    const modalFiles = readdirSync(join(__dirname, "modals"))
    for (const file of modalFiles) {
        const modalClass = await import(join(__dirname, "modals", file));
        const modal: ModalHandler = new modalClass.default();
        client.modals.set(modal.name, modal);
    }

    if (cluster.clusterID === 0) {
        logger.info(`Syncing ${client.commands.size} commands to Discord...`);
        await client.application?.commands.set(
            client.commands.map((cmd) => cmd.data.toJSON()),
        );
    }

    cluster.triggerReady(readyClient.guilds.cache.size, 0)
})

cluster.onSelfDestruct = async (): Promise<void> => {
    await client.destroy();
}

client.login(cluster.token);