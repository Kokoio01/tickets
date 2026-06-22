import {
    ButtonBuilder, ButtonStyle,
    ContainerBuilder,
    type InteractionReplyOptions, MessageFlags,
    ModalBuilder,
    SectionBuilder, SeparatorBuilder,
    TextDisplayBuilder, ChannelType, LabelBuilder, ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder, TextInputStyle, CheckboxGroupBuilder
} from "discord.js";
import {TextInputBuilder} from "discord.js";
import {openCloseDefaults, panelDefaults, ticketDefaults, welcomeDefaults} from "../utils/default.js";

export function settingsMenu(): InteractionReplyOptions {
    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder({content: "## Settings"})
        )

    const settings = [
        { id: "ticket", title: "Ticket Settings", description: "Staff, Logs, Category, Tickets per user" },
        { id: "open", title: "Open / Close", description: "Open/Close Reason, User Close, Ping on Open" },
        { id: "panel", title: "Panel Message", description: "Customize the Panel Message" },
        { id: "welcome", title: "Welcome Message", description: "Customize the Welcome Message" },
    ]

    for (const item of settings) {
        container
            .addSeparatorComponents(new SeparatorBuilder())
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder({content: [
                                `**${item.title}**`,
                                `-# ${item.description}`
                            ].join("\n")})
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setLabel("Edit")
                            .setCustomId(`setup:${item.id}`)
                            .setStyle(ButtonStyle.Secondary)
                    )
            )
    }

    return {
        components: [container],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
    }
}

export function settingsTicketModal(
    ticketCategory?: string,
    staffRole?: string,
    logChannel?: string,
    ticketPerUser?: number,
): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:ticket")
        .setTitle("Ticket Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Ticket Category")
                .setDescription("Select the category where new tickets will be created.")
                .setChannelSelectMenuComponent(
                    new ChannelSelectMenuBuilder()
                        .setCustomId("category")
                        .setChannelTypes(ChannelType.GuildCategory)
                        .setMaxValues(1)
                        .setRequired(true)
                        .setDefaultChannels(ticketCategory ? [ticketCategory] : [])
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Staff Role")
                .setDescription("The Staff Role will allow a user to close a ticket and claim/unclaim it.")
                .setRoleSelectMenuComponent(
                    new RoleSelectMenuBuilder()
                        .setCustomId("staffrole")
                        .setMaxValues(1)
                        .setRequired(true)
                        .setDefaultRoles(staffRole ? [staffRole] : [])
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Log Channel")
                .setDescription("In this Channel we will log all Ticket Actions like Creation/Closing/...")
                .setChannelSelectMenuComponent(
                    new ChannelSelectMenuBuilder()
                        .setCustomId("logchannel")
                        .setChannelTypes(ChannelType.GuildText)
                        .setMaxValues(1)
                        .setRequired(true)
                        .setDefaultChannels(logChannel ? [logChannel] : [])
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Tickets per User")
                .setDescription("How many tickets is one user allowed to have open. (0 is infinite)")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("ticketsPerUser")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setValue(String(ticketPerUser || ticketDefaults.maxTicketsPerUser))
                )
        )
}

export function settingsOpenModal(
    closingReasonRequired?: boolean,
    openReasonRequired?: boolean,
    userCloseAllowed?: boolean,
    pingStaffOnOpen?: boolean,
): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:open")
        .setTitle("Open/Close Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Reasons")
                .setDescription("Toggle on if Close/Open reasons should be required.")
                .setCheckboxGroupComponent(
                    new CheckboxGroupBuilder()
                        .setCustomId("reasons")
                        .setRequired(false)
                        .addOptions([
                            {label: "Opening Reason required", description: "Does a User need to enter a reason to open a ticket", value: "open", default: openReasonRequired || openCloseDefaults.openingReasonRequired},
                            {label: "Close Reason required", description: "Does a User/Staff need to enter a reason to close a ticket", value: "close", default: closingReasonRequired || openCloseDefaults.closingReasonRequired}
                        ])
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Close by User")
                .setDescription("Allow Users to close their tickets themself")
                .setCheckboxGroupComponent(
                    new CheckboxGroupBuilder()
                        .setCustomId("userClose")
                        .setRequired(false)
                        .addOptions([
                            {label: "Allow User Close", description: "Allow Users to close their tickets themself", value: "allow", default: userCloseAllowed || openCloseDefaults.allowUserClose}
                        ])
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Ping Staff")
                .setDescription("Ping your Staff when a new Ticket is opened")
                .setCheckboxGroupComponent(
                    new CheckboxGroupBuilder()
                        .setCustomId("pingOnOpen")
                        .setRequired(false)
                        .addOptions([
                            {label: "Ping Staff", description: "Ping your Staff when a new Ticket is opened", value: "ping", default: pingStaffOnOpen || openCloseDefaults.pingOnOpen}
                        ])
                )
        )
}

export function settingsPanelModal(
    title?: string,
    description?: string,
    imageUrl?: string,
    thumbnailUrl?: string ,
): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:panel")
        .setTitle("Panel Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Title")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("title")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                        .setValue(title || panelDefaults.title)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Description")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("description")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(4000)
                        .setRequired(true)
                        .setValue(description || panelDefaults.description)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Image URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("imageUrl")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                        .setValue(imageUrl || "")
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Thumbnail URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("thumbnailUrl")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                        .setValue(thumbnailUrl || "")
                )
        )
}

export function settingsWelcomeModal(
    title?: string,
    description?: string,
    imageUrl?: string,
    thumbnailUrl?: string,
): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:welcome")
        .setTitle("Welcome Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Title")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("title")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                        .setValue(title || welcomeDefaults.title)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Description")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("description")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(4000)
                        .setRequired(true)
                        .setValue(description || welcomeDefaults.description)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Image URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("imageUrl")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                        .setValue(imageUrl || "")
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Thumbnail URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("thumbnailUrl")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                        .setValue(thumbnailUrl || "")
                )
        )
}