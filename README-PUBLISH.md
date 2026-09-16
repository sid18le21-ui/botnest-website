# BotNest Academy Website

A static, responsive, modern-futuristic website for BotNest Academy.

## Files
- `index.html` — main website
- `styles.css` — design and responsive layout
- `script.js` — mobile navigation + year
- `assets/botnest-logo.jpg` — uploaded BotNest logo image

## Publish with GitHub Pages

1. Create/sign in to a GitHub account.
2. Create a new **public** repository, for example `botnest-website`.
3. Upload all files in this folder, keeping the `assets` folder.
4. In GitHub: **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then Save.
7. GitHub will provide a temporary `github.io` address.

## Connect botnest.in

In the GitHub repository:
1. Go to **Settings → Pages → Custom domain**.
2. Enter `botnest.in` and save.
3. GitHub will show/confirm the DNS configuration.

In GoDaddy:
1. Open your domain's DNS management.
2. For the root `@` record, use the GitHub Pages A records shown in GitHub's current documentation.
3. For `www`, create a CNAME pointing to your GitHub Pages hostname.
4. Return to GitHub Pages and enable HTTPS after DNS verification.

DNS changes can take some time to propagate.

## Before launch
Replace the placeholder WhatsApp link in `index.html`:
`https://wa.me/`
with your actual WhatsApp link.

Also verify the email address `hello@botnest.in` and update it if needed.
