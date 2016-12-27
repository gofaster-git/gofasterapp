var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var carrierSchema = new Schema({
	username: {type: String, ref: 'User', required: true},
	// profilepic: { data: Buffer, contentType: String },
	personalinfo: Array,
	communication: Array,
	aboutyou: Array,
	profession: Array,
	verification: Array,
	documents: Array,
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

mongoose.model('Carrier', carrierSchema);
var Carrier = mongoose.model('Carrier');
exports.findById = function(id, callback){
	User.findById(id, function(err, carrier){
		if(err){
			return callback(err);
		}
		return callback(null, carrier);
	});
}

