// src/routes/api/get-info.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');


module.exports.getIdInfo = async function (req, res) {
  const { id } = req.params;
  logger.info({ id }, `Start handling Get Fragment Info request `);
  let fragment;
  try {
    fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `returns after query to database`);
    return res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    logger.error(`Error getting data for fragment ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting data for fragment'));
  }
};
