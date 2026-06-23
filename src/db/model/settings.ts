import {DataTypes, Model, type Sequelize} from "sequelize";

export class Settings extends Model {
    declare readonly guildId: string;

    declare staffRoleId: string;
    declare logChannelId: string;
    declare categoryId: string;

    declare maxTicketsPerUser: number;
    declare openingReasonRequired: boolean;
    declare closingReasonRequired: boolean;
    declare userCloseAllowed: boolean;
    declare pingOnOpen: boolean;

    declare overflowCategoryAllowed: boolean;
    declare overflowCategories: string[];

    declare panelTitle: string;
    declare panelDescription: string;
    declare panelImageUrl: string;
    declare panelThumbnailUrl: string;

    declare welcomeTitle: string;
    declare welcomeDescription: string;
    declare welcomeImageUrl: string;
    declare welcomeThumbnailUrl: string;
}

export default (sequelize: Sequelize) => {
    return Settings.init({
        guildId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },

        staffRoleId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        logChannelId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        categoryId: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        maxTicketsPerUser: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        userCloseAllowed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        openingReasonRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        closingReasonRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        pingOnOpen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

        // Overflow
        overflowCategoryAllowed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        overflowCategories: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },

        // Welcome Message
        welcomeTitle: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        welcomeDescription: {
            type: DataTypes.STRING(4096),
            allowNull: true
        },
        welcomeImageUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        welcomeThumbnailUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },

        // Panel Message
        panelTitle: {
            type: DataTypes.STRING(256),
            allowNull: true
        },
        panelDescription: {
            type: DataTypes.STRING(4096),
            allowNull: true
        },
        panelImageUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        },
        panelThumbnailUrl: {
            type: DataTypes.STRING(2048),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "settings",
    })
}