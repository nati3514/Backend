const dotenv=require('dotenv')

dotenv.config()
module.exports={
    PORT:process.env.PORT,
    HOST:process.env.HOST,
    USER:process.env.USER,
    PASSWORD:process.env.PASSWORD,
    DATABASE:process.env.DATABASE,

    EMAILPASSWORD:process.env.EMAILPASSWORD,
    EMAILADDRESS:process.env.EMAILADDRESS,
    
    SMSUSER:process.env.SMSUSER,
    SMSPASSWORD:process.env.SMSPASSWORD,

    EXPIREDIN:process.env.EXPIREDIN,
    JWTSECRET:process.env.JWTSECRET,
}