// src/routes/api/delete.js

const { Fragment } = require('../../model/fragment');
var { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { id } = req.params;
  logger.info({ id }, `Start handling Delete Fragment request `);
  try {
    await Fragment.delete(req.user, id);
    return res.status(200).json(createSuccessResponse());
  } catch (err) {
    logger.error({ err }, `Error deleting data for fragment ${id}`);
    return res.status(404).json(createErrorResponse(404, 'Error deleting data for fragment'));
  }
};
