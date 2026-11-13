<h1 align="center">☁️ Cloud Error Collector</h1>

<div align="center">

[English](README.md) | Русский

Плагин Millennium, который объединяет уведомления об ошибках Steam Cloud в одно сообщение.

[![Релиз](https://img.shields.io/github/v/release/megatocha/cloud-error-collector?style=for-the-badge&labelColor=2a2642&color=7357b7&logo=github&logoColor=white)](https://github.com/megatocha/cloud-error-collector/releases/latest)
[![Загрузки](https://img.shields.io/github/downloads/megatocha/cloud-error-collector/total?style=for-the-badge&labelColor=2a2642&color=35805a&logo=github&logoColor=white)](https://github.com/megatocha/cloud-error-collector/releases)
[![Лицензия](https://img.shields.io/github/license/megatocha/cloud-error-collector?style=for-the-badge&labelColor=2a2642&color=526992&logo=opensourceinitiative&logoColor=white)](LICENSE)

</div>

## ✨ Возможности

- Собирает ошибки синхронизации облака, полученные в течение 20 секунд.
- Вместо отдельных окон и звуков показывает одно уведомление с количеством игр и названиями первых пяти.
- Сохраняет исходные записи в центре уведомлений Steam. Конфликты сохранений и другие типы уведомлений остаются без изменений.
- Использует язык интерфейса Steam. Для неизвестного языка включается английский.

Отсчёт начинается с первой ошибки. Ошибки после окончания интервала образуют новую группу. Steam не сообщает причину ошибки, поэтому плагин объединяет **все** уведомления Cloud Sync Failure, в том числе не связанные с OpenSteamTool. Плагин не исправляет синхронизацию и не меняет сохранения.

## ⬇️ Установка

1. Установите [Millennium](https://steambrew.app/).
2. Скачайте `cloud-error-collector.star` из [последнего релиза](https://github.com/megatocha/cloud-error-collector/releases/latest).
3. Скопируйте файл в папку плагинов Millennium. В Windows это обычно `Steam\millennium\plugins\`.
4. Включите **Cloud Error Collector** в меню Steam → Millennium → Plugins и перезапустите Steam.

Для удаления выключите плагин, удалите файл `.star` и перезапустите Steam.

## ⚙️ Как это работает

Steam может отправлять отдельную ошибку облака для каждой игры. Плагин перехватывает эти окна до показа, собирает ID игр и через 20 секунд выводит одно уведомление. Названия берутся из локальной библиотеки Steam; если название недоступно, отображается App ID. Плагин не отправляет эти данные в сеть.

Плагин использует внутренние API Steam, которые могут измениться после обновления Steam или Millennium. Если отдельные ошибки снова появляются, выключите плагин и [создайте issue](https://github.com/megatocha/cloud-error-collector/issues).

## 🛠️ Разработка

Установите Node.js и npm, затем выполните:

```sh
npm ci
npm test
npm run build
```

Собранный файл `cloud-error-collector.star` появится в папке проекта. Тесты проверяют группировку, фильтрацию, подавление звука и переводы на моделях объектов Steam; они не заменяют проверку в клиенте.

Генеративный ИИ использовался для создания большей части кода и документации. Подход к изучению уведомлений основан на [steam-native-notifications](https://github.com/tyvsmith/steam-native-notifications); его лицензия находится в [LICENSE.upstream](LICENSE.upstream).

## 📄 Лицензия

[MIT](LICENSE)
