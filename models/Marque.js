var mySqlClient = require('../db');


var Marque = {


	create: function(car,callback){
		  	var insertQuery = "INSERT INTO marques SET ?";
		  	//Crypt the password
		    var insert = {
		      title: car.title,
		      logo: car.logo,
		    };
		    mySqlClient.query(insertQuery, insert, function (err, results) {
				if(err) throw err;
				console.log("1 carads record inserted, ID: " + results.insertId);
				callback(err,results);
		    });		
	},

	find: function({},callback){
			var cberror = null,
				selectQuery = 'SELECT * FROM marques';

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
			var selectQuery = 'SELECT * FROM marques where id = '+id;

			mySqlClient.query(selectQuery, function(err, row) {
				if(err) throw err;
				if (row !== undefined || row !== null) {
					callback(err,row);
				};

			});		
		}
	},

	findByTitle: function(title,callback){
		if (title === undefined || title === '') {
			return null;
		}else{
			var selectQuery = 'SELECT * FROM marques where title = "'+title+'"';
			mySqlClient.query(selectQuery, function(err, rows) {
				if(err) throw err;
				if (rows !== undefined || rows !== null) {
					callback(err,rows);
				};

			});		
		}
	}
}



module.exports = Marque;
