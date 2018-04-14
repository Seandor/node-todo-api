const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'asdfqwe123!';
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

bcrypt.compare(password, '$2a$10$IbQs4C8mFn3U.6vlBVmtpudTwelnb.ygrcQ9Axk92sGpzOHCVh0He', (err, res) => {
  console.log(res);
});

// var data = {
//   id: 10
// };

// var token = jwt.sign(data, '123abc');

// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// jwt.sign 
// jwt.verify

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(hash);

// var data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }