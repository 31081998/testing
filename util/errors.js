const { validationResult } = require('express-validator');
const logger = require('../util/loggingEngine');
const messages = require('../constants/errorResponseMessages.json');

exports.invalidEndPoint = (request, response, next) => {
  const error = new Error('Invalid Endpoint!');
  error.statusCode = 404;
  throw error;
};

exports.createError = statusCode => {
  const error = new Error(messages[statusCode]);
  error.statusCode = statusCode;
  return error;
};

exports.makeErrorResponse = error => {
  const status = error.statusCode || 500;
  const message = error.message || 'Server Error';
  logger.error({ error: { message: message } });
  let response = { status: false, code: status, message: message, data: {} };
  return response;
};

exports.validate = (parameters, requestBody) => {
  response = false;
  parameters.forEach(param => {
    if (!(param in requestBody)) response = true;
  });
  return response;
};
