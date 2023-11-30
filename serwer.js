let express = require('express');
let mysql = require('mysql');
let app = new express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dzwonki",
    port: 3306
});
con.connect();


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