"use strict";


const md5 = require('md5');
const bcrypt = require('bcrypt');

const Base = require('../../Configuration');
const Captcha = require('./Captcha');
const Displays = require('../Displays');

class Login extends Base{
    constructor(request, response, database){
        super();
        this.response = response;
        this.request = request;
        this.database = database;
        this.captcha = new Captcha(request)
        this.displays = new Displays(request, response, database)
    }

    async login(){
        this.collect_body_data();
        this.username = this.request.body.username;
        this.password = this.request.body.password;
        let user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.username}`}});
        
        if(!user){
            let data = this.displays.find('/username_not_found');
            return this.response.render(data.page, data.ejs);
        }
    
        else if(!await this.crypto.compare(this.crypto.getLoginHash(this.password, this.salt), this.crypto.sanatize_password(user.Password))){
            let data = this.displays.find('/incorrect_password');
            return this.response.render(data.page, data.ejs);
        }

        else{
            this.request.session.loggedin = true;
            this.request.session.username = this.username;
            this.response.redirect('/panel');
        }
    }

    execute(){
        let recaptcha_url = this.captcha.form_url();
        this.captcha.calculate(recaptcha_url, (response) =>{
            this.handle_response(response);  
        })
    }

    handle_response(response){
        let data = this.displays.find('/captcha');
        if(!response)
            return this.response.render(data.page, data.ejs);

        this.login();
    }

    collect_body_data(){
        for (let body in this.request.body)
            this[body] = this.request.body[body];
        
    }
}

module.exports = Login;
