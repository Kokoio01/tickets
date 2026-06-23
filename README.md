
# Tickets

[![GPLv3 License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/)

A simple discord ticket bot

## Features

- Customization of ticket panel
- Customization of welcome message
- Logging channel
- Restrict tickets per user
- Ticket closing
- Restrict Ticket Closing to Staff Members
- Require opening / closing reason
- Create categories when the main category is full
- Ticket claiming

## Run Locally

Clone the project

```bash
  git clone git@github.com:Kokoio01/tickets.git
```

Go to the project directory

```bash
  cd tickets
```

Install dependencies

```bash
  pnpm install
```

Add enviroment variables

```bash
  cp .env.example .env
```

Migrate Database

```bash
  pnpm db:sync
```

Start the server

```bash
  pnpm dev
```

## Usage

Configuration:
-  `/setup` - Opens configuration menu
-  `/panel send` - Send ticket panel

Usage:
- `/ticket close [reason]` - Close ticket
- `/ticket claim` - Claim Ticket
- `/ticket unclaim` - Unclaim Ticket

---

###### Made by [Kokoio01](https://github.com/Kokoio01)
