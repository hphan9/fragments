// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
var { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async(req,res)=>{
logger.info(`start handling put request`);
if (!Buffer.isBuffer(req.body)) {
  return res.status(403).json(createErrorResponse(415, 'Can\'t post fragment'));
}
try{
logger.info(`get fragments data`);
}catch(err){
  logger.error(err);
  return res.status(403).json(createErrorResponse(415, err));
}
};
