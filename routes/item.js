var mongoose = require("mongoose"); //引入mongoose
mongoose.connect('mongodb://localhost/test'); //连接到mongoDB的todo数据库
//该地址格式：mongodb://[username:password@]host:port/database[?options]
//默认port为27017 
var db = mongoose.connection;
db.on('error', function callback() { //监听是否有异常
    console.log("Connection error");
});
db.once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('connected!成功');
});

var itemSchema = new mongoose.Schema({
  item_id: String, //定义一个属性item_id，类型为String
  item_number: Number, //定义一个属性item_number，类型为number
  receiving_date: Date ,//定义一个属性receiving_date，类型为Date
  manufacturer:String, //定义一个属性manufacturer，类型为String
  production_date:Date,//定义一个属性receiving_date，类型为Date
  life:String ,//定义保质期
  qr_code:String,
  EXP_data:Date,
});
//定义一个item的schema，用来存放物品
mongoose.model('item', itemSchema);
module.exports = mongoose;