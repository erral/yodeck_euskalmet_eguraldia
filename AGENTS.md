# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yodeck digital signage widget that displays Basque Country (Euskalmet) weather forecasts. It uses an unofficial Euskalmet API provided by CodeSyntax (https://github.com/codesyntax/euskalmet-eguraldi-iragarpena). Licensed under GPLv2.

## Architecture

This is a vanilla JavaScript project that uses Vite for development and bundling. It has no other dependencies.

The entire application is a single Web Component (`<euskalmet-eguraldia>`) defined in `euskalmet.js`:
- Registers a custom element using the Custom Elements API.
- Uses Shadow DOM for style encapsulation.
- Fetches weather forecast JSON from a CodeSyntax GitHub repository.
- Uses a cache-busting URL parameter that rotates every 4 hours.
- Renders forecast cards showing date, icon, description, and min/max temperatures.

`index.html` is a demo page showing usage of the component.

## Component Attributes

The custom element accepts: `city`, `days`, `language` (eu/es), `direction`, `short-text`, `custom-base-url`, `custom-icon-extension`, `modern-images`.

CSS custom properties for theming: `--euskalmet-forecast-day-padding`, `--euskalmet-forecast-day-text-align`, and various properties for card styling (e.g., `--card-background`, `--text-color`).

## Development

Requires Node.js and npm.

1.  Run `npm install` to install dependencies.
2.  Run `npm run dev` to start the Vite development server.
3.  Open `index.html` in a browser to test.

To build for production (e.g., for Yodeck), run `npm run build`. This generates a browser-compatible (non-module) JavaScript file in the `dist` directory.

## Changelog (Agent-driven)

- **Vite Integration**: Set up the project to use Vite for development and production builds. Configured it to output a single IIFE bundle compatible with Yodeck.
- **UI Redesign**:
    - Implemented a modern, card-based design for the weather forecast days.
    - Improved typography, colors, and spacing for better readability.
    - Styled the main `index.html` page, centering the content and title.
- **Date Formatting**: Changed the date display to a more user-friendly format: "Weekday Day" (e.g., "asteartea 19"). Ensured it respects the `language` attribute.
