var config = require('../../config/config.js');

var mongodb = require('mongodb');
var async = require('async');
var TestUsers = require('./data/user.js');
var TestRoles = require('./data/role.js');
var TestDocuments = require('./data/document.js');

var url = 'mongodb://localhost/docman';

async.series([
    function(callback) {
        var MongoClient = mongodb.MongoClient;
        var users, roles;
        MongoClient.connect(url, function(err, docman) {
            if (err) {
                console.log("could not connect:", err);
            } else {
                console.log("***********Deleting Collections***********");
                users = docman.collection('users');
                roles = docman.collection('roles');
                docs = docman.collection('documents');
                users.remove();
                roles.remove();
                docs.remove();
                console.log("+++++++++ADDING DATA++++++++++++++++");
                users.insert(TestUsers, function(err, result) {
                    if (err) {
                        console.log("Couldn't insert users: ", err)
                    } else {
                        console.log("ADDED", result.insertedCount, "USERS");
                    }
                });
                roles.insert(TestRoles, function(err, result) {
                    if (err) {
                        console.log("couldn't insert roles: ", err);
                    }
                    console.log("ADDED", result.insertedCount, "ROLES");
                    callback();

                });
                docs.insert(TestDocuments, function(err, result) {
                  if(err) {
                    return err;
                  }
                  console.log("ADDED", result.insertedCount, "DOCS");
                  callback();
                })

            }
        });

    }
], function(err) {
    if (err)
        console.log(err)
    else
        process.exit(0);
})
