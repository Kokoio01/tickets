import {DataTypes, Model, type Sequelize} from "sequelize";

export class Tickets extends Model {
    declare readonly guildId: string;
    declare readonly ticketId: string;

    declare channelId: string;
    declare messageId: string | null;
    declare openerId: string;
    declare reason: string | null;
    declare closed: boolean;
    declare claimerId: string | null;
}

export default (sequelize: Sequelize) => {
    return Tickets.init({
        guildId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ticketId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },

        channelId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        messageId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        openerId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        closed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        claimerId: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: "tickets",
    })
}