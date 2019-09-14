const Base = require('../../Configuration');
const Displays = require('../Displays');

class Moderation extends Base{
    constructor(request, response, database){
        super();
        this.request = request;
        this.response = response;
        this.database = database;
        this.link = this.request.params.link;
        this.value = this.request.params.value;
        this.username = this.request.session.username;
        this.displays = new Displays(request, response, database);
    }



    async execute(){
        this.collect_body_data();
        this[this.link]();
    }

    async manage(){
        this.row = this.request.params.type;
        this.id = this.request.params.id;
        if(this.row == 'Approval' || this.row == 'Active' || this.row == 'Moderator')
            return await this.handleChange();
        await this.handleField();
    }

    async handleField(){
        if(this.value == 'update'){
            await this.handleUpdate();   
        }
        else{
            let error = this.displays.find('/error');
            this.response.render(error.page, error.ejs)
        } 
    }

    async handleUpdate(){
        if(this.row == 'Password'){
            this.user = await this.database.execute('penguin', `findOne`, {where: {ID: `${this.id}`}});
            let password = await this.crypto.generateBcrypt(this.player_data, this.salt);
            let query = JSON.parse(`{"Password":"${password}", "ID":"${this.id}"}`);
            await this.database.update('penguin', query);
        }
        else{
            let query = JSON.parse(`{"${this.row}":"${this.player_data}", "ID":"${this.id}"}`);
            await this.database.update('penguin', query);
        }
        return this.response.redirect(`/manage/${this.id}`);  
    }

    async handleChange(){
        let penguin = await this.database.execute('penguin', `findOne`, {where: {ID: `${this.id}`}});
        let query = JSON.parse(`{"${this.row}":"${+!penguin[this.row]}", "ID":"${this.id}"}`);
        await this.database.update('penguin', query);
        this.response.redirect(`/manage/${this.id}`)
    }

    async ban(){
        if(await this.count(`Username`, this.banned_username)){
            let banned = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.banned_username}`}});
            this.user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.username}`}});
            let date = new Date().getTime();
            date += (this.hours * 60 * 60 * 1000);
            await this.database.execute(`ban`, `create`, {PenguinID: banned.ID, ModeratorID: this.user.ID, Reason: 0, Comment: this.reason, Expires: date})
            this.response.redirect('/userban');
        }
        else{
            let error = this.displays.find('/username_not_found_');
            this.response.render(error.page, error.ejs)
        }
    }

    async unban(){
        await this.database.execute('ban', `destroy`, {where: {PenguinID: `${this.value}`}});
        this.response.redirect('/unban');
    }

    async count(row, value){
        let user_exist = await this.database.execute('penguin', `count`, {where: {[`${row}`]: [`${value}`]}});
        if (user_exist != 0) 
            return true; 

        return false;  
    }

    async verify(){
        let query = JSON.parse(`{"Approval":"1", "ID":"${this.value}"}`);
        await this.database.update('penguin', query);
        this.response.redirect('/verify')
    }

    collect_body_data(){
        for (let body in this.request.body)
            this[body] = this.request.body[body];
    }


}

module.exports = Moderation;