# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yodeck digital signage widget that displays Basque Country (Euskalmet) weather forecasts. It uses an unofficial Euskalmet API provided by CodeSyntax (https://github.com/codesyntax/euskalmet-eguraldi-iragarpena). Licensed under GPLv2.

## Architecture

This is a dependency-free vanilla JavaScript project with no build system, no package manager, and no tests.

The entire application is a single Web Component (`<euskalmet-eguraldia>`) defined in `euskalmet.js`:
- Registers a custom element using the Custom Elements API
- Uses Shadow DOM for style encapsulation
- Fetches weather forecast JSON from a CodeSyntax GitHub repository
- Uses a cache-busting URL parameter that rotates every 4 hours
- Renders forecast cards showing date, icon, description, and min/max temperatures

`index.html` is a demo page showing usage of the component.

## Component Attributes

The custom element accepts: `city`, `days`, `language` (eu/es), `direction`, `short-text`, `custom-base-url`, `custom-icon-extension`, `modern-images`.

CSS custom properties for theming: `--euskalmet-forecast-day-padding`, `--euskalmet-forecast-day-text-align`.

## Development

No build step required. Open `index.html` in a browser to test. The component fetches live data from GitHub on each load.
