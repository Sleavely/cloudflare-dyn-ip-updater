
# Cloudflare dynamic IP updater

A simple script to replicate the ol' DynDNS functionality.

## Installing

```
git clone https://github.com/Sleavely/cloudflare-dyn-ip-updater.git
cd cloudflare-dyn-ip-updater
npm install
```

Environment variables (can be set with a `.env` file):

- **CLOUDFLARE_EMAIL** _(required)_
- **CLOUDFLARE_APIKEY** _(required)_ You can find this under "My Profile" in CF
- **CLOUDFLARE_DOMAIN** _(required)_ The domain you wish to keep updated. E.g. `home.example.com`
- **REFRESH_RATE** Number of minutes between checking for new IP.
- **DEBUG** Set to `*` to log verbosely.

## Running

```
DEBUG="*" npm start
```

It is recommended you run it as a background service in e.g. `pm2` unless you are keen to keep network traffic at a minimum.
