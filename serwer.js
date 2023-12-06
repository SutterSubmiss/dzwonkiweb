let express = require('express');
let mysql = require('mysql');
let env = require('dotenv');
env.config();

let app = new express();

// zmiany     
let db_conf = {    
  connectionLimit : 10,
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.db,
    port: 3306
};



var con = null
//con.connect();

function mysql_connect()
{
  console.log("łącze");
    con = mysql.createConnection(db_conf);


con.on('error', function(err) {
//    console.log("myerr",err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
     
      mysql_connect();
    } else { 
      throw err;
    }
  });
}
mysql_connect();

app.use(express.static('public'));
let server = app.listen(81, () => {
    console.log(`Start serwera
    `)
})

let alarm = false;

app.get('/data', (req,res)=>{
    // console.log(con)

    // con.getConnection(function (err, connection) {

    //   console.log(err);

    // });

    con.query("select * from bell", (err, result)=>{
      if(err )
      {
        // console.log(err);
        //   mysql_connect()
          res.send({status:false});
          return;
      }
      //  console.log(err)
        let odp = result[0];
        odp.alarm = alarm; 
        // czas serwera
        let now = new Date();
        odp.data = JSON.parse(odp.data);
        odp.time = Math.floor( now.getTime() / 1000);
        res.send(odp);
    })
})

app.get('/setalarm', (req, res)=>{
    
    let alarm1 = req.query.alarm?req.query.alarm:false;
    if(alarm1){
       // console.log('start alarm')
        setTimeout(()=>{
           // console.log('stop alarm')
            alarm = false;
        }, 20000);
        alarm = !alarm;
    }
    res.send({alarm:alarm});
})

const io = require('socket.io')(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
});