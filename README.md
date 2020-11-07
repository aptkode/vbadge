# vbadge
A svg version badge generator, like current version for vbadge ![alt text](./v1.0.0.svg)

# run

`docker run -p 3000:3000 ghcr.io/aptkode/vbadge:latest`

# Endpoints

## generate badage by artifactId and version
- `/:artifactId/:version`

## generate badage by raw pom
- `/pom?url={url-encoded-raw-pom-file-url}`

### using with gitlab

- you can use this to consume gitlab url using `pom` endpoint using files api. 
- you have to pass `private_token` suffixed url encoded string as the url parameter.
- use [file api](https://docs.gitlab.com/ee/api/repository_files.html#get-raw-file-from-repository) to pass the url parameter if you are using `pom` endpoint.
- if your gitlab project is under a group, url encoded project name **doesn't work**. Use project id instead.

## generate badge for on premises gitlab
there are some scenarios where pom endpoint doesn't work with on prem gitlab setups
- `/gitlab/:project/:pomPath?branch=main`

You need to have following configuration as `./config/gitlab-config.json` for use this endpoint
```
{
    "host": "https://gitlab.com",
    "private_token": "xxxxxxxxxxxxxxxx",
    "enabled": true
}
```
with docker

`docker run -p 3000:3000 -v /path-to-gitlab-config-dir:/config/ ghcr.io/aptkode/vbadge:latest`

# options

ignore all self signed certificat issues
- `docker run -p 3000:3000 -e INSECURE_TLS=1 ghcr.io/aptkode/vbadge:latest`

# github

for public repos works without any workaround.
