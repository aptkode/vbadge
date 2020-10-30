# vbadge
A svg version badge generator

# run

`docker run -p 3000:3000 ghcr.io/aptkode/vbadge:latest`

# features

generate badage by artifactId and version
- `/:artifactId/:version`

generate badage by raw pom
- `/pom?url={url-encoded-raw-pom-file-url}` e.g. `/pom?url=https%3A%2F%2Fraw.githubusercontent.com%2Fruwanka%2Fnemo%2Fmaster%2Fgit-actions%2Fpom.xml`
