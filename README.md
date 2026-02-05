# Divergent

Divergent is an application for creating and managing Discord bots with a clean, minimal, Nothing-inspired design.

## What this repository includes

A runnable full-stack prototype of the Divergent flow:

- Bot token verification via API.
- Setup path selection (templates or custom).
- Template catalog (moderation, welcome, utility, event).
- Live dashboard data from server state.
- Sandbox test and one-click deploy actions.

## Run locally

```bash
npm start
```

Then open `http://localhost:4173`.

## Available scripts

```bash
npm run check
npm start
```

## Product flow

1. Verify token on the first screen.
2. Choose setup path.
3. Select a template to initialize bot configuration.
4. Use the dashboard to run sandbox tests and deploy updates.

## Design principles

- Monochrome visuals with soft-dot texture.
- Generous spacing and focused single-task panels.
- No clutter and no hidden menus.

Divergent removes friction while keeping control in your hands.
A mobile discord bot maker

Divergent is an application for creating and managing Discord bots with a clean, minimal, Nothing-inspired design.

## How it starts

Paste your bot token on the first screen and Divergent verifies it in seconds. The app checks your bot’s permissions and server access. If something fails, Divergent shows precise steps inside the Discord Developer Portal with clear clicks and toggles—no technical jargon.

## Build path after verification

After verification, you can choose one of two paths:

- **Templates** to build a working bot instantly.
- **Custom setup** to shape commands, behavior, and roles around your server.

## Moderation template

The moderation template includes slash commands for:

- Kick
- Ban
- Timeout
- Warn
- Message purge

You can set role hierarchy and safety limits, receive automatic moderation logs in a private channel, and get warned about risky actions before they run. For larger servers, you can enable rate limits and appeal buttons.

## Other templates

Divergent also includes templates for common needs:

- **Welcome bot**: sends branded greetings, assigns roles, and tracks joins.
- **Utility bot**: adds polls, reminders, and timestamp tools.
- **Event bot**: handles countdowns, schedules, and announcements.

## Dashboard and deployment

A live dashboard shows your bot status, latency, command usage, and errors. You can test commands in a sandbox server before deployment, then push updates with one click.

Divergent keeps everything in one place.

## Design principles

The interface uses monochrome tones, soft dots, and generous spacing. Each screen focuses on one task:

- No clutter
- No hidden menus

Divergent removes friction and keeps control in your hands.
