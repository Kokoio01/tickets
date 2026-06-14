import {sequelize} from "../db/index.js";
import {logger} from "../utils/logger.js";

try {
    logger.info("Login DB");
    await sequelize.authenticate();
    logger.info("Syncing Models")
    await sequelize.sync();
    logger.info("Done! Models synced to Database");
} catch (error) {
    logger.error(error);
}