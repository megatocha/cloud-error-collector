<h1 align="center">☁️ Cloud Error Collector</h1>

<div align="center">

English | [Русский](README.ru.md)

A Millennium plugin that groups Steam Cloud error notifications into one summary.

[![Release](https://img.shields.io/github/v/release/megatocha/cloud-error-collector?style=for-the-badge&labelColor=2a2642&color=7357b7&logo=github&logoColor=white)](https://github.com/megatocha/cloud-error-collector/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/megatocha/cloud-error-collector/total?style=for-the-badge&labelColor=2a2642&color=35805a&logo=github&logoColor=white)](https://github.com/megatocha/cloud-error-collector/releases)
[![License](https://img.shields.io/github/license/megatocha/cloud-error-collector?style=for-the-badge&labelColor=2a2642&color=526992&logo=opensourceinitiative&logoColor=white)](LICENSE)

</div>

## ✨ Features

- Groups Cloud Sync Failure notifications received during a 20-second window.
- Replaces individual popups and sounds with one Steam-style summary, showing the number of affected games and up to five names.
- Keeps the original entries in Steam's notification center. Cloud conflicts and other notification types are unchanged.
- Uses the Steam interface language. Unknown languages fall back to English.

The collection window starts with the first error. Errors arriving after the window ends form a new group. Steam does not identify the cause of each error, so the plugin groups **all** Cloud Sync Failure notifications, including those unrelated to OpenSteamTool. It does not fix synchronization or modify saves.

## ⬇️ Installation

1. Install [Millennium](https://steambrew.app/).
2. Download `cloud-error-collector.star` from the [latest release](https://github.com/megatocha/cloud-error-collector/releases/latest).
3. Copy the file to your Millennium plugins folder. On Windows, this is usually `Steam\millennium\plugins\`.
4. Enable **Cloud Error Collector** in Steam → Millennium → Plugins and restart Steam.

To uninstall, disable the plugin, remove its `.star` file and restart Steam.

## ⚙️ How it works

Steam can send a separate Cloud Error notification for each game. The plugin intercepts those popups before they appear, collects the game IDs and sends one summary after 20 seconds. Game names come from your local Steam library; an App ID is shown if a name is unavailable. The plugin does not send this data over the network.

It uses internal Steam notification APIs. A Steam or Millennium update may change those APIs; if errors start appearing individually, disable the plugin and [open an issue](https://github.com/megatocha/cloud-error-collector/issues).

## 🛠️ Development

Install Node.js and npm, then run:

```sh
npm ci
npm test
npm run build
```

The build writes `cloud-error-collector.star` in the project directory. Tests cover grouping, notification filtering, sound suppression and translation lookup using simulated Steam objects; they do not replace testing in Steam.

Generative AI was used to create most of the plugin and documentation. The notification inspection approach was informed by [steam-native-notifications](https://github.com/tyvsmith/steam-native-notifications); its license is included in [LICENSE.upstream](LICENSE.upstream).

## 📄 License

[MIT](LICENSE)
