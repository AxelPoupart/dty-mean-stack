import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    manager: {
        type: String
    },
    status: {
        type: String
    }

});


const User = module.exports = mongoose.model('User', UserSchema);


module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

