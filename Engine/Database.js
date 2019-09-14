const sequelize = require('sequelize');
const Base = require('../Configuration'); 

class Database extends Base{
    constructor(){
        super();
        this.connection = false;
    }

    async connect(){
        this.databaseConnection = await new sequelize({
            host: this.database_host,
            port: this.database_port,
            username: this.database_username,
            password: this.database_password,
            database: this.database_name,
            dialect: this.database_dialect,
            logging: false,
            define: {
                timestamps: false,
                freezeTableName: true
            }
        });
        
        await this.authentication();
        this.import();
    }

    async import(){
        if(this.connection)
            this.penguin = await this.databaseConnection.import('../Data/Penguin');
            this.inventory = await this.databaseConnection.import('../Data/Inventory');
            this.ban = await this.databaseConnection.import('../Data/Ban');
            this.redemption_code = await this.databaseConnection.import('../Data/RedemptionCode');
            this.penguin_redemption = await this.databaseConnection.import('../Data/PenguinRedemption');
            this.redemption_award = await this.databaseConnection.import('../Data/RedemptionAward');
            this.reset_pass = await this.databaseConnection.import('../Data/Reset');
            this.log.success(`Database connection successfully made to ${this.database_name}`)
    }

    async authentication(){
        try{
            await this.databaseConnection.authenticate();
            this.connection = true;
        }
        catch(e){
            /* this.log.crash(e) */
            this.log.alert(`The database connection to ${this.database_name} has failed.`)
            this.log.alert(`Please consider reviewing the database details provided in Configuration.js`)
        }
    }

    async execute(table, type, query){
        try{
            if(query == '')
                return await this[`${table}`][`${type}`]();
            
            let jsonQuery = JSON.stringify(eval(query));
            return await this[`${table}`][`${type}`](JSON.parse(jsonQuery));
        }
        catch(e){
            /* this.log.crash(e); */
            this.log.crash(`FILE: Engine/Database.js | LINE: 63`); 
        }
    }

    async update(table, query){
        try{
            let row = Object.keys(query);
            await this[`${table}`].update({[`${row[0]}`]: `${query[`${row[0]}`]}`}, {where: {[`${row[1]}`]: `${query[`${row[1]}`]}`}});
        }
        catch(e){
            /* this.log.crash(e); */
            this.log.crash(`FILE: Engine/Database.js | LINE: 74`);
        }
    }
}

module.exports = Database;
