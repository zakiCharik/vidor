var mySqlClient = require('../db');


var car = {


	create: function(car,callback){
		  	var insertQuery = "INSERT INTO cars SET ?";
		  	//Crypt the password
		    var insert = {
		      title: car.title,
		      description: car.description,
		      constructeur: car.constructeur,
		      model: car.model,
		      marque: car.marque,
		      manufactueyear: car.manufactueyear,
		      bodytype: car.bodytype,
		      tranmission: car.tranmission,
		      drivetype: car.drivetype,
		      abs: car.abs,
		      airbag: car.airbag,
		      coolbox: car.coolbox,
		      airconditioning: car.airconditioning,
		      powerstreering: car.powerstreering,
		      dedouanementanne: car.dedouanementanne,
		      kilometrage: car.kilometrage,
		      carburant: car.carburant,
		      puissancefiscal: car.puissancefiscal,
		      prixvignette: car.prixvignette,
		      prix: car.prix,
		      vignetteannencours: car.vignetteannencours,
		      consomation: car.consomation, //FLOAT
		      accidente: car.accidente,
		      typepapierdevente: car.typepapierdevente,
		      emplacement: car.emplacement,
		      lat: car.lat,
		      lng: car.lng,
		      video: car.video, // youtube url
		      photo: car.photo,
		      boosttype: car.boosttype,
		      colorcaroursserie: car.colorcaroursserie,
		      jointes: car.jointes,
		      bluethoot: car.bluethoot,
		      status_ads: car.status_ads,
		      date_publication: car.date_publication,
		      amfmstereo: car.amfmstereo,
		      backupcamera: car.backupcamera,
		      annoncor: car.annoncor, // ID ANNONCEUR
		    };
		    mySqlClient.query(insertQuery, insert, function (err, results) {
				if(err) throw err;
				console.log("1 carads record inserted, ID: " + results.insertId);
				callback(err,results);
		    });		
	},

	find: function({},callback){
			var cberror = null,
				selectQuery = 'SELECT * FROM cars';

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
			var selectQuery = 'SELECT * FROM cars where id = '+id;

			mySqlClient.query(selectQuery, function(err, row) {
				if(err) throw err;
				if (row !== undefined || row !== null) {
					callback(err,row);
				};

			});		
		}
	},

	findByAnnoncorId: function(id,callback){
		if (id === undefined || id === '') {
			return null;
		}else{
			var selectQuery = 'SELECT * FROM cars where annoncor = '+id;

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
			var selectQuery = 'SELECT * FROM cars where title = "'+title+'"';
			mySqlClient.query(selectQuery, function(err, rows) {
				if(err) throw err;
				if (rows !== undefined || rows !== null) {
					callback(err,rows);
				};

			});		
		}
	}
}



module.exports = car;
