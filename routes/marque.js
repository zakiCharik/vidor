const express = require('express');
const router = express.Router();
//Encryting password
// const bcrypt = require('bcrypt');

//model
var Marque = require('../models/Marque');
var Modele = require('../models/Modele');



//--------------------API REQUEST
// Mobile capabilities

// GET /Cars
router.get('/',function(req, res, next) {
  //...
  console.log('REQ - GET : Marque');
  Marque.find({}, (err, Marques) => {
    res.send(Marques);
  });
});



// GET /Cars/:id
router.get('/make/:title',function(req, res, next) {
  //...
  console.log('REQ - GET : VIEW - API');
  console.log(req.params);
  Marque.findByTitle(req.params.title, (err, foundMarque) => {
    Modele.findByMarque(foundMarque[0].title, (errFoundById, modeleFound) =>{
      res.send(modeleFound);
    });
  });
});

// Mobile capabilities
//--------------------API REQUEST

module.exports = router;
