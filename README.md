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

copy `config.example.json` to `config.json`, and edit your `config.json` like

```
[
  {
    "path": "/callback/example/push-github-webhooks-master",
    "secret": "webhook-secret",
    "event": "push",
    "script": "scripts-example/push.sh"
  },
  {
    "path": "/callback/example/issues-github-webhooks",
    "secret": "webhook-secret",
    "event": "issues",
    "script": "scripts-example/other.sh"
  }
]
```

#### path

path for the webhook

#### secret

secret for request

#### event

reference [Event Types & Payloads](https://developer.github.com/v3/activity/events/types/)

* [issues](https://developer.github.com/v3/activity/events/types/#issuesevent)
* [push](https://developer.github.com/v3/activity/events/types/#pushevent)

#### script

script file path to run

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
