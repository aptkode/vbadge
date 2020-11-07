// author ruwankamadhushan@gmail.com

const express = require("express");
const { badgen } = require("badgen");
const xml2js = require("xml2js");
const axios = require("axios").default;
const fs = require("fs");

if (process.env.INSECURE_TLS) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

const xmlParser = new xml2js.Parser();
const app = express();
const port = 3000;

const gitlabConfig = readGitlabConfig();

function readGitlabConfig() {
  try {
    let content = fs.readFileSync("./config/gitlab-config.json");
    return JSON.parse(content);
  } catch (err) {
    console.log(err);
  }
  return { enabled: false };
}

function generateSvg(artifactId, version) {
  const svgString = badgen({
    label: artifactId, // <Text>
    labelColor: "black", // <Color RGB> or <Color Name> (default: '555')
    status: version, // <Text>, required
    color: "green", // <Color RGB> or <Color Name> (default: 'blue')
    //style: 'flat',     // 'flat' or 'classic' (default: 'classic')
    //icon: 'data:image/svg+xml;base64,...', // Use icon (default: undefined)
    //iconWidth: 13, // Set this if icon is not square (default: 13)
    //scale: 1, // Set badge scale (default: 1)
  });
  return svgString;
}

function getArtifactIdAndVersionFromPom(url, callback) {
  let config = {
    headers: {
      "PRIVATE-TOKEN": gitlabConfig.private_token,
    },
  };

  axios
    .get(url, config)
    .then(function (response) {
      xmlParser.parseString(response.data, function (err, result) {
        if (err) {
          callback(err, undefined);
        }
        try {
          var artifactId = result.project.artifactId[0];
          var version = "";
          if (result.project.version !== undefined) {
            version = result.project.version[0];
          } else if (
            result.project.parent[0] !== undefined &&
            result.project.parent[0].version[0] !== undefined
          ) {
            version = result.project.parent[0].version[0];
          }
          callback(undefined, { artifactId, version });
        } catch (err) {
          callback(err, undefined);
        }
      });
    })
    .catch(function (error) {
      callback(error, undefined);
    });
}

app.get("/:artifactId/:version", (req, res) => {
  const artifactId = req.params.artifactId;
  const version = req.params.version;
  res.contentType("image/svg+xml");
  res.end(generateSvg(artifactId, version), "binary");
});

app.get("/pom", (req, res) => {
  getArtifactIdAndVersionFromPom(req.query.url, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.contentType("image/svg+xml");
      res.end(generateSvg(result.artifactId, result.version), "binary");
    }
  });
});

app.get("/gitlab/:project/:pomPath", (req, res) => {
  if (!gitlabConfig.enabled) {
    res.status(200).send("gitlab configuration is not provided or disabled!");
  }

  let url = `${gitlabConfig.host}/api/v4/projects/${encodeURIComponent(
    req.params.project
  )}/repository/files/${encodeURIComponent(req.params.pomPath)}/raw?ref=${
    req.query.branch
  }`;

  getArtifactIdAndVersionFromPom(url, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.contentType("image/svg+xml");
      res.end(generateSvg(result.artifactId, result.version), "binary");
    }
  });
});

app.listen(port, () => {
  console.log(
    `svg version badge generator listening at http://localhost:${port}`
  );
});
