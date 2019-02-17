var mySqlClient = require('../db');
// const bcrypt = require('bcrypt');


var Annoncor = {


	create: function(annoncor,callback){
		  	var insertQuery = "INSERT INTO annoncors SET ?";
		  	//Crypt the password
		    var insert = {
		      lastname: annoncor.lastname,
		      firstname: annoncor.firstname,
		      password: annoncor.password,
		      email: annoncor.email,
		      emplacement: annoncor.emplacement,
		      lat: annoncor.lat,
		      lng: annoncor.lng,
		      phone: annoncor.phone,
		      whatapp: annoncor.whatapp,
		      whatapp: annoncor.whatapp,
		      confirmed_email: annoncor.confirmed_email,
		      date_join: Date.now(),
		      image: annoncor.image,
		    };
		    mySqlClient.query(insertQuery, insert, function (err, results) {
				if(err) throw err;
				console.log("1 annoncorads record inserted, ID: " + results.insertId);
				callback(err,results);
		    });		
	},

	find: function({},callback){
			var cberror = null,
				selectQuery = 'SELECT * FROM annoncors';

				mySqlClient.query(selectQuery,(err, rows)=>{
					if(err) throw err;
					if (rows !== undefined || rows !== null) {
						callback(err,rows);
					};

				});

	},

	findById: function(id,callback){
		if (id === undefined || id === '') {
			return null;
		}else{
			var selectQuery = 'SELECT * FROM annoncors where id = '+id;

			mySqlClient.query(selectQuery, function(err, row) {
				if(err) throw err;
				if (row !== undefined || row !== null) {
					callback(err,row);
				};

			});		
		}
	},

	findByEmail: function(email,callback){
		if (email === undefined || email === '') {
			return null;
		}else{
			var selectQuery = 'SELECT * FROM annoncors where email = '+email;

			mySqlClient.query(selectQuery, function(err, row) {
				if(err) throw err;
				if (row !== undefined || row !== null) {
					callback(err,row);
				};

			});		
		}
	},
	
	authenticate: function(email, password,callback){
		// Annoncor.findByEmail(email, (err, user) => {
		// 	if (err) {
		// 		return callback(err, false);
		// 	}; 
		// 	if (user[0] != undefined && user[0] != null) {
		// 		bcrypt.compare(password, user[0].password, function (err, result) {
		// 			if (result === true) {
		// 				return callback(null, true,user[0]);
		// 				return callback(null, true,user[0]);
		// 			} else {
		// 			  return callback(err, false,null);
		// 			}
		// 		});				
		// 	}else{
		// 		return callback(err, false,null);				
		// 	};
		// });

	},

	findByEmail: function(email,callback){
		if (email === undefined || email === '') {
			return null;
		}else{
			var selectQuery = 'SELECT * FROM annoncors where email = "'+email+'"';
			mySqlClient.query(selectQuery, function(err, rows) {
				if(err) throw err;
				if (rows !== undefined || rows !== null) {
					callback(err,rows);
				};

			});		
		}
	},

	exist: function(email,callback){
		if (email === undefined || email === '') {
			return null;
		}else{
			var selectQuery = 'SELECT * FROM annoncors where email = "'+email+'"';
			mySqlClient.query(selectQuery, function(err, rows) {
				if(err) throw err;
				if (rows !== undefined || rows !== null) {
					callback(err,true);
				}else{
					callback(err,false);					
				};

			});		
		}
	}
}



module.exports = Annoncor;
