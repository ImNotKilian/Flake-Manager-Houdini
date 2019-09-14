const Base = require('../../Configuration');
const Displays = require('../Displays');

class Reset extends Base{
    constructor(request, response, database){
        super();
        this.request = request;
        this.response = response;
        this.database = database;
        this.link = request.params.link;
        this.displays = new Displays(request, response, database);
    }

    async execute(){
        this.collect_body_data();
        if(this.link == 'reset_password')
            return await this.handle_reset();  
        await this.handle_send();
    }

    async handle_reset(){
        let id = this.request.params.value;
        let data = await this.database.execute('reset_pass', `findOne`, {where: {ResetID: `${id}`}});
        this.user = await this.database.execute('penguin', `findOne`, {where: {ID: `${data.PenguinID}`}});
        let password = await this.crypto.generateBcrypt(this.password, this.salt);
        let error = this.displays.find('/same_password');
        let success = this.displays.find('/pw_success');
        let query = JSON.parse(`{"Password":"${password}", "Username":"${this.user.Username}"}`);
        if(await this.crypto.compare(this.crypto.getLoginHash(this.password, this.salt), this.crypto.sanatize_password(this.user.Password)))
            return this.response.render(error.page, error.ejs);

        await this.database.update('penguin', query);
        await this.database.execute('reset_pass', `destroy`, {where: {ResetID: `${id}`}});
        this.response.render(success.page, success.ejs)
    }

    async handle_send(){
        if(await this.count(`Email`, this.email)){
            let user = await this.database.execute('penguin', `findOne`, {where: {Email: `${this.email}`}});
            let id = Math.random().toString(26).slice(2);
            let date = new Date().getTime();
            date += (12 * 60 * 60 * 1000);
            let transporter = this.nodemailer.createTransport({service: 'Gmail', auth: {user: this.gmail_user, pass: this.gmail_pass}});
            await transporter.sendMail({to: this.email, subject: `Reset your password for ${this.cpps_name}`, text: `You requested to reset your password for your account under the email: ${this.email}. Please head over to http://${this.sub_domain}/reset_pass/${id} to choose a new password. If this was not you, please disregard this email.`, }); /* Change to a more professional written email if you like */
            await this.database.execute(`reset_pass`, `create`, {PenguinID: user.ID, ResetID: id, Expires: date})
            let success = this.displays.find('/email_sent');
            this.response.render(success.page, success.ejs);

        }
        else{
            let error = this.displays.find('/false_email');
            this.response.render(error.page, error.ejs);
        }
    }

    async count(row, value){
        let user_exist = await this.database.execute('penguin', `count`, {where: {[`${row}`]: [`${value}`]}});
        if (user_exist != 0) 
            return true; 

        return false;  
    }



    collect_body_data(){
        for (let body in this.request.body)
            this[body] = this.request.body[body];
    }


}

module.exports = Reset;