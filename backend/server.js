import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



import Issue from './models/Issue';
import User from './models/User';

import { INSPECT_MAX_BYTES } from 'buffer';
import { runInNewContext } from 'vm';

//Connect to mongoDB server
mongoose.connect('mongodb://localhost/back-issues');
mongoose.set('debug', true);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!')
});

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

require('./passport')(passport)

//_____________Issues__________________//

router.route('/back-issues/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err)
            console.log(err);
        else
            res.json(issues);
    });
});

router.route('/back-issues/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    });
});

router.route(`/back-issues/issues/search-user/:user`).get( (req, res) => {
    const user = req.params.user;
    Issue.find( {responsible: user}, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    });
});

router.route(`/back-issues/issues/search-title/:term`).get((req, res) => {
    const term = req.params.term;
    Issue.find( {title: { $regex: term, $options: 'i'} }, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    });
});

router.route('/back-issues/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue': 'Added successfully!'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/back-issues/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/back-issues/issues/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');

    });
});


//__________________________________________________________________//


//____________________________Users_________________________________//


router.post('/back-issues/authenticate', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    User.findOne( {name: name}, (err, user) => {
        if (err)
            console.log(err);
        if (!user) {
            return res.json({success: false, msg: 'No user found'});
        }
        const currentUser = user;
        const hash = currentUser.password;
        const currentPassword = password;


        bcrypt.compare(currentPassword, hash, (err, isMatch) => {
            if (err)
                console.log(err);
            if (isMatch){
                const token = jwt.sign(currentUser.toJSON(), 'secret', {
                    expiresIn: 604800 //1 week
                });
                res.json({
                    success: true,
                    token: token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        manager: user.manager,
                        status: user.status
                    },
                    msg: 'COnnected successfully'
                });
            } 
            else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
})

router.route('/back-issues/users').get((req, res) => {
    User.find((err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
        
    });
});

router.route('/back-issues/users/:id').get((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    });
});

router.route(`/back-issues/users/search-name/:name`).get((req, res) => {
    const name = req.params.name;
    User.find( {name: name}, (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    });
});

router.route(`/back-issues/users/search-manager/:manager`).get((req, res) => {
    const manager = req.params.manager;
    User.find( {manager: manager}, (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    });
});

router.route('/back-issues/users/add').post((req, res) => {
    let newUser = new User(req.body);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
                .then(user => {
                    res.status(200).json({'user': 'Added successfully!'});
                })
                .catch(err => {
                    res.status(400).send('Failed to create new record');
                });
        })
    })
    
});

router.route('/back-issues/users/update/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (!user)
            return next(new Error('Could not load document'));
        else {
            user.name = req.body.name;
            user.password = req.body.password;
            user.manager = req.body.manager;
            user.status = req.body.status;

            user.save().then(user => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/back-issues/users/delete/:id').get((req, res) => {
    User.findByIdAndRemove({_id: req.params.id}, (err, user) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');

    });
});


//__________________________________________________________________//


//___________________Upload Files__________________________________//



const mul = multer();

// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('document');

// Create a storage object with a given configuration
const storage = require('multer-gridfs-storage')({
    url: 'mongodb://yourhost:27017/database'
 });
  
 // Set multer storage engine to the newly created object
 //const upload = multer({ storage: storage });

 // Upload your files as usual
//const sUpload = upload.single('avatar');
//app.post('/profile', sUpload, (req, res, next) => { 
    /*....*/ 
//}) 

//our file upload function.
router.route('/back-issues/upload').post((req, res, next) => {
    var path = '';
    upload(req, res, function (err) {
       if (err) {
         // An error occurred when uploading
         console.log(err);
         return res.status(422).send("an Error occured")
       }  
      // No error occured.
       path = req.file.path;
       return res.send("Upload Completed for "+path); 
 });     
})




//create a cors middleware
app.use(function(req, res, next) {
    //set headers to allow cross origin request.
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.use('/', router);



app.listen(4000, () => console.log('Express server running on port 4000'));
