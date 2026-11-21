# BotNest Corporate Website

This package replaces the previous BotNest Academy / EdTech presentation with a corporate home automation, office automation and IoT solutions website.

## Publish to GitHub Pages
1. Back up the current repository.
2. Upload the contents of this package to the repository root, replacing the previous website files.
3. Keep `CNAME` at the repository root; it should contain `botnest.in`.
4. In GitHub, open Settings → Pages → Deploy from a branch → select the production branch and `/ (root)`.
5. Keep the custom domain `botnest.in` and enable HTTPS after DNS validation.

## Website pages
- `index.html` — corporate homepage
- `solutions.html` — residential, workplace and IoT solutions
- `products.html` — searchable 206-item product roadmap and indicative target pricing
- `app.html` — BotNest Automations app walkthrough and feature explanation
- `about.html`, `contact.html`, `privacy-policy.html`, `terms-and-conditions.html`

## Product catalogue accuracy
The 206 product types and indicative prices are transcribed from the BotNest product catalogue and proposed pricing framework. They are not confirmation of current stock, manufacturing, OEM sourcing or app compatibility. Final prices require commercial validation and a written quotation. Security/surveillance categories and Zigbee gateways remain excluded, in line with the catalogue scope.

## App information
The app page describes the BotNest Automations workflow blueprint: Flutter client, FastAPI service, MQTT messaging and ESP32/ESP8266 device layer. It describes planned/defined capabilities, not a guarantee that every capability is live for every customer installation. The energy-meter description is limited to consumption information and estimated Tamil Nadu electricity bill; it does not advertise line voltage, household current or real-power readings in the customer app.

## Backend / legacy files
The old website bundle contained student registration, course enrolment and Academy admin/customer portal pages connected to a Cloudflare Worker. Those EdTech-facing pages and their scripts have been removed from the public website package. The Worker and any backend resources are not changed by this static-site rebuild. The new contact form opens an email draft and does not submit data to a backend.

## Before publishing
- Confirm the product list and proposed prices are approved for public display.
- Confirm which products are currently available, under development or roadmap-only before adding availability labels.
- Confirm suite inclusions, GST treatment, warranty and installation terms before publishing a binding offer.
- Test navigation, product search/filter, mobile layout, email enquiry link, custom domain and HTTPS.
