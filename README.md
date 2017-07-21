# github-webhooks

Node.js service for processing GitHub Webhooks

## Usage

### Dependencies

* node >= 8.0
* npm >= 5.0

### Install

```sh
git clone https://github.com/greedbell/github-webhooks.git
npm install --production
```

### Config

reference [GitHub Webhooks](https://developer.github.com/webhooks/)

copy `config.example.json` to `config.json`
write your `config.json`

#### title

#### event

reference [Event Types & Payloads](https://developer.github.com/v3/activity/events/types/)

* [issues](https://developer.github.com/v3/activity/events/types/#issuesevent)
* [push](https://developer.github.com/v3/activity/events/types/#pushevent)

### Run

in development

```sh
npm run develop
```

in production

```sh
npm run release
```

### Add webhook in GitHub

```
Settings > Webhooks > Add webhook
```

* `Payload URL`: <domain>/<path in config.json>
* `Content type`: `application/x-www-form-urlencoded`
* `Secret` <secret in config.json>
* select events

Add webhook
