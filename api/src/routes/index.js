const { Router } = require("express");
const axios = require("axios");
const { Character, Episode } = require("../db.js");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);)

// router.get("/", (req, res) => {
//   res.send("Holis");
// });

// obtener todos los personajes

router.get("/getAll", async (req, res) => {
  // https://rickandmortyapi.com/api/character
  try {
    const api = await axios.get("https://rickandmortyapi.com/api/character");

    const formatear = api.data.results.map((personaje) => {
      const obj = {
        name: personaje.name,
        species: personaje.species,
        origen: personaje.origin.name,
        image: personaje.image,
        episodes: personaje.episode,
      };
      return obj;
    });
    const db = await Character.findAll({ include: [{ model: Episode }] });

    const suma = [...formatear, ...db];
    res.json(suma);
  } catch (e) {
    console.log(e);
  }
  // llamado asincrono a la api
  // ver que necesito y con que me quedo de la api
  // fetch.get("https://rickandmortyapi.com/api/character").then(result => result.json())...;
  // combinar resultados
  // enviarlos (validar que existan)
});

// crear un personaje

router.post("/create", async (req, res) => {
  // recibir los datos y separarlos
  // validacion los datos
  // agregar el objeto a mi base de datos (llamado asincronico)
  // agregar los episodios de ese personaje

  const { name, species, origen, image, episodes } = req.body;
  if (!name || !origen) res.status(400).json({ msg: "Faltan datos" });
  try {
    const obj = { name, species, origen, image };
    const nuevoPj = await Character.create(obj);

    nuevoPj.addEpisodes(episodes); // relaciona mi personaje nuevo con los episodios en lo que se encuentre
    const aux = Character.findByPk(nuevoPj.id, {
      include: [{ model: Episode }],
    });
    res.send(aux);
  } catch (e) {
    console.log(e);
  }
  // responder que se creo (validar si se quiere)
});

router.get("/charge-episodes", (req, res) => {
  // https://rickandmortyapi.com/api/episode
  try {
    axios.get("https://rickandmortyapi.com/api/episode").then((response) => {
      let aux = response.data.results.map((ep) => {
        const obj = {
          id: ep.id,
          name: ep.name,
        };
        return obj;
      });

      // crear los ep en la base de datos
      Episode.bulkCreate(aux);

      res.json({ msg: "Success" });
    });
  } catch (e) {
    console.log(e);
  }
});

// obtener un personaje por ID
router.get("/get/:id", async (req, res) => {
  // recibo el id por parametro (puedo destructurar)
  const { id } = req.params;
  // verificar el tipo de ID (de ser necesario)
  if (!id) res.status(400).json({ msg: "Missing ID" });
  try {
    const pj = await Character.findByPk(id, { include: [{ model: Episode }] });
    res.send(pj);
  } catch (e) {
    console.log(e);
  }
  // Llamado asincronico para buscarlo (base de datos o api)
  // respondemos con el resultado (se puede validar)
});

module.exports = router;
