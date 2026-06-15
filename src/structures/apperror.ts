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