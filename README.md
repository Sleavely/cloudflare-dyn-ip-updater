
# Cloudflare dynamic IP updater

A simple script to replicate the ol' DynDNS functionality. Works well with PM2.

```
git clone https://github.com/Sleavely/cloudflare-dyn-ip-updater.git
cd cloudflare-dyn-ip-updater
npm install
```

Environment variables (can be set with a `.env` file):

- **CLOUDFLARE_EMAIL** _(required)_
- **CLOUDFLARE_APIKEY** _(required)_ You can find this under "My Profile" in CF
- **CLOUDFLARE_DOMAIN** _(required)_ The domain you wish to keep updated. E.g. `home.example.com`
- **DEBUG** Set to `*` to log verbosely.

