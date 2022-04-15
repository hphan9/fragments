// src/routes/api/put.js
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { id } = req.params;
  logger.info({ id }, `Start handling PUT request`);
  try {
    //get the fragment
    let fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `fragment metadata returns after querying the database`);
    const { type } = contentType.parse(req);
    if (type != fragment.mimeType) {
      logger.warn(
        { type },
        "The Content-Type of the request does not match the existing fragment's type"
      );
      return res
        .status(400)
        .json(
          createErrorResponse(
            400,
            "The Content-Type of the request does not match the existing fragment's type"
          )
        );
    }
    await fragment.setData(req.body);
    logger.debug({ fragment }, `Set new fragment data`);
    return res.status(201).json(createSuccessResponse({ fragment }));
  } catch (err) {
    logger.error({ err }, `Error updating Fragment Data`);
    return res.status(404).json(createErrorResponse(404, err));
  }
};
