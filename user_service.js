const res = require("express/lib/response");
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "GurudasManchkar0675",
  database: "contacts",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS contacts", (err, result) => {
    if (err) throw err;
    console.log("Database created");
  });
  con.query(
    "CREATE TABLE IF NOT EXISTS users (id int auto_increment NOT NULL PRIMARY KEY, email VARCHAR(255), password VARCHAR(255));",
    (err, result) => {
      if (err) throw err;
      console.log("Table User Created");
    }
  );
  con.query(
    "CREATE TABLE IF NOT EXISTS user_contacts (id int auto_increment NOT NULL PRIMARY KEY, userid int, name VARCHAR(255), phoneno VARCHAR(255), email VARCHAR(255), FOREIGN KEY (userid) REFERENCES users(id));",
    (err, result) => {
      if (err) throw err;
      console.log("Table User Contacts Created");
    }
  );
});

exports.addUser = (email, password, callback) => {
  con.query(
    `SELECT * FROM users WHERE email='${email}' AND password='${password}'`,
    (err, result) => {
      if (err) throw err;
      if (result.length <= 0) {
        con.query(
          `INSERT INTO users(email,password) VALUES ('${email}','${password}')`,
          (err, result) => {
            if (err) callback(false);
            console.log("User Created");
            callback(true);
          }
        );
      } else {
        console.log("User already exits");
        callback(false);
      }
    }
  );
};

exports.signInUser = (email, password, callback) => {
  con.query(
    `SELECT * FROM users WHERE email='${email}' AND password='${password}'`,
    (err, result) => {
      if (err) callback(false);
      if (result.length >= 1) {
        console.log("User Fetch");
        callback(true, result[0]);
      }
    }
  );
};

exports.addContact = (id, email, name, phone, callback) => {
  con.query(
    `INSERT INTO user_contacts(userid,name,phoneno,email) values('${id}','${name}',${phone},'${email}')`,
    (err, result) => {
      if (err) callback(false);
      callback(true);
    }
  );
};

exports.getContact = (id, callback) => {
  con.query(`SELECT * FROM user_contacts WHERE userid=${id}`, (err, result) => {
    if (err) callback(false);
    callback(true, result);
  });
};
