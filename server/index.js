const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");

/////////////// WEB SERVER HANDLING
const app = express();
app.use(bodyParser.json());
app.use(cors())

const personsRouter = require('./api/persons');
const ridesRouter = require('./api/rides');
const presetsRouter = require('./api/presets');

app.use('/api/persons', personsRouter);
app.use('/api/rides', ridesRouter);
app.use('/api/presets', presetsRouter);

app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});
