# Calculator App

A mobile calculator application and a performance test tool built with ReactLynx and powered by the Rspeedy framework.

I made this app to test lynx framework feel free to experiment on your own as well.

## Problems

crashes on generating 100k or 1m boxes keep that in mind also does not have any safe area inset control as well.

## Project Overview

This is a ReactLynx project bootstrapped with `create-rspeedy`. It demonstrates how to build a mobile calculator application using Lynx technologies that can be previewed directly on your mobile device.

## Prerequisites

- Node.js >= 18
- pnpm package manager
- LynxExplorer App installed on your mobile device

## Getting Started

### Installation

First, install the dependencies:

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm run dev
```

A QR code will be displayed in your terminal. Scan this QR code with your LynxExplorer App to view the application on your mobile device. The app will automatically update as you edit the source files.

## Project Structure

- `src/App.tsx` - The main application component
- `lynx.config.ts` - Configuration file for the Lynx framework
- `package.json` - Project dependencies and scripts

## ScreenShots

### Calculator Interface

![Calculator Interface](https://example.com/calculator-screenshot.png)

### Performance Tab

![Dark Mode](https://example.com/dark-mode-screenshot.png)

### Performance Tab Active

![Calculation History](https://example.com/history-screenshot.png)

## Technologies

- [@lynx-js/react](https://www.npmjs.com/package/@lynx-js/react) - React bindings for Lynx
- [@lynx-js/rspeedy](https://www.npmjs.com/package/@lynx-js/rspeedy) - Development framework for ReactLynx apps

## License

This project is licensed under the MIT License.
