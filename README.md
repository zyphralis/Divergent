# Divergent

Divergent is an application for creating and managing Discord bots with a clean, minimal, Nothing-inspired design.

## What this repository now includes

This project contains a functional multi-step web prototype of the Divergent experience:

- Token verification flow with actionable Developer Portal guidance.
- Setup-path selection (templates vs custom).
- Template catalog (moderation, welcome, utility, and event bots).
- Live dashboard preview with sandbox and one-click deploy actions.

## Run locally

From the project root, start a static server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Product flow

### 1) Verify your bot token

Paste your bot token on the first screen. Divergent verifies token shape quickly and checks for likely permission/access issues. If verification fails, the app points you directly to clear Developer Portal steps.

### 2) Choose your path

After verification, you can continue with:

- **Templates** for instant setup.
- **Custom setup** to shape behavior, roles, and command structure for your server.

### 3) Use templates that match real server needs

The moderation template includes command coverage for kick, ban, timeout, warn, and message purge. It also emphasizes hierarchy checks, risk warnings, moderation logs, and scale-friendly controls like rate limits and appeals.

Additional templates cover welcome/onboarding, utility tooling, and event workflows.

### 4) Operate from one dashboard

A live dashboard surfaces bot status, latency, command usage, and errors. You can run sandbox tests before deploying updates in one click.

## Design principles

- Monochrome visuals with soft-dot texture.
- Generous spacing and single-task screens.
- No clutter and no hidden menus.

Divergent removes friction while keeping control in your hands.
