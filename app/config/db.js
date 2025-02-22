const mysql=require('mysql')
const config=require('./index')
const host=config.HOST
const user=config.USER
const password=config.PASSWORD
const database=config.DATABASE

const db=mysql.createConnection({
    host:host,
    user:user,
    password: password,
    database:database
})
module.exports=db