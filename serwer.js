let express = require('express');
let mysql = require('mysql');
let app = new express();

let db_conf = {
    host: "10.10.1.2",
    user: "pd_dzwonki",
    password: "dzwonek123",
    database: "pd_dzwonki",
    port: 3306
};



var con = mysql.createConnection(db_conf);
//con.connect();

function mysql_connect()
{
    con = mysql.createConnection(db_conf);
}

con.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      mysql_connect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });



app.use(express.static('public'));
let server = app.listen(81, () => {
    console.log(`Start serwera
    `)
})

let alarm = false;

app.get('/data', (req,res)=>{
   // console.log(con)
    con.query("select * from bell", (err, result)=>{
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