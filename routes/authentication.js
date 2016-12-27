var express = require('express');
var router = express.Router();

module.exports = function(passport){
	//sends successful login state back to view(angular)
	router.get('/success',function(req,res){
		res.send({state: 'success', user: req.user ? req.user: null});	
	});
	//send failure login state back to view(angular)
	router.get('/failure',function(req,res){
		res.send({state: 'failure',user:null,message:"Invalid username or password!"});
	});
	//send failure register state back to view(angular)
	router.get('/failureregister',function(req,res){
		res.send({state: 'failure',user:null,message:"User already exists with given email!"});
	});
	//login requeset
	router.post('/login',passport.authenticate('login',{
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//signup request
	router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failureregister'
    }));
	
	//logout request
	router.get('/signout', function(req, res) {
		req.session.user = null;
        req.logout();
        res.redirect('/');
    });
	return router;
}