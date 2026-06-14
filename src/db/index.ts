import {Sequelize} from "sequelize";
import {logger} from "../utils/logger.js";
import Tickets from "./model/tickets.js";


const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./ticket.db",
    logging: msg => logger.debug(msg),
})

const tickets = Tickets(sequelize);

export {
    sequelize,
    tickets,
}

