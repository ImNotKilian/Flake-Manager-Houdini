const md5 = require('md5');
const bcrypt = require('bcrypt');

class Crypto{

    getLoginHash(database_pass, salt){
        let MD5 = md5(database_pass).toUpperCase(); 
        let password = MD5.substr(16, 16) + MD5.substr(0, 16);  
        password += 'houdini'; 
        password += salt;
        password = md5(password);
        let hash = password.substr(16, 16) + password.substr(0, 16);
        return hash;
    }

    sanatize_password(password){
        return password.replace(/^\$2y(.+)$/i, '$2a$1'); 
    }

    async compare(hash, password){
        return await bcrypt.compare(hash, password)
    }

    async generateBcrypt(plaintext_pass, salt){
        let MD5 = md5(plaintext_pass).toUpperCase(); 
        let password = MD5.substr(16, 16) + MD5.substr(0, 16);  
        password += 'houdini'; 
        password += salt;
        password = md5(password);
        password = password.substr(16, 16) + password.substr(0, 16);
        let hash = await bcrypt.hash(password, 12);
        return hash;
    }

}

module.exports = Crypto;