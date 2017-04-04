
var express=require('express');
var bodyparser=require('body-parser');
var urlencodeParser=bodyparser.urlencoded({extended:true});
var app=express();
var sql=require('mysql');
 var TeacherRoutes=require(__dirname+'/Routes/MainRoutes.js');
 var RegisterRoutes=require(__dirname+'/Routes/RegisterRoutes.js');
//   var StudentRoutes=require('./Routes/StudentRoutes');
app.use(bodyparser.json());
app.use(urlencodeParser);
app.use('/stylesheet',express.static(__dirname+'/StyleSheet'));
app.use('/Images',express.static(__dirname+'/Images'));
app.use('/JS',express.static(__dirname+'/JS'));
app.set('view engine','ejs');
app.get('/signout',function (req,res) {
    if(req.session){
        console.log("req session wasnt null req userd id : "+req.session.userid);
        req.session=null;

    }
    res.render('my');

})
app.use('/TeacherLogin',TeacherRoutes);
app.use('/Register',RegisterRoutes);
app.get('/',function(req,res){
res.render('my');
console.log('Request Url: '+req.url);
});

app.listen(8080, '127.0.0.1', function() {
    console.log('Listening to port:  ' + 8080);
});

// app.use('/StudentLogin',StudentRoutes);

 

