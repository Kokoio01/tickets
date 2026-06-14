import {DataTypes, type Sequelize} from "sequelize";

export default (sequelize: Sequelize) => {
    return sequelize.define("settings", {
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
    })
}