const Base = require('../../Configuration');
const Displays = require('../Displays');

class Player extends Base{
    constructor(request, response, database){
        super();
        this.request = request;
        this.response = response;
        this.database = database;
        this.displays = new Displays(request, response, database);
        this.username = this.request.session.username;
    }

    async execute(){
        this.collect_body_data();
        if(this.item)
            return await this.handle_items();

        if(this.password)
            return await this.handle_password();

        if(this.email)
            return await this.handle_email();
    }

    async handle_email(){
        this.user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.username}`}});
        let query = JSON.parse(`{"Email":"${this.email}", "Username":"${this.username}"}`);
        let success = this.displays.find('/email_success');
        let error = this.displays.find('/same_email');
        if(this.user.Email === this.email)
            return this.response.render(error.page, error.ejs);

        await this.database.update('penguin', query);
        this.response.render(success.page, success.ejs)
    }

    async handle_password(){
        this.user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.username}`}});
        let password = await this.crypto.generateBcrypt(this.password, this.salt);
        let error = this.displays.find('/same_password');
        let success = this.displays.find('/pw_success');
        let query = JSON.parse(`{"Password":"${password}", "Username":"${this.username}"}`);
        if(await this.crypto.compare(this.crypto.getLoginHash(this.password, this.salt), this.crypto.sanatize_password(this.user.Password)))
            return this.response.render(error.page, error.ejs);

        await this.database.update('penguin', query);
        this.response.render(success.page, success.ejs)
    }
    
    async handle_items(){
        let error = this.displays.find('/taken')
        let success = this.displays.find('/added')
        if(await this.itemExist())
            return this.response.render(error.page, error.ejs);

        await this.database.execute(`inventory`, `create`, {PenguinID: this.user.ID, ItemID: this.item})
        this.response.render(success.page, success.ejs)

    }

    

    async itemExist(){
        let items = [];
        this.user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.username}`}});
        let userItems = await this.database.execute('inventory', `findAll`, {where: {PenguinID: `${this.user.ID}`}});
        for(let ID in userItems)
            items.push(userItems[ID].ItemID)
   
        if(items.indexOf(Number(this.item)) == -1)
            return false;
        
        return true;
    }

    collect_body_data(){
        for (let body in this.request.body)
            this[body] = this.request.body[body];
    }


}

module.exports = Player;
