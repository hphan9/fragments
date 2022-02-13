// src/routes/api/get.js
const Fragment = require('../../model/fragment');
var {createSuccessResponse}= require('../../response');
/**
 * Get a list of fragments for the current user
 */
 module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  
  let data= {fragments:[]};
  res.status(200).json(createSuccessResponse(data));
};
