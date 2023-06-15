const express       = require("express");
const app           = express();
const bodyParser    = require("body-parser");
const swaggerUI     = require("swagger-ui-express");
const routeHandler  = require("./routeHandler.js");
const swaggerDoc    = require("./swagger-doc.json");
const errorHandler  = require("./src/app/middleware/errorHandler");
const path          = require("path");
const publicDir     = path.join(__dirname, './public');

require('dotenv').config();

app.use(bodyParser.json());
app.use('/api-documentation', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.set('view engine', 'hbs');

app.use(express.static(publicDir));

app.get("/", (req, res) => {
    res.send(`
    <h1>Welcome to House of Books</h1>
    <p>API is running on port ${process.env.PORT}
    `);
    // res.render("index");
});

app.use("/api", routeHandler);


//Any middleware please add it on top of this errorHandler middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}....`);
});

module.exports = app;
