require('./item.js');
var express = require('express');
var router = express.Router();
var URL = require('url');
let moment = require('moment');
var mongoose = require('mongoose'); //引入mongoose模块
var itemModel = mongoose.model('item');//引入iterm模型


/*连接服务器接口*/
router.get('/', function(req, res, next) {
  res.send('Access server successfully');
});
/*查询数据库接口*/
router.get('/search', function(req, res) {

  itemModel.find({item_id:'10000'}, function (err, data) {
    if (err)  throw err;
    console.log(data);   
    res.send(data)
  })

});
/*查询数据库接口*/
router.post('/search', function(req, res) {
  
      let update = req.body;
      console.log('Incoming data：',update);
      itemModel.find({item_id:update.item_id}, function (err, data) {
        if (err){
          res.render('error', {
            status: 500
          });
        }
          console.log(data);   
          res.send(data)
      })

});
/*领取库存*/
router.get('/reduce', function(req, res) {

  itemModel.updateOne({"item_id":"10020"},{$inc:{"item_number":2}},function(err,data)
  {
      if (err) {
          console.log("Error:" + err);
      }
      else {
          res.send("cehng")
      }
  });
});

/*领取库存*/
router.post('/reduce', function(req, res) {
  
  let update = req.body;
  console.log('Incoming data：',update);
  itemModel.findOne({"qr_code":update.qr_code},function(err,data){
    if (err) {
      console.log("Error:" + err);
    }
    else{
      if((Number(data.item_number)-Number(update.reduce_number))<=0){
        itemModel.remove({"qr_code":update.qr_code},function(err1,data1){
          if (err1) {
            console.log("Error:" + err1);
          }else{
            itemModel.find({item_id:update.item_id},function(err3,data3){
              if (err3) {
                console.log("Error:" + err3);
              }else{
                res.send(data3)
               }    
              });
          }
        })
      }else{
        itemModel.updateOne({"qr_code":update.qr_code},{$inc:{"item_number":-Number(update.reduce_number)}},function(err2,data2)
       {
        if (err2) {
          console.log("Error:" + err2);
        }else{

         itemModel.find({item_id:update.item_id},function(err3,data3){
          if (err3) {
            console.log("Error:" + err3);
          }else{
            res.send(data3)
           }    
          });

        }
   
        });
      }
    }

  })


})
/*查询过期*/
router.post('/overdue', function(req, res) {
  let update = req.body;
  console.log('overdue data：',update);
  if(update.overdue_data!=="315"){
      var query = {
        "receiving_date":{"$lt":moment().subtract(update.overdue_data,'M').toISOString()
        
    }};
    console.log("1")
  }else{
    var query = {
      "EXP_data":{"$lte":moment().toISOString()
  }};
  console.log("2")
  }

  console.log("访问成功");
  var collection_number="";
  itemModel.count({},function(err,data){

      if (err) {
          console.log("Error:" + err);
      }
      else {
        collection_number=data;
        console.log(data);

      }
  });
  
  itemModel.find(query,function(err,data)
  {
      if (err) {
          console.log("Error:" + err);
      }
      else {
          var insert_data={"total":collection_number,"overdue_number":data.length};
          console.log(insert_data);
          var res_data=data;
          res_data.push(insert_data);
          res.send(res_data);
          console.log(res_data);
      }
  });
});
/*录入数据库接口*/
router.post('/create',function(req, res) {

      let update = req.body;
      console.log('Incoming data：',update);
      itemModel.find({"qr_code":update.qr_code},function(err,docs){
        if (err) throw err;
        console.log(docs)
        console.log(docs.length>0)
        if(docs.length>0&&docs!==null){
          itemModel.updateOne({"qr_code":update.qr_code},{$inc:{"item_number":Number(update.item_number)}}, function (err, data) {
            if (err) throw err;
            console.log('Write to exist database successfully'); 
            res.json({result:'200'})  
          })
        }else{
         //写入数据库
         itemModel.create({item_id:update.item_id,item_number:update.item_number,manufacturer:update.manufacturer,receiving_date:update.receiving_date,production_date:update.production_date,life:update.life,"qr_code":update.qr_code,"EXP_data":update.EXP_data}, function (err, data) {
         if (err) throw err;
         console.log('Write to database successfully'); 
         res.json({result:'200'})   
        })
        }
      })

      //返回给客户端的json数据
          
});

module.exports = router;
