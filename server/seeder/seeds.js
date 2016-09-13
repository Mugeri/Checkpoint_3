var config = require('../../config/config.js');

var mongodb = require('mongodb');
var async = require('async');
var TestUsers = require('./data/user.js');
var TestRoles = require('./data/role.js');

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
                console.log("---------USERS----------------------");
                users.remove();
                console.log("---------ROLES----------------------");
                roles.remove();
                console.log("+++++++++ADDING DATA++++++++++++++++");
                users.insert(TestUsers, function(err, result) {
                    if (err) {
                        console.log("Couldn't insert users: ", err)
                    } else {
                        console.log("---------USERS----------------------");
                        result.ops.forEach(function(user) {
                            console.log("USERNAME:", user.userName);
                            console.log("_ID:", user._id);
                        });
                        console.log("ADDED", result.insertedCount, "USERS");
                    }
                });
                roles.insert(TestRoles, function(err, result) {
                    if (err) {
                        console.log("couldn't insert roles: ", err)
                    } else {
                        console.log("---------ROLES----------------------");
                        result.ops.forEach(function(role) {
                            console.log("ROLE TITLE:", role.title);
                            console.log("_ID:", role._id);
                        });
                    }
                    console.log("ADDED", result.insertedCount, "ROLES");
        callback();

                });

            }
        });

    }
], function(err) {
    if (err)
        console.log(err)
    else
        process.exit(0);
})
