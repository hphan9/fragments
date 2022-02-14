// src/routes/api/get.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
var { createSuccessResponse, createErrorResponse } = require('../../response');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let expand = req.query.expand ? true : false;
  logger.info({expand},`Start handling Get request with expand `);
  // get all the data by User
  let fragments;
  try {
    fragments = await Fragment.byUser(req.user, expand);
    logger.info({fragments}, `returns after query to database`);
  } catch (err) {
    logger.warn(`Error getting fragments for user ${err}`);
    return res.status(400).json(createErrorResponse(400, err));
  }
    return res.status(200).json(createSuccessResponse({'fragments': fragments}));
};
