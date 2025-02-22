const express=require('express')
const config=require('./app/config/index')
const cors=require('cors')
const routers=require('./app/routes/index')
const path=require('path')
const db=require('./app/config/db')
const app=express()
const PORT=config.PORT

app.use(cors())
app.use(express.json());


// setTimeout(() => {
//   process.exit(1);
// }, 100000);


db.connect(error => {
    if(error) {
      console.error('Error connecting to MySQL: ', error);
      return;
    }
  
    console.log('MySQL connected!');
  });
  
  db.on('error', error => {
    console.error('MySQL error: ', error);
  });

app.use('/',routers)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.listen(PORT,()=>{
    console.log("server is running on port"+PORT)
})