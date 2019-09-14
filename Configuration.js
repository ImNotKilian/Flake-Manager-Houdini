"use strict";
const express = require('express');
const bodyparser = require('body-parser');
const flash = require('connect-flash'); 
const path = require('path');
const session = require('express-session');
const nodemailer = require("nodemailer");
const request = require("request");
const log = require('./Console');
const operations = require ('./Engine/Operations')
const crypto = require ('./Engine/Crypto')

class Configuration{
    constructor(){
        this.database_host = 'localhost';
        this.database_username = 'ro'; /* Set this to your MySQL username */
        this.database_password = ''; /* Set this to your MySQL password */
        this.database_port = 3306;
        this.database_name = 'Houdini';
        this.database_dialect = 'mysql';

        this.salt = 'Y(02.>\'H}t":E1'; /* If you are using the AS3 client, just change this salt to: 'a1ebe00441f5aecb185d0ec178ca2305Y(02.>'H}t\":E1_root' */
        this.port = 3000;
        this.site_key = ''; /* Register recaptcha keys from google and add your site key here. */
        this.secret_key = ''; /* Register recaptcha keys from google and add your secret key here. */
        this.session_secret = 'flake'; /* Get a password from the Strong Passwords section from https://randomkeygen.com and put it here, you do not need to remember it but this password must be strong. */

        this.add_items = 0; /* Set to 0 for users no one to add items, set to 1 for users to add items, set to 2 for only admins to add items (whilst adding their penguin ID to the admin list at the bottom) */
        this.verify_users = 0; /* Set to 0 for no one to verify usernames, set to 1 for moderators and admins to verify usernames, set to 2 for ONLY admins to verify usernames (whilst adding their penguin ID to the admin list at the bottom) */
        this.manage_penguins = 0; /* Set to 0 for users no one to manage penguins, set to 1 for moderators and admins to manage penguins, set to 2 for ONLY admins to manage penguins (whilst adding their penguin ID to the admin list at the bottom) */
        this.redemption = 0; /* Set to 0 for users no one to redeem a code, set to 1 for users to redeem a code, set to 2 for only admins to redeem a code (whilst adding their penguin ID to the admin list at the bottom) */
        this.admins = [101, 102, 103] /* Add the IDs of administrators in this list that you want to manage users data. */

        this.reset = 0; /* Set this to 1 if you want to use the activate email feature and fill in the below: */
        this.gmail_user = ''; /* Register a new GMAIL account as the email used to send the reset password link, or change the service from GMAIL to your preference.*/
        this.gmail_pass = ''; /* Enter the GMAIL accounts password here*/
        this.cpps_name = 'Flake'; /* The name of your CPPS that will appear in the activation email */
        this.sub_domain = 'manager.flake'; /* The sub-domain that you are using to host the manager, as the link has to be i.e. create.yourcpps.com/activate, if this isn't set properly it'll break the activate account via email feature. It should load from the same subdomain that you use to register i.e. register.cpps.com or create.cpps.com  */
        
        /* Do not touch anything below this unless you know what you are doing */

        this._request = request;
        this.log = log;
        this.nodemailer = nodemailer;
        this.crypto = new crypto();
        this.operations = new operations();
    }

    setup_flake(){
        this.flake = express();
        this.flake.engine('html', require('ejs').renderFile);
        this.flake.set('view engine', 'html'); 
        this.flake.set('views', path.join(__dirname, './views'));
        this.flake.use('/css', express.static(path.join(__dirname, './views/css')));
        this.flake.use('/js', express.static(path.join(__dirname, './views/js')));
        this.flake.use('/img', express.static(path.join(__dirname, './views/img')));
        this.flake.use(bodyparser.urlencoded({extended : true}));
        this.flake.use(bodyparser.json());
        this.flake.use(flash());
        this.flake.use(session({secret: this.session_secret, resave: true, saveUninitialized: true}));
        this.flake.listen(this.port, () => this.log.success(`Running Flake's panel on port: ${this.port}!`))
    }
}


module.exports = Configuration;
