var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var ObjectId = require('mongodb').ObjectId;
var builder = require('xmlbuilder'),
    extend  = require('extend'),
    https   = require('https'),
    moment  = require('moment'),
    path    = require('path'),
    url = require('url'),
    fileUpload = require('express-fileupload');
    parseString = require('xml2js').parseString;
    router.use(fileUpload());
var Carrier = mongoose.model('Carrier');
var User = mongoose.model('User');
var fs = require('fs-extra');
var Binary = require('mongodb').Binary;
//Used for routes that must be authenticated.
// function isAuthenticated (req, res, next) {
//     // if user is authenticated in the session, call the next() to call the next request handler 
//     // Passport adds this method to request object. A middleware is allowed to add properties to
//     // request and response objects
//     //allow all get request methods
//     if(req.method === "GET"){
// 		console.log("unauthenticated");	
//         return next();
//     }
//     if (req.isAuthenticated()){
// 		console.log("authenticated");
//         return next();
//     }
//     console.log(req.user);
// 	 return next();
//     // if the user is not authenticated then redirect him to the login page
//     // return res.redirect('login');
// };

//Register the authentication middleware
//router.use('/', isAuthenticated);
//signup request
router.post('/upload', function(req, res) {
  var sampleFile;
		if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
    sampleFile = req.files.file;
    //Below code is used to read the data from the file and send it to the UI and display
    // var base64 = (sampleFile.data.toString('base64'));
    // res.send(base64);        

    sampleFile.mv('./Content/Images/'+sampleFile.name, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send(sampleFile.name);
        }
    });
});
router.get('/deleteFile', function(req, res) {
  fs.remove('./Content/Images/'+req.query.fileName, function (err) {
    if (err)
    {
      return console.error(err);
    }
    res.send('success');
  })
});
router.get('/',function(req,res,next){	
	res.render('starter',{title:"ManiMean"});	
  });
  //Below router is used to call the DHL tracking post function
  router.get('/trackitem',function(req,res)
  {
      //console.log(req.params.msg);
    /... code to do your work .../
    //var url_parts = url.parse(req.url, true);
    //var query = url_parts.query;
    //var id = req.query.AWBNumber;

    //Start
    var self = this;
    self.AWBNumber = req.query.AWBNumber;
    self.outputdata = {};
      self.hosts = {
        staging: 'xmlpitest-ea.dhl.com',
        live: 'xmlpi-ea.dhl.com'
      };
      //The below path would be appended to the staging / live url
      //http://xmlpitest-ea.dhl.com/XMLShippingServlet
      self.path = 'XMLShippingServlet';
      //Make a json object to set the default values
      var defaults = {
        mode:          'staging',
        system:        'metric', // alternatively, 'imperial'
        userAgent:     'node-shipping-dhl',
        debug:         true,
        accountNumber: ''
      };
      //Required Parameters
      //var requiredParameters = ['siteId', 'password']

      function randomInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
      }

      /**
       * Randomly generates "A string, peferably number, to uniquely identify
       * individual messages. Minimum length must be 28 and maximum length is 32".
       */
      function generateMessageReference () {
        var numberOfDigits, randomDigits, digit;
        numberOfDigits = randomInt(28, 33);
        randomDigits = [];

        for (var i = 0; i < numberOfDigits; i++) {
          digit = randomInt(0, 10);
          randomDigits.push(digit)
        }

        return randomDigits.join('');
      }

      /**
       * @param {String}   body data to send via POST to DHL
       * @param {Function} callback function to call on error or return
       *                   of data from DHL
       */
      //function postToDHL Start
      function postToDHL (body, callback) {
        
        var request = https.request({
          host: 'xmlpitest-ea.dhl.com',
          path: self.path,
          method: 'POST',
          headers: {
            'Content-Length': body.length,
            'Content-Type':   'text/xml'
          }
        });

        request.write(body);

        request.on('error', function (error) {
          callback(error, null);
          res.error();
        });

        request.on('response', function (response) {
          var responseData = '';
          self.output=response.toString();
          response.on('data', function (data) {
            responseData += data.toString();
        self.output = responseData;
          });

          response.on('end', function () {
            var json;
            try {
                //Convert xml data to json object
            parseString(responseData, function (err, result) {
                json = result;
            });
              } catch (e) {
              if (self.options.debug) {
                console.log(e);
              }
              callback(new Error("unable to parse response into json"), null);
            }
        res.json(json);
          });
        });

        request.end();
      }
    //function postToDHL End

    var xmlDateFormat     = "YYYY-MM-DD",
        xmlDateTimeFormat = "YYYY-MM-DDThh:mm:ss";

    /**
     * @returns the authentication object to put at the top of the xml requests
     */
    function buildAuthenticationObject () {
      return {
        ServiceHeader: {
          MessageTime: moment().format(xmlDateTimeFormat),
            // TODO ??
            MessageReference: generateMessageReference(),
            SiteID:           'CIMGBTest',//self.options.siteId'',
            Password:         'DLUntOcJma'//self.options.password//,
            // PaymentType: 'T'
        }
      }
    }

    function concatKeyValuePair (xml, key, value) {
      var pair = {};
      pair[key] = value;
      return xml.concat(pair);
    }

  function buildTrackXML (data){
    var xml =[];
    xml = concatKeyValuePair(xml, 'Request', buildAuthenticationObject());
    xml = concatKeyValuePair(xml, 'LanguageCode', 'en');
    xml = concatKeyValuePair(xml, 'AWBNumber', self.AWBNumber);
    xml = concatKeyValuePair(xml, 'LevelOfDetails', 'ALL_CHECK_POINTS');
      xml = concatKeyValuePair(xml, 'PiecesEnabled', 'S');
    return xml;
  }

  var track = function (data, callback) {
      if (!callback) {
        throw new Error("no callback specified");
      }

      if (!data) {
        throw new Error("no data provided");
      }

      var body = builder.create({
        'req:KnownTrackingRequest': {
          "@xmlns:req":          "http://www.dhl.com",
          "@xmlns:xsi":          "http://www.w3.org/2001/XMLSchema-instance",
          "@xsi:schemaLocation": "http://www.dhl.com TrackingRequestKnown.xsd"//,
          // "schemaVersion":      "1.0"
        }
      }).ele(buildTrackXML(data));

      // if (self.options.debug) {
      //   var pretty = body.end({pretty: true});
      //   console.log("Ship request XML:");
      //   console.log(pretty);
      // }
      var pretty = body.end({pretty: true});
      body = body.end();

      postToDHL(body, callback);
    }

    track(req, function(req,callback) {
      self.outputdata = req;
    //callback();
  });
  //callback(self.outputdata);
});

//Become a carrier save, update and get method routes
//carrierPersonalSave
router.post('/carrierPersonalSave', function(req, res, done)
{
  Carrier.findOne({ 'username' : req.user.username }, function(err, exists)
  {
    if (!exists)
    {
      // if there is no carrier, create the carrier
      var newCarrier = new Carrier();
      if (req.user.username)
      {
        newCarrier.username = req.user.username;             
      }
      if (req.body.personal)
      {
        newCarrier.personalinfo = req.body.personal;        
      }
      // save the carrier
      newCarrier.save(function(err)
      {
        if (err)
        {
          console.log('Error in Saving carrier: '+err);  
          res.send(err); 
        }
        console.log(newCarrier.username + ' Data saved successfully!');    
        //Upon successful carrier, update is_carrier flag to true in the user table
        User.findOne({ 'username' : req.user.username }, function(err, p)
        {
          if (!p)
            {
              return next(new Error('User not found'));
            }
          else
           {
             // do your updates here
             p.is_carrier = true;
             p.save(function(err)
             {
               if (err)
               {
                 console.log('error');
                 res.send(err);
               }
               else
               {
                 console.log('success');
                 res.send("success");
               }
             });
           }
        });
      });
    }
    else
    {
      // do update for the exisitng carrier
      if (req.user.username)
      {
        exists.username = req.user.username;             
      }
      if (req.body.personal)
      {
        exists.personalinfo = req.body.personal;        
      }
      exists.save(function(err)
      {
        if (err)
        {
          console.log('error');
          res.send(err);
        }
        else
        {
          console.log('success');
          res.send("success");
        }
      });
    }
  });
});
//carrierCommunicationSave
router.post('/carrierCommunicationSave', function(req, res, done){
      Carrier.findOne({ 'username' : req.user.username }, function(err, exists)
      {
        // do update for the exisitng carrier
          if (req.body.communication){
              exists.communication = req.body.communication;          
          }
          exists.save(function(err)
          {
            if (err)
              {
                console.log('error');
                res.send(err);
              }
            else
              {
                console.log('success');
                res.send("success");
              }
          });
      });
});
//carrierAboutyouSave
router.post('/carrierAboutyouSave', function(req, res, done){
    Carrier.findOne({ 'username' : req.user.username }, function(err, exists)
    {
        // do update for the exisitng carrier
          if (req.body.aboutyou)
          {
            exists.aboutyou = req.body.aboutyou;           
          }
          exists.save(function(err)
          {
            if (err)
            {
             console.log('error');
             res.send(err);
            }
            else
            {
             console.log('success');
             res.send("success");
            }
          });
      });
});
//carrierProfessionSave
router.post('/carrierProfessionSave', function(req, res, done){
    Carrier.findOne({ 'username' : req.user.username }, function(err, exists)
    {
       // do update for the exisitng carrier
          if (req.body.profession)
          {
            exists.profession = req.body.profession;            
          }
          exists.save(function(err)
          {
            if (err)
            {
              console.log('error');
              res.send(err);
            }
            else
            {
              console.log('success');
              res.send("success");
            }
          });
      });
});
//carrierVerificationSave
router.post('/carrierVerificationSave', function(req, res, done){
  Carrier.findOne({ 'username' : req.user.username }, function(err, exists)
  {
      if (req.body.verification)
      {
        exists.verification = req.body.verification;           
      }
      exists.save(function(err)
      {
        if (err)
        {
          console.log('error');
          res.send(err);
        }
        else
        {
          console.log('success');
          res.send("success");
        }
      });
  });
});
//carrierDocumentsSave
router.post('/carrierDocumentsSave', function(req, res, done){
  Carrier.findOne({ 'username' : req.user.username }, function(err, exists)
  {
    if (req.body.documents)
    {
      //loop through the documents list and convert the files to binary format and then store them onto mongo
      req.body.documents[0].forEach(function(element) {
        if(element.file)
        {
          var fileAfterRead = fs.readFileSync('./Content/Images/'+element.file);
          var binaryData = {};
          binaryData.bin = Binary(fileAfterRead);
          element.passport = binaryData.bin;
        }
      }, this);
      //Below code will convert conde of conduct file to binary
      req.body.documents[4].forEach(function(element) {
        if(element.conduct)
        {
          var fileAfterRead = fs.readFileSync('./Content/Images/'+element.conduct);
          var binaryData = {};
          binaryData.bin = Binary(fileAfterRead);
          element.conduct = binaryData.bin;
        }
      }, this);
      exists.documents = req.body.documents;        
    }
    exists.save(function(err)
    {
      if (err)
      {
        console.log('error');
        res.send(err);
      }
      else
      {
        console.log('success');
        res.send("success");
      }
    });
  });
});
//carrierGet
router.get('/carrierGet', function(req, res, done){
    Carrier.findOne({ 'username' :  req.user.username }, 
    function(err, carrier) {
        if (err)
            res.send(err);
        if (!carrier){
            console.log('User Not Found with userId '+req.user.username);
            res.send("user not found");               
        }
        // before sending carrier list object, conver the files back to normal format and store them in a local drive
        
        carrier._doc.documents[0].forEach(function(element) {
          if(element.passport)
          {
            //extract the country name from the object and assign it to the name of dropdown
            if(element.name){element.name = element.name.name;}
            //Create the file with the same name
            var createfile = './Content/Images/'+element.file;
              fs.ensureFile(createfile, function (err) {
                // file has now been created, including the directory it is to be placed in
                fs.writeFile('./Content/Images/'+element.file, element.passport.buffer, function(err){
                  if (err) throw err;
                  console.log('Sucessfully saved!');
                });
              })
          }
        }, this);
        res.send(carrier);
    });
});
//module.exports
module.exports = router;
