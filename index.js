var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var db_string = 'mongodb://adsd_proj:proj123@ds133438.mlab.com:33438/adsd_proj'; // Heroku
//var db_string = 'mongodb://127.0.0.1/imagelist'; // Local

var mongoose = require('mongoose').connect(db_string);

var db = mongoose.connection;

var Photo;

db.on('error', console.error.bind(console, 'Erro ao conectar ao BD'));

db.once('open', function () {
    var imageSchema = mongoose.Schema({
        'image': String,
        'created_at': Date
    });

    Photo = mongoose.model('Photo', imageSchema);
});

app.listen(5000, function(){
	console.log("App on");
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));

app.get('/', function (require, response) {
    response.send('Sevidor ON!');
});

app.get('/images', function (req, res) {
    Photo.find({}, function(error, itens){
        if(error){
            res.json('Não foi possivel recuperar a lista');
        } else {
            res.json(itens);
        }
    });
});

app.post('/image', function(req, res){

    var image = req.param('image');
    new Photo({
        'image': image,
        'created_at': new Date()
    }).save(function(error, item){
        if(error){
            res.json('Não foi possivel salvar o item');
        } else {
            res.json(item);
        }
    });
});
