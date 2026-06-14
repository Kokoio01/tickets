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

export function settingsTicketModal(): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:ticket")
        .setTitle("Ticket Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Ticket Category")
                .setDescription("Select the category where new tickets will be created.")
                .setChannelSelectMenuComponent(
                    new ChannelSelectMenuBuilder()
                        .setCustomId("setup:modal:category")
                        .setChannelTypes(ChannelType.GuildCategory)
                        .setMaxValues(1)
                        .setRequired(true)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Staff Role")
                .setDescription("The Staff Role will allow a user to close a ticket and claim/unclaim it.")
                .setRoleSelectMenuComponent(
                    new RoleSelectMenuBuilder()
                        .setCustomId("setup:modal:staff")
                        .setMaxValues(1)
                        .setRequired(true)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Log Channel")
                .setDescription("In this Channel we will log all Ticket Actions like Creation/Closing/...")
                .setChannelSelectMenuComponent(
                    new ChannelSelectMenuBuilder()
                        .setCustomId("setup:modal:log")
                        .setChannelTypes(ChannelType.GuildText)
                        .setMaxValues(1)
                        .setRequired(true)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Tickets per User")
                .setDescription("How many tickets is one user allowed to have open. (0 is infinite)")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:ticketsuser")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )
        )
}

export function settingsOpenModal(): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:open")
        .setTitle("Open/Close Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Reasons")
                .setDescription("Toggle on if Close/Open reasons should be required.")
                .setCheckboxGroupComponent(
                    new CheckboxGroupBuilder()
                        .setCustomId("setup:check:reasons")
                        .addOptions([
                            {label: "Opening Reason required", description: "Does a User need to enter a reason to open a ticket", value: "open"},
                            {label: "Close Reason required", description: "Does a User/Staff need to enter a reason to close a ticket", value: "close"}
                        ])
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Close by User")
                .setDescription("Allow Users to close their tickets themself")
                .setCheckboxGroupComponent(
                    new CheckboxGroupBuilder()
                        .setCustomId("setup:check:userclose")
                        .addOptions([
                            {label: "Allow User Close", description: "Allow Users to close their tickets themself", value: "allow"}
                        ])
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Ping Staff")
                .setDescription("Ping your Staff when a new Ticket is opened")
                .setCheckboxGroupComponent(
                    new CheckboxGroupBuilder()
                        .setCustomId("setup:check:ping")
                        .addOptions([
                            {label: "Ping Staff", description: "Ping your Staff when a new Ticket is opened", value: "ping"}
                        ])
                )
        )
}

export function settingsPanelModal(): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:panel")
        .setTitle("Panel Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Title")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:panel:title")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Description")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:panel:description")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(4000)
                        .setRequired(true)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Image URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:panel:image")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Thumbnail URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:panel:thumbnail")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                )
        )
}

export function settingsWelcomeModal(): ModalBuilder {
    return new ModalBuilder()
        .setCustomId("setup:welcome")
        .setTitle("Welcome Settings")
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Title")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:welcome:title")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Description")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:welcome:description")
                        .setStyle(TextInputStyle.Paragraph)
                        .setMaxLength(4000)
                        .setRequired(true)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Image URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:welcome:image")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                )
        )
        .addLabelComponents(
            new LabelBuilder()
                .setLabel("Thumbnail URL")
                .setTextInputComponent(
                    new TextInputBuilder()
                        .setCustomId("setup:modal:welcome:thumbnail")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(2048)
                        .setRequired(false)
                )
        )
}