var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var db_string = 'mongodb://127.0.0.1/todolist';

var mongoose = require('mongoose').connect(db_string);

var db = mongoose.connection;

var TodolistItem;

db.on('error', console.error.bind(console, 'Erro ao conectar ao BD'));

db.once('open', function () {
    var todolistSchema = mongoose.Schema({
        title: String,
        created_at: Date
    });
    
    TodolistItem = mongoose.model('TodolistItem', todolistSchema);
});

app.listen(5000);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (require, response) {
    response.send('Sevidor ON!');
});

app.get('/todolist', function (req, res) {
    TodolistItem.find({}, function(error, itens){
        if(error){
            res.json('Não foi possivel recuperar a lista de TODO');
        } else {
            res.json(itens);
        }
    });
});

app.post('/todolist', function(req, res){
    
    var title = req.param('title');
    
    new TodolistItem({
        'title': title,
        'created_at': new Date()
    }).save(function(error, item){
        if(error){
            res.json('Não foi possivel salvar o item');
        } else {
            res.json(item);
        }
    });
});
