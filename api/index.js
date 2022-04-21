const server = require("./src/app.js");
const { conn, Episode } = require("./src/db.js");
const axios = require("axios");
// Syncing all the models at once.
// force: true /false - FORZAR EL REINICIO DE LA BASE DE DATOS
function preCharge() {
  axios.get("https://rickandmortyapi.com/api/episode").then((response) => {
    let aux = response.data.results.map((ep) => {
      const obj = {
        id: ep.id,
        name: ep.name,
      };
      return obj;
    });
    Episode.bulkCreate(aux);
  });
}
conn.sync({ force: true }).then(async () => {
  await preCharge();
  server.listen(3001, () => {
    console.log("Running at PORT:3001"); // eslint-disable-line no-console
  });
});
