a Node.js Express Login and Registration Rest API example that supports JWT (JSONWebToken) and works with MongoDB database using Mongoose ODM

Appropriate Flow for User Login and Registration with JWT Authentication
Node.js Express Architecture with CORS, Authentication & Authorization middlewares & Sequelize
How to configure Express routes to work with JWT
How to define Data Models and association for Authentication and Authorization
Way to use Mongoose ODM to interact with MongoDB Database

Methods	Urls	            Actions
POST	/api/auth/signup	signup new account
POST	/api/auth/signin	login an account
POST	/api/auth/signout	logout the account
GET	    /api/test/all	    retrieve public content
GET	    /api/test/user	    access User’s content
GET	    /api/test/mod	    access Moderator’s content
GET	    /api/test/admin	    access Admin’s content

![Flow for login and Registration](/public/image-1.png)

![Node.js Express Login with MongoDB Architecture](/public/image-2.png)

– config

configure MongoDB database
configure Auth Key

– routes

auth.routes.js: POST signup, signin & signout
user.routes.js: GET public & protected resources

– middlewares

verifySignUp.js: check duplicate Username or Email
authJwt.js: verify Token, check User roles in database

– controllers

auth.controller.js: handle signup, signin & signout actions
user.controller.js: return public & protected content

– models for Mongoose Models

user.model.js
role.model.js

– server.js: import and initialize necessary modules and routes, listen for connections.