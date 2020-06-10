require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const sequelize = require('./util/database');

const app = express();

const appRoutes = require('./routes/approutes');
const errorHandler = require('./util/errors');
const logger = require('./util/loggingEngine');

app.use(helmet());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Origin',
    'Content-Type, AuthorizationToken'
  );
  next();
});     

app.use('/api/v1/app', appRoutes);
app.use(errorHandler.invalidEndPoint);

app.use((error, request, response, next) => {
  response.status(250).json(errorHandler.makeErrorResponse(error));
});

let PORT = process.env.PORT || 3100;

sequelize
  .authenticate()
  .then(result => {
    app.listen(PORT, () => {
      console.log(`Server started at port: ${PORT}`);
    });
    console.clear();
  })
  .catch(err => console.log(err));
