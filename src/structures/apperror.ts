interface ErrorMessage {
    title: string;
    description: string;
}

const errorMessages = {
    UNEXPECTED: {
        title: "An error has occurred",
        description:
            "An unexpected error has occurred, the error has been reported.",
    },

    UNKNOWN_CMD: { title: "Unknown", description: "This command does not exist" },
    UNKNOWN_BUTTON: {
        title: "Unknown",
        description: "This button does not exist",
    },
    UNKNOWN_MODAL: { title: "Unknown", description: "This modal does not exist" },

    NO_GUILD: {
        title: "Not in a Guild!",
        description: "This action can only be performed in a guild.",
    },
    NO_TEXTCHANNEL: {
        title: "Not in a text channel",
        description: "This action can only be performed in/on a text channel.",
    },
    NO_TICKET_CHANNEL: {
        title: "Not in a ticket",
        description: "This action can only be performed in/on a ticket",
    },

    UNABLE_CHANNEL: {
        title: "Unable to send message",
        description: "Unable to send message to channel, pls verify the bot has permissions to send messages there.",
    },

    INVALID_URL: {
        title: "Invalid URL",
        description: "The provided URL is not a valid URL.",
    },

    MISSING_CONFIG: {
        title: "Missing configuration",
        description: "This server has not been configured. Please contact the server administrator.",
    },

    TICKET_LIMIT_REACHED: {
        title: "Ticket limit reached",
        description: "You have reached the limit on how many tickets you can have open at once."
    },
    TICKET_CATEGORY_FULL: {
        title: "Capacity reached",
        description: "We currently have reached our maximum ticket capacity, please try again later.",
    },
    TICKET_CHANNEL_FAILED: {
        title: "Failed to create a ticket",
        description: "Unable to create ticket channel. Please contact the server administrator.",
    },
    TICKET_WELCOME_FAILED: {
        title: "Failed sending message in ticket",
        description: "Your ticket has been created, but the welcome message wasn't sent. Please contact the server administrator.",
    },
    TICKET_OPEN_REASON_REQUIRED: {
        title: "Reason required",
        description: "To open a ticket please enter a reason."
    },
    TICKET_CLOSE_REASON_REQUIRED: {
        title: "Reason required",
        description: "To close this ticket please enter a reason."
    },
    TICKET_STAFF_REQUIRED: {
        title: "Staff required",
        description: "To perform this action you need to be part of the staff team."
    },
    TICKET_DELETION_FAILED: {
        title: "Failed to delete the ticket",
        description: "Unable to delete the ticket. Please contact the server administrator.",
    },

    DB_ERROR: {
        title: "Database Error",
        description: "An error has occurred while querying the database.",
    },

    PERM_ADMINISTRATOR: {
        title: "Not an Administrator",
        description: "This action can only be performed as a administrator.",
    }
} satisfies Record<string, ErrorMessage>;

export type ErrorCode = keyof typeof errorMessages;

export class AppError extends Error {
    public readonly title: string;
    public readonly code: ErrorCode;

    constructor(code: ErrorCode, customMessage?: string) {
        const errorConfig = errorMessages[code];

        const message = customMessage ?? errorConfig.description;

        super(message);

        this.code = code;
        this.title = errorConfig.title;
        this.name = "AppError";

        Object.setPrototypeOf(this, new.target.prototype);
    }
}