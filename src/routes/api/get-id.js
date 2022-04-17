// src/routes/api/get-id.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const mime = require('mime-types');
const { createErrorResponse } = require('../../response');
//function convert fragment to supported type

module.exports = async function (req, res) {
  let { id } = req.params;
  logger.info({ id }, `Start handling Get request `);
  //change the logic here
  // if request has extMimeType same as the current type : don't do conversion
  // if request does not has ext: don't do conversion
  let convertType;
  try {
    if (id.includes('.')) {
      //note jpg ext always convert to image/jpeg
      const extMimeType = mime.lookup(id);
      if (extMimeType === false) {
        logger.warn(`The request ext is not a valid type`);
        return res
          .status(415)
          .json(createErrorResponse(415, `The request ext is not a valid type`));
      }
      convertType = extMimeType;
      logger.debug({ convertType }, `convert type`);
      id = id.replace(/\..*/, '');
    }
    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `metadata returns after querying the database`);
    if (!convertType || convertType == fragment.type) {
      const result = await fragment.getData();
      res.setHeader('content-type', fragment.type);
      return res.status(200).send(result);
    }
    if (!fragment.formats.includes(convertType)) {
      logger.warn(`Can not convert ${fragment.type} to the request extension`);
      return res
        .status(415)
        .json(
          createErrorResponse(415, `Can not convert ${fragment.type} to the request extension`)
        );
    }
    const result = await fragment.convertData(convertType);
    res.setHeader('content-type', convertType);
    return res.status(200).send(result);
  } catch (err) {
    logger.error(`Error getting data for fragment ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting data for fragment'));
  }
};
