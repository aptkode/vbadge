// author ruwankamadhushan@gmail.com

const express = require("express");
const { badgen } = require("badgen");
const xml2js = require("xml2js");
const axios = require("axios").default;

if (process.env.INSECURE_TLS) {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

const xmlParser = new xml2js.Parser();
const app = express();
const port = 3000;

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

app.get("/:artifactId/:version", (req, res) => {
  const artifactId = req.params.artifactId;
  const version = req.params.version;
  res.contentType("image/svg+xml");
  res.end(generateSvg(artifactId, version), "binary");
});

app.get("/pom", (req, res) => {
  axios
    .get(req.query.url)
    .then(function (response) {
      xmlParser.parseString(response.data, function (err, result) {
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
          res.contentType("image/svg+xml");
          res.end(generateSvg(artifactId, version), "binary");
        } catch (err) {
          console.log(err);
          res.status(400).send("failed to generate!");
        }
      });
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).send("failed to generate!");
    });
});

app.listen(port, () => {
  console.log(
    `svg version badge generator listening at http://localhost:${port}`
  );
});
