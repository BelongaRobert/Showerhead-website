# EVERYDAY

Premium filtered shower systems — **Better Water. Better Life.**

## Live site

**https://belongarobert.github.io/Showerhead-website/**

Deploys automatically on push to `main` via GitHub Actions.

## Custom domain (when ready)

1. In repo **Settings → Pages**, set your domain (e.g. `everydaywater.co`).
2. At your DNS host, add the records GitHub shows (usually `A` + `CNAME`).
3. Change `base` in `vite.config.ts` from `'/Showerhead-website/'` to `'/'`, then push to `main`.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Legacy docs

Shopify / Loop partner notes (archived): [`docs/loop-and-shop-tracking.md`](docs/loop-and-shop-tracking.md)
