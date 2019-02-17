const express           = require('express');
const router            = express.Router();
const nodemailer        = require('nodemailer');
const Nexmo             = require('nexmo');
const passport          = require('passport');
const secured           = require('../lib/secured');
const ensureLoggedIn    = require('connect-ensure-login').ensureLoggedIn();
const nexmo             = new Nexmo({
  apiKey: '3b780a33',
  apiSecret: 'AJmSZAXMLKfhCN84'
})


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'z.charik@gmail.com',
    pass: 'Thewitcher9122'
  }
});

//model
var Car = require('../models/Car');
var Annoncor = require('../models/Annoncor');




// GET /Cars
router.get('/', function(req, res, next) {
  //...
  console.log('REQ - GET : CarS');
  Car.find({}, (err, Cars) => {
    console.log(Cars)
    res.render('pages/list',{
      Cars : Cars,
      user : req.session.user
    });
  });
  
});


// GET /Cars/:id
router.get('/view/:id',function(req, res, next) {
  //...
  console.log('REQ - GET : Car/View');

  Car.findById(req.params.id, (err, foundCar) => {
    Annoncor.findById(foundCar[0].annoncor, (errFoundById, annoncorFound) =>{
      //
      var user, annoncor;

      user = req.user;
      
      if (annoncorFound == undefined || annoncorFound == null ) {
        annoncor = null;
      }else{
        annoncor = annoncorFound[0];        
      };

      console.log('User',req.session.user);
      console.log('Car',foundCar);
      console.log('annoncorFound',annoncorFound);
      console.log('req.params.id',req.params.id);
      //
      res.render('pages/view',{
        ads : foundCar[0],
        annoncor : annoncor,
        user : user
      });

    });
  });

});


// GET /Cars/:id/edit
router.get('/edit/:id',  ensureLoggedIn,function(req, res, next) {
  //...

  Car.find({}, (err, Cars) => {
    res.send({

      Car : Cars,
      user : req.user,
    });
  });
  
});



// POST /create
router.get('/add',  ensureLoggedIn,function(req, res, next) {
  //...
  console.log('REQ - GET : Car/ADD');
  //Create Car
  res.render('pages/add',{
    message : null,
    cars : null,
    user : req.user,
  });

});

// POST /create
router.post('/add',ensureLoggedIn,function(req, res, next) {
  //..
  console.log('REQ - POST : Car/ADD');
  console.log('req.body',req.body);
  if (req.body != undefined) {
    //SMS AND EMAIL
    var phone, email;
    phone = req.body.phone;
    email = req.body.email;

    // var mailOptions = {
    //   from: 'z.charik@gmail.com',
    //   to: email,
    //   subject: 'Inscription VEDOR.MA, vendre ou achtez votre voiture mab9ach s3ib',
    //   text: 'Merci pour votre inscription, l\'équipe de VEDOR.MA vous souhaite le bienvenu', // plain text body
    //   html: '<b>Merci pour votre inscription, l\'équipe de VEDOR.MA vous souhaite le bienvenu</b>' // html body
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });
    //SMS NEXMO
    const from = 'VEDOR.MA';
    const to = phone;
    const text = 'Merci pour votre inscription, l\'équipe de VEDOR.MA vous souhaite le bienvenu '+req.body.name;
    nexmo.message.sendSms(from, phone, text);
    //SMS NEXMO
    var mycar = {
      title: req.body.title,
      description: req.body.description,
      constructeur: req.body.maison,
      model: req.body.model,
      marque: req.body.maison,
      manufactueyear: req.body.manufactueyear,
      bodytype: req.body.bodytype,
      tranmission: req.body.transmission,
      drivetype: req.body.drivetype,
      abs: req.body.check_abs,
      airbag: req.body.check_airbags,
      coolbox: req.body.check_coolbox,
      airconditioning: req.body.check_airconditiong,
      powerstreering: req.body.check_powersteering,
      dedouanementanne: req.body.dedouanementanne,
      kilometrage: req.body.kilometrage,
      carburant: req.body.carburant,
      puissancefiscal: req.body.puissancefiscal,
      prixvignette: parseFloat(req.body.prixvignette),
      prix: parseFloat(req.body.price),
      vignetteannencours: true,
      consomation: req.body.consomation, //FLOAT
      accidente: req.body.accidente,
      typepapierdevente: req.body.typepapierdevente,
      emplacement: req.body.emplacement,
      lat: req.body.lat,
      lng: req.body.lng,
      video: req.body.stm_video[0], // youtube url
      photo: '-',
      status_ads: 'publier',
      date_publication: Date.now(),
      boosttype: '-',
      colorcaroursserie: '-',
      jointes: '-',
      bluethoot: 1,
      amfmstereo: 1,
      backupcamera: 1,
      annoncor: req.session.user.id, // ID ANNONCEUR
    };
    //Create Car
    Car.create(mycar,  (err, Cars) => {
        res.render('pages/add',{
          message : 'Votre Annonce est publié, dans l\'attente de confirmation du contenu',
          cars : Cars,
          user : req.session.user
        });
    });
      
  }
  else{
    res.render('pages/add',{
      message : 'Les informations saisie ne sont pas correcte, vérifier vos donnée et resseyer',
      cars : null,
      user : req.session.user
    });    
  };


});

module.exports = router;
