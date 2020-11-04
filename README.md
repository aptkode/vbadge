# vbadge
A svg version badge generator, like current version for vbadge ![alt text](./v1.0.0.svg)

# run

`docker run -p 3000:3000 ghcr.io/aptkode/vbadge:latest`

# api

generate badage by artifactId and version
- `/:artifactId/:version`

generate badage by raw pom
- `/pom?url={url-encoded-raw-pom-file-url}`

# options

ignore all self signed certificat issues
- `docker run -p 3000:3000 -e INSECURE_TLS=1 ghcr.io/aptkode/vbadge:latest`

# gitlab

use [file api](https://docs.gitlab.com/ee/api/repository_files.html#get-raw-file-from-repository) to pass the url parameter if you are using `pom` endpoint.

if your gitlab project is under a group, url encoded project name **doesn't work**. Use project id instead.

# github

for public repos works without any workaround.
