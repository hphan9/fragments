// src/routes/api/get.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = async function (req, res) {
  const expand = !!req.query.expand;
  logger.info({ expand }, `Start handling Get request `);
  // get all the data by User
  let fragments;
  try {
    fragments = await Fragment.byUser(req.user, expand);
    logger.debug({ fragments }, `return after querying the database`);
    return res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } catch (err) {
    logger.err({ err }, `Error getting fragments for user`);
    return res.status(400).json(createErrorResponse(400, err));
  }
};
