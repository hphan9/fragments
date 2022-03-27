// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
var { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
// Support sending various Content-Types on the body up to 5M in size

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`

module.exports = async (req, res) => {
  logger.info(`Start handling post request`);
  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json(createErrorResponse(415, 'Can\'t post fragment'));
  }
  try {
    const fragment = new Fragment({ ownerId: req.user, type: req.get('content-type') });
    await fragment.save();
    await fragment.setData(req.body);
    logger.info({ fragment }, `new fragment created`);
    const fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.set('Location', `${fullURL}/${fragment.id}`);
    return res.status(201).json(createSuccessResponse({ fragment }));
  } catch (err) {
    logger.warn(err);
    return res.status(415).json(createErrorResponse(415, err));
  }
};
