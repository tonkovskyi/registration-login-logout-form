var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

userSchema = new Schema( {
	unique_id: Number,
	email: {
		type: String,
	},
	username: {
		type: String,
	},
	realname: String,
	password: String,
	country: String,
	birthdate: String,
	registratinDate: {
		type: Date,
		default: Date.now
	}
}),
User = mongoose.model('User', userSchema);

module.exports = User;