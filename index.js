//expressをrequire(import)して定数に代入(定数とは中身が変わらない変数)
const express = require("express");
//express関数をappに代入(javascriptでは関数を変数に代入できる)
const  app = express();
//Jsonを使うことを指定する(必須)
app.use(express.json());
// HTTPSサーバー起動                                                                               
// var fs = require('fs');
// var https = require('https');
// var options = {
//   pfx:  fs.readFileSync('./Iot02.pfx'),
//   passphrase: "password"   
// };
// const server = https.createServer(options,app);

//ポート番号を指定指定してサーバーを起動
//https.createServer(options, app).listen(443);
//console.log("サーバーが起動しました");

app.listen(8888,console.log("サーバーが開始!!!"));
//クライアントに送る処理(テンプレ)
app.get("/",(req,res) =>{
    //app.use(express.static('Web'))
    console.log("アクセス!!!");
    res.sendFile(__dirname + "/Web/index.html");
});

//取得するデータ(json)
const lock_data = [
    {where:"",lock:"no",id:1},
    {where:"",lock:"no",id:2},
    {where:"",lock:"no",id:3},
    {where:"",lock:"no",id:4}
];

const Distance_Data = [
    
        {id:1,data:0.00},
        {id:2,data:0.00},
        {id:3,data:0.00},
        {id:4,data:0.00},
        {id:5,data:0.00}
    
]

//データの格納
let Datas = []
for(let i = 0;i < 5;i++){
    Datas[i] = [{id:1,data:0.00},
        {id:2,data:0.00},
        {id:3,data:0.00},
        {id:4,data:0.00},
        {id:5,data:0.00}]
}
//console.log(Datas)
//console.log(lock_data)

//データを取得可能にする(GET)
app.get("/api/locks_data",(req,res) =>{
    res.send(lock_data);
});


//データを取得
app.get("/api/get/:id",(req,res) =>{
    const id = lock_data.find((c) => c.id === parseInt(req.params.id));
    res.send(id);
});

app.get("/api/datas",(req,res) =>{
    //const id = lock_data.find((c) => c.id === parseInt(req.params.id));
    console.log("GET");
    res.send(Datas);
});

app.get("/api/datas/:where",(req,res) =>{
    console.log("GET");
    res.send(Datas[req.params.where]);
});
let lock_data_00 = [0.0,0.0,0.0,0.0];
let avg = 0.0;
//データを送信,追加(POST)
app.post("/api/post/:data/:number",(req,res)=>{
    const post = {
        id: Datas[req.params.number].length + 1,
        data: req.params.data
    };
    Datas[req.params.number].push(post);
    lock_data_00[lock_data_00.length] = parseFloat(req.params.data);
    //console.log(lock_data_00);
    for(let k = 1;k <= 5;k++){
        avg += lock_data_00[lock_data_00.length-k];
    }
    //k = 1
    avg /= 5;
    console.log(avg);
    avg = 0.0;
    console.log("push!");
    res.send(Datas);
});

//データの更新(put)
app.put("/api/put/:id/:lock",(req,res) =>{
    const id = lock_data.find((c) => c.id === parseInt(req.params.id));
    id.lock = req.params.lock;
    console.log("put!!");
    res.send(id);
});

//データ削除(delete)
app.delete("/api/put/:id",(req,res) =>{
    const id = lock_data.find((c) => c.id === parseInt(req.params.id));
    //配列の番号取得
    const index = lock_data.indexOf(id);
    //指定したものを一つだけ削除
    lock_data.splice(index,1);
    res.send(id);
});