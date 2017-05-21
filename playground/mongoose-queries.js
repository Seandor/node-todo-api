const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '59182e222f8ead3ee072a1d9';

if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

// With mongoose, no need to construct a ObjectId
// A simple string will do
Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  // Mongodb returns null, if there is no such an id
  if (!todo) {
    return console.log('Id not found');
  }
  console.log('Todo', todo);
});