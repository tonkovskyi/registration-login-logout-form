var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/',async function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.country || !personInfo.realname || !personInfo.birthdate){
		res.send();
	} else {
		
			// await User.findOne({email:personInfo.email},async function(err,data){
			await User.findOne({$or:[{'email':personInfo.email}, {'username':personInfo.username}]},async function(err,data){
				if(!data){
					var c;
					await User.findOne({},async function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username:personInfo.username,
							realname:personInfo.realname,
							password:personInfo.password,
							country:personInfo.country,
							birthdate:personInfo.birthdate,
							
						});

						await newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					req.session.userId = c;

					res.send({
						"Success":"You are regestered,You can login now."
					});
				}else{
					res.send({"Success":"Email or username is already exist."});
				}

			});
		}
	}
);
 
router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({$or:[{'email':req.body.email}, {'username':req.body.email}]},function(err,data){

	// User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	// console.log(`userId`)
	console.log(req.session.userId);
	// User.findOne({unique_id:req.query.userId | req.session.userId},function(err,data){

	User.findOne({unique_id:req.session.userId},function(err,data){
		// console.log("data");
		// console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

module.exports = router;