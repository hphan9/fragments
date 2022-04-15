// src/routes/api/post.js

const { Fragment } = require('../../model/fragment');
var { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
// Support sending various Content-Types on the body up to 5M in size

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`

module.exports = async (req, res) => {
  logger.info(`Start handling post request`);
  if (!Buffer.isBuffer(req.body)) {
    logger.warn("request body is not a Buffer");
    return res.status(415).json(createErrorResponse(415, "Can't post fragment"));
  }
  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('content-type') });
    await fragment.save();
    await fragment.setData(req.body);
    logger.debug({ fragment }, `new fragment created`);
    const fullURL = process.env.API_URL + req.originalUrl;
    res.set('Location', `${fullURL}/${fragment.id}`);
    return res.status(201).json(createSuccessResponse({ fragment }));
  } catch (err) {
    logger.error({err}, "Error posting Fragment");
    return res.status(415).json(createErrorResponse(415, err));
  }
};
