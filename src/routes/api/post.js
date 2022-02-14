// src/routes/api/get.js

const {Fragment}=  require('../../model/fragment');
var {createSuccessResponse, createErrorResponse}= require('../../response');
const logger = require('../../logger');
// Support sending various Content-Types on the body up to 5M in size


// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`

module.exports = async (req, res) => {
  logger.debug(`Start handling post request`);
  if(!Buffer.isBuffer(req.body)){
    res.status(415).json(createErrorResponse(415, 'Cannot post fragment'));
  }
    try{
      const fragment = new Fragment({ ownerId: 'emily@gmail.com', type: req.get('content-type') });
      await fragment.save();
      await fragment.setData(req.body);
      console.log(`new fragment created ${fragment}`);
      res.set('Location', `${req.url}/${fragment.id}`);
      res.status(201).json(createSuccessResponse(
       {fragment}
      ));
    }catch(err){
      res.status(420).json(createErrorResponse(420, err));
    }
  
};
