const express = require('express');
const bodyParse = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


app = express();
const port = process.env.PORT || 3000;

// bodyParser.json() return a middle ware
// used by express to parse a string into JSON
app.use(bodyParse.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/123123123
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      res.status(404).send();
    } else {
      res.send({todo});
    }
  }).catch((e) => {
    res.status(400).send(e);
  });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};