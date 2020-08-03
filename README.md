# Lemmy Mobile

Mobile client for Lemmy

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

## 📝 Table of Contents

- [❓ About](#%e2%9d%93-about)
- [🏁 Getting Started](#%f0%9f%8f%81-getting-started)
- [🎈 Usage](#%f0%9f%8e%88-usage)
- [🚀 Deployment](#%f0%9f%9a%80-deployment)

## ❓ About

An iOS and Android app for Lemmy

## 🏁 Getting Started

- 🛠 If you are a hands-on, learn-by-doing, practical learner then you can continue to the "[Installation](https://docs.expo.io/versions/latest/get-started/installation/)" guide.

- 📚 If you prefer to have a theoretical understanding before installing tools and writing code then the sections in this introduction will help you by explaining in more detail what Expo is. It will help you build a mental model for how to think about app development the Expo way and equip you with the knowledge to know which pieces of Expo are a good fit for your specific needs. Continue to the "[Workflows](https://docs.expo.io/versions/latest/introduction/managed-vs-bare/)" page.

### Prerequisites

- **Node.js**: In order to install Expo CLI you will need to have Node.js (we recommend the latest stable version- but the maintenance and active LTS releases will also work) installed on your computer. [Download the recommended version of Node.js](https://nodejs.org/en/).

- **Git**: Additionally, you'll need Git to create new projects. [You can download Git from here](https://git-scm.com/).

### Installing

We recommend installing Expo CLI globally, you can do this by running the following command:

```bash
npm install -g expo-cli
npm install
```

Verify that the installation was successful by running `expo whoami`. You're not logged in yet, so you will see "Not logged in". You can create an account by running `expo register` if you like, or if you have one already run `expo login`, but you also don't need an account to get started.

> 😳 Running into problems? Try searching for your error message on the [forums](https://forums.expo.io/) — you're probably not the first person to encounter your issue, and the forums are a great resource for these types of problems.

#### Optional: Installing Watchman

Some macOS users encounter issues if they do not have Watchman installed on their machine, so if you are using a Mac we recommend that you install it. [Download and install Watchman](https://facebook.github.io/watchman/docs/install.html).

> 💡Watchman watches files and records when they change, then triggers actions in response to this, and it's used internally by React Native.

## 🔧 Generating translations

Generate translations by running

```bash
node generate_translations.js
```

## 🎈 Usage

### Expo client for iOS and Android

Expo client is the tool you will use to run your projects while you're developing them. When you serve your project with Expo CLI, it generates a development URL that you can open in Expo client to preview your app.

- 🤖 [Download Expo client for Android from the Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

- 🍎 [Download Expo client for iOS from the App Store](https://itunes.com/apps/exponent)

> ⚠️ Required operating system versions: The minimum Android version is Lollipop (5) and the minimum iOS version is iOS 10.0.

When the Expo client is finished installing, open it up. If you created an account with `expo-cli` then you can sign in here on the "Profile" tab. This will make it easier for you to open projects in the client when you have them open in development — they will appear automatically in the "Projects" tab of the client app.

### Running the Expo client on your computer

The quickest way to get started is to run the Expo client on your physical iOS or Android device. If at some point you want to install a simulator or emulator to run the app directly on your computer you can find the [iOS simulator instructions here](https://docs.expo.io/versions/latest/workflow/ios-simulator/) and the [Android emulator instructions here](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/). The iOS simulator only runs on macOS, Android emulators run on any major operating system.

### Starting the development server

Navigate to the project folder in your terminal and type `npm start` to start the local development server of Expo CLI.

Expo CLI starts Metro Bundler, which is an HTTP server that compiles the JavaScript code of our app using [Babel](https://babeljs.io/) and serves it to the Expo app. It also pops up Expo Dev Tools, a graphical interface for Expo CLI.

> 👋 You can close the Expo Dev Tools window and disable it from starting in the future by pressing `shift+d` in your terminal running Expo CLI. Start it again at any time by pressing `d` in the terminal running Expo CLI.

### Opening the app on your phone/tablet

> 👨‍👩‍👧‍👧 You can open the project on multiple devices simultaneously. Go ahead and try it on an iPhone and Android phone at the same time if you have both handy.

- 🍎 On your iPhone or iPad, open the default Apple "Camera" app and scan the QR code you see in the terminal or in Expo Dev Tools.
- 🤖 On your Android device, press "Scan QR Code" on the "Projects" tab of the Expo client app and scan the QR code you see in the terminal or in Expo Dev Tools.

## 🚀 Deployment

[Create standalone binaries](https://docs.expo.io/distribution/building-standalone-apps/) of your Expo app for iOS and Android which can be submitted to the Apple App Store and Google Play Store.

An Apple Developer account is needed to build an iOS standalone app, but a Google Play Developer account is not needed to build the Android standalone app. If you'd like to submit to either app store, you will need a developer account on that store.

Run `expo build:android` or `expo build:ios`. If you don't already have a packager running for this project, expo will start one for you.

> ⚠️Dont't forget to bump version and build numbers!

### Publishing

To publish a project, click the Publish button in Expo Dev Tools. (It’s in the left side bar.) If you're using command line, run `expo publish`.

Any time you want to deploy an update, hit publish again and a new version will be available immediately to your users the next time they open it.
