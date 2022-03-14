// src/routes/api/get.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const mime = require('mime-types');
const md = require('markdown-it')();
const { createSuccessResponse, createErrorResponse } = require('../../response');

//function convert fragment to supported type
const convertFragment = (data, mimeType) => {
  let result = data;
  if (mimeType == 'text/html') {
    const stringData = data.toString();
    result = md.render(stringData);
  }
  return result;
};
/**
 * Get a list of fragments for the current user
 */
module.exports.get = async function (req, res) {
  let expand = req.query.expand ? true : false;
  logger.info({ expand }, `Start handling Get request `);
  // get all the data by User
  let fragments;
  try {
    fragments = await Fragment.byUser(req.user, expand);
    logger.info({ fragments }, `returns after query to database`);
    return res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } catch (err) {
    logger.warn(`Error getting fragments for user ${err}`);
    return res.status(400).json(createErrorResponse(400, err));
  }
};
module.exports.getId = async function (req, res) {
  let { id } = req.params;
  logger.info({ id }, `Start handling Get request `);
  let fragment;
  let extMimeType = mime.lookup(id);
  if (id.includes('.')) {
    id = id.replace(/\..*/, '');
  }
  try {
    fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `returns after query to database`);
    const rawData = await fragment.getData();
    logger.debug({ rawData }, 'data returned');
    let result;
    let convertType;
    if (fragment.formats.includes(extMimeType)) {
      convertType = extMimeType;
    } else if (extMimeType === false) {
      convertType = fragment.type;
    } else {
      return res
        .status(415)
        .json(
          createErrorResponse(404, `Can not convert ${fragment.type} to the required extension`)
        );
    }
    result = convertFragment(rawData, convertType);
    res.setHeader('content-type', convertType);
    return res.status(200).send(result);
  } catch (err) {
    logger.warn(`Error getting data for fragment ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting data for fragment'));
  }
};
module.exports.getIdInfo = async function (req, res) {
  const { id } = req.params;
  logger.info({ id }, `Start handling Get Fragment Info request `);
  let fragment;
  try {
    fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `returns after query to database`);
    return res.status(200).json(createSuccessResponse({ fragments: fragment }));
  } catch (err) {
    logger.warn(`Error getting data for fragment ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting data for fragment'));
  }
};
