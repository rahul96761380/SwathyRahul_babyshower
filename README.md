# Swathy & Rahul — Baby Shower Invitation

A six-slide, responsive HTML/CSS/JavaScript invitation for the baby shower.

## Publish on GitHub Pages

1. Extract this ZIP and upload **the contents of this folder** to the root of the repository `rahul96761380/SwathyRahul_babyshower` on the `main` branch. Keep the `assets` and `.github` folders in place.
2. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
3. The included workflow at `.github/workflows/deploy.yml` deploys the site automatically after a push to `main`. You can also run it manually from the **Actions** tab.

Published site:
https://rahul96761380.github.io/SwathyRahul_babyshower/

## Music

The background audio file is `assets/music/soft_carnatic_veena_flute.mp3`, and the HTML audio source points to that exact filename. The page attempts to start music when it loads. Some browsers block audible autoplay until the visitor interacts with the page; in that case, tap **Tap for music** once. The music button also lets visitors pause and resume playback.

## Invitation controls

Slides advance automatically every 8 seconds. Visitors can pause, navigate with the arrows, select a slide using the dots, or swipe on touchscreens.
