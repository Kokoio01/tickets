import {StandaloneInstance} from "galactic.ts";
import "dotenv/config";

const __dirname = new URL(".", import.meta.url).pathname;

const instance = new StandaloneInstance(
    `${__dirname}/bot.ts`,
    1,
    2,
    process.env.BOT_TOKEN!,
    [],
    process.execArgv
)

instance.start();

process.on("SIGTERM", () => instance.shutdown().then(() => process.exit(0)));
process.on("SIGINT", () => instance.shutdown().then(() => process.exit(0)));