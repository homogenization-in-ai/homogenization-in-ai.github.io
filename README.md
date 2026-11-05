# homogenization-in-ai.github.io

Website for **Homogenization in AI: Social Impacts, Pluralism, and Agents** (HPAI@AAAI2027, Montreal), a bridge program at AAAI 2027.

A static site with no build step: the event page lives at `aaai27/index.html`, with shared styles and scripts in `assets/`. The root `index.html` redirects visitors to the current event page.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. The root redirects to http://localhost:8000/aaai27/, which can also be opened directly.

## Deployment

Pushes to `main` deploy to GitHub Pages through `.github/workflows/deploy.yml`.
One-time setup: in the repository settings, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.

## Credits

Hero photo by [Marc-Olivier Jodoin](https://unsplash.com/photos/landscape-photography-of-skyscrapers-BG9oZ15a4Xk) on Unsplash.
Organizer photos come from each organizer's personal website.

## Social previews

Link previews (Open Graph and X/Twitter cards) use `assets/img/social/og-image.jpg` (1200×630, the size Facebook, LinkedIn, X, Slack, Discord, WhatsApp and iMessage expect). Its source is `assets/img/social/og-image.svg`; after editing it, re-render the JPEG at 1200×630 with Schibsted Grotesk loaded (for example by screenshotting the SVG in a headless browser). Image URLs in the meta tags are absolute, as the platforms require.
