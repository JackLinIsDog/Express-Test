var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var path = require('path');
//var http = require('http');
//var html=require('./legrand.html')
var transporter = nodemailer.createTransport(smtpTransport({
    //service: 'qq', // 运营商  qq邮箱 网易// 
    host: "smtp.qq.com", // 主机
    //secure: false
    //secure: true, // 使用 SSL
    secureConnection: true, // 使用 SSL
    port: 587, // SMTP 端口
    auth: {
        user: "jack.linjiandong@qq.com", // 账号
        pass: "mplmrkosrytucbgb"
    }
 }));

 function sendMail(){
 const html=fs.createReadStream(path.resolve(__dirname,"./legrand.html"));
  // 发送的配置项
  var mailOptions = {
      from:'"SLEC Warehouse"<jack.linjiandong@qq.com>', // 发送方
      to: "jack.lin@legrand.com.cn", //接收者邮箱，多个邮箱用逗号间隔
      subject: 'sendMail Test"', // 标题
      text: 'Hello world', // 文本内容
      html: html, //页面内容
      // attachments: [{//发送文件
      //      filename: 'index.html', //文件名字
      //      path: './index.html' //文件路径
      //  },
      //  {
      //      filename: 'sendEmail.js', //文件名字
      //      content: 'sendEmail.js' //文件路径
      //  }
      // ]
  };

  //发送函数
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          //call(false)
          console.log(error)
      } else {
         // call(true) //因为是异步 所有需要回调函数通知成功结果
         console.log("success")
      }
  });
 }
 module.exports={sendMail}