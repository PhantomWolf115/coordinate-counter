# Coordinate Counter

Browser version of the Alep 2.1 **Coordinate Counter** tool. Works on desktop and Android tablets — no install, files stay on your device.

## Use

1. Open the site.
2. Tap **Select CSV Files** and choose one or more `.csv` files.
3. Review per-file counts and the total.
4. Tap **Copy to Clipboard** to copy filenames + total.

## Counting rules

Same as the desktop app:

- Count = number of rows minus the header
- First row must have at least 3 columns
- If the last two rows are identical, subtract one more

## Develop

Static files only: `index.html`, `styles.css`, `app.js`, `counter.js`.

```bash
# unit tests (Node 18+)
node test/counter.test.mjs

# local preview
npx --yes serve .
```

## Deploy

Hosted on GitHub Pages from the `main` branch (site root).
