const express           = require('express');
const router            = express.Router();
const passport          = require('passport');
var secured             = require('../lib/secured');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
//Encryting password
// const bcrypt = require('bcrypt');

//model
var Car = require('../models/Car');
var Annoncor = require('../models/Annoncor');



// 
router.get('/',function(req, res, next) {
  //...
  console.log('REQ - GET : INDEX');
  console.log('User session', req.user);
  Car.find({}, (err, Cars) => {
	console.log('User Cars', Cars);

    res.render('pages/index',{
      listCars : Cars,
      Cars : JSON.stringify(Cars),
      user : req.user
    });
  });
});


//GET - LOGIN PAGE
// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  console.log(req.user);

  res.redirect('/');
});

//GET - LOGIN PAGE

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function (err) {
		if (err) { return next(err); }
		const returnTo = req.session.returnTo;
		delete req.session.returnTo;
		var email = req.user.emails[0].value;
        Annoncor.exist(email,(errAuth, does_Exist)=>{
        	if (!does_Exist) {
        		var this_user = {
				  lastname: req.user.nickname,
				  firstname: req.user.nickname,
				  password: 'passwordless',
				  email: req.user.emails[0].value,
				  confirmed_email: req.user.email_verified,
				  emplacement: '',
				  lat: '',
				  lng: '',
				  image: req.user.picture,
				  whatapp: '',
				  phone: '',
				};
				Annoncor.create(this_user,
				function(errCreate,rsult){//
					if (rsult.insertId != undefined) {
						req.session.user = this_user;
						req.session.user.id = rsult.insertId;
				    	//Create Annoncor
				        res.redirect(returnTo);
				    }
				});        		
        	}else{
			    Annoncor.findByEmail(email,(errAuth, foundUser)=>{
			    	console.log(foundUser);
					req.session.user = req.user;
					req.session.user.id = foundUser.id;
			        res.redirect(returnTo);
			    });

        	}
        });
      //check if user persisted and do it if not
    });
  })(req, res, next);
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
    Annoncor.exist(email,(err, exist)=>{
    	if (exist == true) {
		    Annoncor.authenticate(email,password,(errAuth, isexist,foundUser)=>{
		    	if (isexist) {
					req.session.user = foundUser; 	
					Car.findByAnnoncorId(foundUser.id, (errAnnoncorFind, resAnnoncerFind)=>{
						res.render('pages/account', {
							listCars : resAnnoncerFind,
							message:'',
							user: req.session.user
						});      			
					});		    		
		    	}else{
				  res.render('pages/login', {
				  	message:'Mot de passe incorrect',
				  	user: req.session.user
				  });  		    		
		    	};
		    });      		
    	}else{
			  res.render('pages/signup', {
			  	message:'Email non trouvé enregistrez-vous',
			  	user: req.session.user
			  });  		
    	};

    });
  
  };	
});

//GET - ACCOUNT
router.get('/account',  ensureLoggedIn,function(req, res){
	var user = req.user;
	console.log(user);
	// Car.findByAnnoncorId(user.id, (errAnnoncorFind, resAnnoncerFind)=>{
	// 	console.log('resAnnoncerFind',resAnnoncerFind);
	// 	res.render('pages/account', {
	// 	  listCars : resAnnoncerFind,
	// 	  message:'',
	// 	  user: user
	// 	});           
	// });  
});

//GET - ACCOUNT
// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//POST - LOGIN
router.post('/signup',function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	// password = bcrypt.hashSync(password,10);

	console.log(req.body);
	// if (email != undefined) {
	//     Annoncor.findByEmail(email,(errAuth, foundUserByEmail)=>{
	//     	var findByEmail;
	// 		console.log('Tail',foundUserByEmail.length );
	//     	if (foundUserByEmail.length > 0) {
	// 	    	findByEmail = foundUserByEmail[0];

	//     	}else{
	// 	    	findByEmail = foundUserByEmail;
	//     	};
	//     	if (findByEmail == undefined || findByEmail == null ) {
	// 		    //Verify 
	// 		    Annoncor.authenticate(email, password,(errAuth, isexist,foundUser)=>{
	// 		      //If user does exist
	// 		      if (foundUser == false || foundUser == null){
	// 		      	var toCreateUser = {
	// 				      lastname: req.body.lastname,
	// 				      firstname: req.body.firstname,
	// 				      password: password,
	// 				      email: req.body.email,
	// 				      emplacement: req.body.emplacement,
	// 				      lat: req.body.lat,
	// 				      lng: req.body.lng,
	// 				      whatapp: req.body.whatapp,
	// 				      phone: req.body.phone,
	// 				      image: '',
	// 				    }	

	// 		      		Annoncor.create(toCreateUser,
	// 				    	function(errCreate,rsult){//
	// 			      		if (errCreate == null) {
	// 			      			req.session.user = toCreateUser;
	// 			      			req.session.user.id = rsult.insertId;
	// 						    //Create Annoncor
	// 							res.render('pages/account', {
	// 								message:'Votre profile est crée avec succés',
	// 								user: req.session.user
	// 							});      			
	// 			      		};
	// 					});

	// 		      }
	// 		      //If user does not exist
	// 		      else{
	// 		        //Create Car
	// 		        res.render('pages/login',{
	// 		          message : 'User Aleardy exist, try connecting',
	// 		          user : req.session.user,
	// 		        });
	// 		      }
	// 		    });    
	// 	    }else{
	// 	    	req.session.user = findByEmail;
	// 		    //Create Annoncor
	// 			res.redirect(200,'/account'); 	    	
	// 	    };
	// 	});    	
	// };
});


module.exports = router;
