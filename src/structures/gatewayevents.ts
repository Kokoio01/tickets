import type {ExtendedClient} from "./extendclient.js";

export abstract class GatewayEvent {
    public abstract name: string;

    constructor(protected client: ExtendedClient) {}

    abstract execute(...args: unknown[]): Promise<void>;
}