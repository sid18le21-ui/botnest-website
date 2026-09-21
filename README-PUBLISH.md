# BotNest Academy — Final Website Package

## Publish to GitHub Pages

1. Delete the old website files from the repository.
2. Upload everything inside this `website` folder to the repository root.
3. Keep `CNAME` at the repository root. Its value is `botnest.in`.
4. In GitHub: Settings → Pages → Deploy from branch → select the main branch and `/ (root)`.
5. Keep the custom domain as `botnest.in` and enable HTTPS after DNS is active.

## API dependency

The website frontend calls:
`https://botnest-api.botnest-officials.workers.dev/`

The Cloudflare Worker then forwards requests to the Google Apps Script backend configured through `APPS_SCRIPT_URL`.

The Google Apps Script backend is not included in this package because its source was not provided in the uploaded website files.

## Before launch

- Verify the Cloudflare Worker is deployed.
- Verify `APPS_SCRIPT_URL` is configured in the Worker.
- Test Create Account → Login → Dashboard → Student Registration.
- Test admin login separately.
- Confirm the Google Sheet backend is reachable and has the expected data structure.
