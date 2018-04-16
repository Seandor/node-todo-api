require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParse = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

app = express();
const port = process.env.PORT;

app.use(bodyParse.json());

app.post('/todos', authenticate, async (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  try {
    const doc = await todo.save();
    res.send(doc);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/todos', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos });
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET /todos/123123123
app.get('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOne({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  } catch (err) {
    res.status(400).send(err);
  }
});


app.delete('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id;
  // only let user the update the two properties
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  try {
    const todo = await Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true });
    if (!todo) {
      return res.status(400).send();
    }
    res.send({ todo });
  } catch (err) {
    res.status(400).send(err);
  }
})

// --------------------------- User -----------------------------

app.post('/users', async (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  return res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};