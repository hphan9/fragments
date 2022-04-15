// src/routes/api/get-id.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const mime = require('mime-types');
const md = require('markdown-it')();
const { createErrorResponse } = require('../../response');
//function convert fragment to supported type
const convertFragment = (data, mimeType) => {
  let result = data;
  if (mimeType == 'text/html') {
    const stringData = data.toString();
    result = md.render(stringData);
  }
  return result;
};
module.exports = async function (req, res) {
  let { id } = req.params;
  logger.info({ id }, `Start handling Get request `);
  let extMimeType = mime.lookup(id);
  if (id.includes('.')) {
    id = id.replace(/\..*/, '');
  }
  try {
    let fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `metadata returns after querying the database`);
    const rawData = await fragment.getData();
    logger.debug({ rawData }, 'fragment data returns after querying the database');
    let result;
    let convertType;
    if (fragment.formats.includes(extMimeType)) {
      convertType = extMimeType;
    } else if (extMimeType === false) {
      convertType = fragment.type;
    } else {
      logger.warn(`Can not convert ${fragment.type} to ${extMimeType} `);
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
    logger.error(`Error getting data for fragment ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting data for fragment'));
  }
};
