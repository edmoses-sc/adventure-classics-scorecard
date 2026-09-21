# Quabbin Quest Scorecard

Phone scorecard for the Adventure Classics Mini Race. Rebuilt from the original
single-file `index.html` to work across current iOS and Android phones.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app. Fonts are embedded, so it needs no network once loaded. |
| `sw.js` | Service worker — caches the app so it opens with no signal. |
| `manifest.webmanifest` | Optional. Only used if someone adds it to their home screen. |
| `icon-*.png`, `apple-touch-icon.png` | Optional. The icon if they do. |

This is an ordinary web page: open the link, it runs in the browser. No install
step is needed for anything.

`sw.js` is the one that earns its keep — it caches the app **in the browser**, so
the same link still opens at a stop with no signal. Keep it next to `index.html`.

## Deploying to GitHub Pages

Upload **every file in this folder** — not just `index.html`. The page runs from
`index.html` alone (the fonts are embedded), but without `sw.js` it only opens
where there is a signal.

1. Put all the files at the **repo root**, including the empty `.nojekyll`.
2. *Settings → Pages → Build and deployment → Deploy from a branch*,
   branch `main`, folder `/ (root)`.
3. Leave **Enforce HTTPS** on. Service workers only register over HTTPS, so
   offline mode depends on it. GitHub Pages does this for you.

Every path in the app is relative, so it works either way:

- project site — `https://<you>.github.io/<repo>/`
- user/org site — `https://<you>.github.io/` (repo named `<you>.github.io`)

`.nojekyll` stops GitHub from running the files through Jekyll. Nothing here
starts with an underscore, so it is belt-and-braces, but leave it in.

## Before race day

Have each team **open the link once while they still have a signal**, ideally on
wifi the morning of. That is the only required step — it caches the app, so the
same link opens at every stop afterwards whether or not they have bars.

Photos stay on the phone and only leave it when someone taps **Send**.

### If a team wants it on the home screen

Entirely optional — it just saves hunting for the URL, and gains a bit of screen
height by dropping the browser bars. Two things to know if anyone does it:

- On iOS a home-screen app gets its **own storage**, separate from Safari. Add it
  to the home screen *before* filling in team details, or those details (and any
  photos) will not follow it across.
- Pick one or the other and stay there for the whole race. Photos taken in Safari
  will not appear in the home-screen copy, or the reverse.

### One caveat on setting up early

iOS Safari clears a site's stored data after about 7 days without a visit. That
only threatens team details typed in well ahead of time — anything captured on
race day is never at risk. If you set up more than a week out, just have teams
reopen the link the morning of and check their name is still in the header.

## When you edit `index.html`

Bump the cache name in `sw.js`:

```js
const CACHE = 'qq2026-v2';   // was v1
```

Otherwise phones that already cached the app keep serving the old copy. The worker
serves from cache first and refreshes in the background, so a phone that has the
old version picks up the new one on its *second* open after you deploy.

## Notes

- The camera button uses `capture="environment"`, which on iOS opens the camera
  directly and hides the photo library. Remove that attribute in `index.html`
  (search for `setAttribute('capture'`) if teams should be able to pick an
  existing photo instead.
- Base Camp's number is in two places: `const PHONE` in the script, and the
  `tel:` link in the Send panel.
