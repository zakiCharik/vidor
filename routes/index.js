const express = require('express');
const router = express.Router();
//Encryting password
const bcrypt = require('bcrypt');

//model
var Car = require('../models/Car');
var Annoncor = require('../models/Annoncor');

//midlleware ensureLogin
function ensureLogin(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.render('pages/login',{
      message : null,
      user : null,
    });
  }
};



// 
router.get('/',function(req, res, next) {
  //...
  console.log('REQ - GET : INDEX');
  console.log('User session', req.session.user);
  Car.find({}, (err, Cars) => {
	console.log('User Cars', Cars);

    res.render('pages/index',{
      listCars : Cars,
      Cars : JSON.stringify(Cars),
      user : req.session.user
    });
  });
});


//GET - LOGIN PAGE
router.get('/login',function(req, res, next) {

  res.render('pages/login', {
  	message:'',
  	user: req.session.user
  });
});

//GET - LOGIN PAGE
router.get('/callback',function(req, res, next) {
	console.log(req);	
  res.render('pages/login', {
  	message:'',
  	user: req.session.user
  });
});

//GET - LOGIN PAGE
router.post('/saveSession',function(req, res, next) {
	var profile = req.body.profil;
	console.log(profile);
	req.session.user = {	
		id : profile.Eea,
		name : profile.ig,
		firstname : profile.ofa,
		lastname : profile.wea,
		image : profile.Paa,
		email : profile.U3,
	};
    Annoncor.findByEmail(email,(errAuth, foundUser)=>{

    	if ( foundUser.length == 0 || foundUser == undefined || foundUser == null ) {
		  	Annoncor.create({
			      lastname: req.session.user.lastname,
			      firstname: req.session.user.firstname,
			      password: '',
			      email: req.session.user.email,
			      emplacement: '',
			      lat: '',
			      lng: '',
			      image: req.session.user.image,
			      whatapp: '',
			      phone: '',
			    },function(errCreate,rsult){//
		  		if (rsult.insertId != undefined) {
				    //Create Annoncor
					res.redirect('/account');      			
		  		};
		  	});
    	};

	});
});

//GET - LOGIN PAGE
router.get('/signup',function(req, res, next) {

  res.render('pages/signup', {
  	message:'',
  	user: req.session.user
  });
});

//POST - LOGIN
router.post('/login',function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  console.log
  if (email != undefined) {
    //Verify 
    Annoncor.authenticate(email,password,(err, foundUser)=>{
      //If user does exist
      console.log('err',err);
      console.log('foundUser',foundUser);
      req.session.user = foundUser; 	

      if (foundUser != undefined && foundUser != null ) {
	    Car.findByAnnoncorId(foundUser.id, (errAnnoncorFind, resAnnoncerFind)=>{

		    console.log('resAnnoncerFind',resAnnoncerFind);
			res.render('pages/account', {
		        listCars : resAnnoncerFind,
				message:'',
				user: req.session.user
			});      			
	    });
      }
      //If user does not exist
      else{
        //Create Car
        res.render('pages/login',{
          user : req.session.user,
        });
      }
    });    
  };	
});

//GET - ACCOUNT
router.get('/account', ensureLogin,function(req, res){
	var user = req.session.user;
	console.log(user);
	Car.findByAnnoncorId(user.id, (errAnnoncorFind, resAnnoncerFind)=>{
		console.log('resAnnoncerFind',resAnnoncerFind);
		res.render('pages/account', {
		  listCars : resAnnoncerFind,
		  message:'',
		  user: req.session.user
		});           
	});  
});

//GET - ACCOUNT
router.get('/logout', ensureLogin,function(req, res){
	req.session.user = null;
    res.render('pages/login',{
      message : null,
      user : null,
    });
});

//POST - LOGIN
router.post('/signup',function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	password = bcrypt.hashSync(password,10);

	console.log(req.body);
	if (email != undefined) {
	    Annoncor.findByEmail(email,(errAuth, foundUserByEmail)=>{
	    	var findByEmail;
			console.log('Tail',foundUserByEmail.length );
	    	if (foundUserByEmail.length > 0) {
		    	findByEmail = foundUserByEmail[0];

	    	}else{
		    	findByEmail = foundUserByEmail;
	    	};
	    	if (findByEmail == undefined || findByEmail == null ) {
			    //Verify 
			    Annoncor.authenticate(email, password,(errAuth, foundUser)=>{
			      //If user does exist
			      if (foundUser == false || foundUser == null){
			      	var toCreateUser = {
					      lastname: req.body.lastname,
					      firstname: req.body.firstname,
					      password: password,
					      email: req.body.email,
					      emplacement: req.body.emplacement,
					      lat: req.body.lat,
					      lng: req.body.lng,
					      whatapp: req.body.whatapp,
					      phone: req.body.phone,
					      image: '',
					    }	

			      		Annoncor.create(toCreateUser,
					    	function(errCreate,rsult){//
				      		if (errCreate == null) {
				      			req.session.user = toCreateUser;
				      			req.session.user.id = rsult.insertId;
							    //Create Annoncor
								res.render('pages/account', {
									message:'Votre profile est crée avec succés',
									user: req.session.user
								});      			
				      		};
						});

			      }
			      //If user does not exist
			      else{
			        //Create Car
			        res.render('pages/login',{
			          message : 'User Aleardy exist, try connecting',
			          user : req.session.user,
			        });
			      }
			    });    
		    }else{
		    	req.session.user = findByEmail;
			    //Create Annoncor
				res.redirect(200,'/account'); 	    	
		    };
		});    	
	};
});


module.exports = router;
