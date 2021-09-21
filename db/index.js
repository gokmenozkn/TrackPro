const { Pool } = require('pg');

exports.pool = new Pool({
  user: 'postgres',
  password: '1234',
  database: 'api',
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
console.log('hello-world');
