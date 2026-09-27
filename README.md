# Смена рядом — полностью статический сайт для GitHub Pages

## Что загружать

**Готовая папка: `docs/`.** В ней уже лежат HTML, CSS, JavaScript, изображения и `config.json`.
На хостинге не нужны Node.js, API, база данных, Cloudflare или сервер Next.js.
Не нужно запускать сборку, если используете имя репозитория **smena-ryadom**.
Исходный опубликованный сайт не изменён.

## Самый простой способ размещения

1. Создайте на GitHub **публичный** репозиторий с точным именем `smena-ryadom`.
2. Распакуйте ZIP. Загрузите папку `docs` вместе с её содержимым в корень репозитория. Можно загрузить весь проект, кроме node_modules — это позволит позже менять исходники.
3. Проверьте структуру: `docs/index.html`, `docs/_next/`, `docs/city/`, `docs/.nojekyll`.
   Файл `.nojekyll` обязателен: он разрешает публикацию папки `_next` без обработки Jekyll. Если веб-загрузка пропустила скрытый файл, создайте пустой файл `docs/.nojekyll` через Add file → Create new file.
4. Откройте **Settings → Pages**.
5. В Source выберите **Deploy from a branch**.
6. Выберите ветку **main**, папку **/docs**, нажмите **Save**.
7. После завершения публикации GitHub покажет адрес: `https://ВАШ-ЛОГИН.github.io/smena-ryadom/`.

ZIP загружают не целиком: сначала распакуйте его. Не загружайте внешнюю папку `smena-ryadom-github-pages` как дополнительный уровень: папка `docs` должна находиться непосредственно в корне репозитория.

Официальная инструкция: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Настройки без пересборки

Откройте `docs/config.json` и задайте:

```json
{
  "affiliateUrl": "",
  "ymId": "",
  "gaId": "",
  "subIdParam": ""
}
```

- affiliateUrl — ваша партнёрская ссылка Самоката, обязательно HTTPS.
- ymId — номер Яндекс Метрики, если нужен.
- gaId — ID Google Analytics, если нужен.
- subIdParam — точное имя параметра SubID из партнёрской сети; без него SubID не передаётся.

Это публичный файл. Не добавляйте пароли, API-ключи и другие секреты.
Измените также `public/config.json` в исходниках, чтобы последующая сборка сохранила настройки.
Без affiliateUrl посетитель увидит честное сообщение о недоступном переходе. Аналитика загружается только с ID и согласием посетителя. UTM хранятся на время сеанса в браузере.

## Изменение городов, вакансий и текстов

- `data/cities.ts` — 70 городов, их названия, склонения и active.
- `data/jobs.ts` — вакансии, требования, форматы, доступные города, active.
- `data/employers.ts` — работодатели и резервная партнёрская ссылка.
- `components/site/site.tsx` — интерфейс и FAQ.
- `app/globals.css` — сохранённый дизайн и адаптация.
- `app/[info]/page.tsx` — информационные страницы.

После изменения исходников нужна повторная сборка и замена папки `docs` в GitHub.

## Пересборка

Установите Node.js 22.13 или новее, откройте терминал в папке проекта:

```sh
npm install
npm run build
```

Скрипт создаёт статический экспорт Next.js, затем переносит его из `out` в `docs`.
Для локального просмотра после сборки:

```sh
npm run preview
```

Откройте `http://localhost:8080/smena-ryadom/`. Не открывайте HTML двойным щелчком через file://: загрузка JS и JSON рассчитана на HTTP(S).

## Другой репозиторий или собственный домен

Текущая готовая сборка использует путь `/smena-ryadom`. При смене имени репозитория пересоберите сайт. Linux/macOS:

```sh
BASE_PATH=/new-repository SITE_URL=https://YOUR-LOGIN.github.io/new-repository npm run build
```

PowerShell (Windows):

```powershell
$env:BASE_PATH="/new-repository"
$env:SITE_URL="https://YOUR-LOGIN.github.io/new-repository"
npm run build
```

Для корневого сайта `YOUR-LOGIN.github.io` или собственного домена задайте пустой BASE_PATH:

```powershell
$env:BASE_PATH=""
$env:SITE_URL="https://YOUR-LOGIN.github.io"
npm run build
```

SITE_URL — полный будущий адрес сайта вместе с путём репозитория, без завершающего слеша.
Имя GitHub-аккаунта пока неизвестно: готовая сборка сохраняет title и description каждой страницы, но намеренно не содержит выдуманных canonical/OG-адресов. При сборке с SITE_URL создаются абсолютные метаданные, sitemap и ссылка на sitemap в robots.txt. Изображение `og.png` уже включено.

## Состав страниц

- Главная: `/`
- Вакансия: `/jobs/samokat-courier/`
- 70 страниц: `/city/cheboksary/`, `/city/moscow/`, `/city/kazan/` и остальные активные города
- `/privacy/`, `/terms/`, `/partners/`
- `404.html`, `robots.txt`, `sitemap.xml`

Все страницы уже содержат HTML. Прямые ссылки работают без переписывания адресов на сервере. Поиск, фильтры, меню и FAQ выполняются в браузере. Никаких запросов к `/api/config`: настройки загружаются из обычного статического `config.json`.
