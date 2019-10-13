"use strict";

const Base = require('../Configuration');

class Displays extends Base{
    constructor(request, response, database){
        super();
        this.request = request;
        this.response = response;
        this.database = database;
        this.url = request._parsedUrl.pathname;
        this.link = request.params.link;
        this.value = request.params.value;
        this.collect_urls();
        this.collect_pages();
    }

    collect_urls(){
        this.ejs = {}
        this.ejs[`/`] = {success_msg: '', error_msg: '',  reset: this.reset, site_key: this.site_key}
        this.ejs[`/logout`] = {success_msg: 'You have successfully been logged out of your account.',  error_msg: '', reset: this.reset, site_key: this.site_key}
        this.ejs[`/login`] = {success_msg: '', error_msg: '', reset: this.reset,  site_key: this.site_key}
        this.ejs[`/panel`] = {success_msg: '', error_msg: '', site_key: this.site_key}
        this.ejs[`/error`] = {success_msg: '', error_msg: 'Oops, looks like something went wrong. Please make sure you are logged in and try again.',  reset: this.reset, site_key: this.site_key}
        this.ejs[`/captcha`] = {success_msg: '', error_msg: 'Your captcha score was low. Please try again.',  reset: this.reset, site_key: this.site_key}
        this.ejs[`/username_not_found`] = {success_msg: '', error_msg: 'This username does not exist.',  reset: this.reset, site_key: this.site_key}
        this.ejs[`/incorrect_password`] = {success_msg: '', error_msg: 'Incorrect password, please try again.',  reset: this.reset, site_key: this.site_key}
        this.ejs[`/items`] = {error_msg:'',  items: this.add_items, update_msg: 'Enter an item ID to be added to your penguins inventory.', update_type: 'add_item'}
        this.ejs[`/taken`] = {error_msg:'This item is already in your inventory!',  items: this.add_items, update_msg: '', update_type: 'add_item'}
        this.ejs[`/added`] = {error_msg:'', items: this.add_items,  update_msg: 'The item has successfully been added to your inventory', update_type: 'add_item'}
        this.ejs[`/password`] = {error_msg : '',  update_msg: 'Please enter a new password for your penguin.', update_type: 'password'}
        this.ejs[`/pw_success`] = {error_msg : '',  update_msg: 'Your password was successfully updated.', update_type: 'password'}
        this.ejs[`/same_password`] = {error_msg : 'Please enter a password you have not used before.',  update_msg: '', update_type: 'password'}
        this.ejs[`/redemption`] = {error_msg : '', redemption: this.redemption,  update_msg: 'Please enter the redemption code.', update_type: 'redemption'}
        this.ejs[`/code_not_exist`] = {error_msg:'This code was not found in our records',  redemption: this.redemption, update_msg: '', update_type: 'redemption'}
        this.ejs[`/already_redeemed`] = {error_msg:'This code was already redeemed by you.',  redemption: this.redemption, update_msg: '', update_type: 'redemption'}
        this.ejs[`/outdated_code`] = {error_msg:'This code is out of date, sorry!',  redemption: this.redemption, update_msg: '', update_type: 'redemption'}
        this.ejs['/redeemed'] = {error_msg:'', redemption: this.redemption,  update_msg: `Congratulations, you have just redeemed this code!`, update_type: 'redemption'}
        this.ejs['/verify'] = { error_msg : '', verify: this.verify_users, update_msg: 'Verify a users username to be approved in-game', update_type: 'verify'};
        this.ejs['/unban'] = { error_msg : '', update_msg: 'Choose users to unban', update_type: 'unban' };
        this.ejs['/userban'] = { error_msg : '', update_msg: 'Provide a ban for a user.', update_type: 'ban' };
        this.ejs['/username_not_found_'] = { error_msg : 'This username does not exist.', update_msg: '', update_type: 'ban' };
        this.ejs['/email'] = {error_msg : '', update_msg: 'Please enter a new email for your penguin.', update_type: 'email'}
        this.ejs[`/email_success`] = {error_msg : '', update_msg: 'Your email was successfully updated.', update_type: 'email'}
        this.ejs[`/same_email`] = {error_msg : 'You have entered the same email as before.', update_msg: '', update_type: 'email'}
        this.ejs[`/manager`] = {error_msg: '', manage: this.manage_penguins, update_msg: 'Click a player you want to manage', update_type: 'manage'}
        this.ejs[`/reset`] = {error_msg:'', reset: this.reset, update_msg: 'Please enter the email address you registered your account with', update_type:'reset'}
        this.ejs[`/email_sent`] = {error_msg:'', reset: this.reset, update_msg: `A reset password link was succesfully sent. Please allow a few minutes for it to receive.`, update_type:'reset'}
        this.ejs['/false_email'] = {error_msg:`This email is not registered in our system`, reset: this.reset, update_msg: ``, update_type:`reset`}
    }
    
    collect_pages(){
        this.pages = {}
        this.pages[`/`] = 'index';
        this.pages[`/logout`] = 'index';
        this.pages[`/login`] = 'index';
        this.pages[`/panel`] = 'panel';
        this.pages[`/error`] = 'index';
        this.pages[`/captcha`] = 'index';
        this.pages[`/username_not_found`] = 'index';
        this.pages[`/incorrect_password`] = 'index';
        this.pages[`/items`] = 'update';
        this.pages[`/password`] = 'update';
        this.pages[`/redemption`] = 'update';
        this.pages[`/taken`] = 'update';
        this.pages[`/added`] = 'update';
        this.pages[`/pw_success`] = 'update';
        this.pages[`/same_password`] = 'update';
        this.pages[`/code_not_exist`] = 'update';
        this.pages[`/already_redeemed`] = 'update';
        this.pages[`/outdated_code`] = 'update';
        this.pages[`/redeemed`] = 'update';
        this.pages[`/verify`] = 'update';
        this.pages[`/unban`] = 'update';
        this.pages[`/userban`] = 'update';
        this.pages[`/username_not_found_`] = 'update';
        this.pages[`/email`] = 'update';
        this.pages[`/email_success`] = 'update';
        this.pages[`/same_email`] = 'update';
        this.pages[`/manager`] = 'update';
        this.pages[`/reset`] = 'update';
        this.pages[`/email_sent`] = 'update';
        this.pages[`/false_email`] = 'update';
    }

    async get(){
        let response = {};
        for(let urls in this.ejs)
            if(this.url === urls)
                response.ejs = this.ejs[urls];
                
        for(let urls in this.pages)
            if(this.url === urls)
                response.page = this.pages[urls]
        return await this.check(response);
    }

    find(link){
        let response = {};
        for(let urls in this.ejs)
            if(link === urls)
                response.ejs = this.ejs[urls];

        for(let urls in this.pages)
            if(link === urls)
                response.page = this.pages[urls]
    
        return response;
    }

    async check(data){
        if(this.request.session.loggedin || this.url === '/' || this.url === '/reset' || this.link === 'reset_pass')
            return await this.handle_data(data)
        return false; 
    }

    async is_admin(){
        if(await this.is_administrator())
            return 1;
        return 0;
    }

    async is_mod(){
        if(await this.is_moderator())
            return 1;
        return 0;
    }

    async staff_features(feature){
        if(this[feature] == 2){
            return await this.is_admin();
        }

        else{
            if(this[feature] == 1)
                return await this.is_mod();
            return 0;
        }
    }

    async user_feature(feature){
        if(this[feature] == 2)
            return await this.is_admin();
        return this[feature];
    }

    async feature(feature){ // start as a normal user, redemption and add_item should show if set to 1
        if(feature == 'manage_penguins' || feature == 'verify_users')
            return await this.staff_features(feature);
        return await this.user_feature(feature);
    }

    async handle_data(data){
        if(this.link == 'panel'){
            this.user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.request.session.username}`}});
            this.user_data = {id: this.user.ID, username: this.user.Username,  redemption: await this.feature('redemption'), verify_user: await this.feature('verify_users'), add_item: await this.feature('add_items'), manage_penguins: await this.feature('manage_penguins'), approval: this.boolean(this.user.Approval), active: this.boolean(this.user.Active), email: this.user.Email, coins: this.user.Coins, rank: this.user.Rank, panel_type: this.user.Moderator}
            return this.append(this.user_data, data);
        }

        else if (this.link == 'verify'){
            let approvals = await this.database.execute('penguin', `findAll`, {where: {Approval: 0}});
            let approval_data = {approval: approvals}
            if(await this.check_staff(`verify_users`))
                return this.append(approval_data, data)
            return false;
        }

        else if (this.link == 'manager'){
            let penguins = await this.get_penguins();
            let penguin_data = {penguin: penguins}
            if(await this.check_staff(`manage_penguins`))
                return this.append(penguin_data, data)
            return false;
        }

        else if (this.link == 'userban'){
            if(await this.is_moderator())
                return data;
            return false;
        }

        else if (this.link == 'unban'){
            let banned_data = [];
            let bans = await this.database.execute('ban', `findAll`, '');
            for(let player in bans){
                let penguin = await this.database.execute('penguin', `findAll`, {where: {ID: bans[player].PenguinID}});
                let moderator = await this.database.execute('penguin', `findAll`, {where: {ID: bans[player].ModeratorID}});
                for(let penguinData in penguin){
                    for(let penguinData in moderator){
                        bans[player].Moderator_Username = moderator[penguinData].Username
                    }
                    bans[player].Username = penguin[penguinData].Username;
                    banned_data.push(bans[player]);
                }
            }
            let ban_data = {bans: banned_data}
            if(await this.is_moderator())
                return this.append(ban_data, data)
            return false;
        }

        else if (this.link == 'logout'){
            this.request.session.destroy();
            return data; 
        }

        else if (this.link == 'avatar'){
            this.operations.match(this.request, this.response, this.database);
            return true;
        }

        else if(this.link == 'reset_pass'){
            let userData = await this.database.execute('reset_pass', `findOne`, {where: {ResetID: `${this.value}`}});
            if(userData.Expires > new Date().getTime()){
                data.page = 'update';
                data.ejs = {error_msg: '', update_msg: `Choose a new password.`, reset_id: this.value, update_type: 'reset_password'}
                return data;
            }
            else{
                data.page = 'update';
                data.ejs = {error_msg:'Please request a new password reset link, the expiry time is up.', update_msg:'', update_type:''};
                return data;
            }
        }

        else if(this.link == 'manage'){
            this.user = await this.database.execute('penguin', `findOne`, {where: {ID: `${this.value}`}});
            data.page = 'update';
            data.ejs = {error_msg: '', manage: this.manage_penguins, update_msg: `Update certain settings for the user: ${this.user.Username}`, approval: this.boolean(this.user.Approval), moderator: this.boolean(this.user.Moderator), active: this.boolean(this.user.Active), penguin: this.user, update_type: 'manage_penguin'};
            if(await this.check_staff(`manage_penguins`))
                return data;
            return false;
        }   

        else if(this.value == 'edit'){
            this.user = await this.database.execute('penguin', `findOne`, {where: {ID: `${this.request.params.id}`}});
            let edit_data = {error_msg: '', row: this.request.params.type, id: this.user.ID, update_msg:`Enter the new value for the row: '${this.request.params.type}' for the penguin: '${this.user.Username}'`, update_type: 'edit_field'}
            data.page = 'update';
            data.ejs = edit_data;
            if(await this.is_moderator())
                return data;
            return false;
        }

        else{
            return this.check_data(data);
        }
    }

    async check_staff(feature){
        if(this[feature] == 2){
            if(await this.is_administrator())
                return true;
            return false;
        }
        else{
            if(await this.is_moderator())
                return true;
            return false;
        }
    }

    async get_penguins(){
        if(this.manage_penguins == 2)
            return await this.database.execute('penguin', `findAll`, ``);
        return await this.database.execute('penguin', `findAll`, {where: {Moderator: { $not: 1}}});
    }

    async check_data(data){
        if(Object.keys(data).length === 0)
            return false;
        return data;
    }
    
    async is_moderator(){
        let user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.request.session.username}`}});
        return user.Moderator;
    }

    async is_administrator(){
        let user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.request.session.username}`}});
        if(this.admins.includes(user.ID))
            return true;
        return false;
    }

    append(user_data, data){
        for(let x in user_data)
            data.ejs[x] = user_data[x];
        return data;
    }

    boolean(data){
        if(data == 1)
            return 'Yes';
        
        return 'No';
    }
}

module.exports = Displays;
