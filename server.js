var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mysql = require("mysql");
var connection = mysql.createConnection(process.env.OPENSHIFT_MYSQL_DB_URL);
connection.connect(function(){
app.use(bodyparser.json());
app.listen(process.env.OPENSHIFT_HAPROXY_PORT, function(){
app.use("/",express.static("BS"));
app.post("/save", function(req,res){
	console.log("INFO: Received "+JSON.stringify(req.body));
	connection.query("select * from Users where Username =\""+req.body.username+"\" and Password=\""+req.body.password+"\"",function(err,rows){
		if(err){
			res.send("error");
			console.log("ERROR: Error while attempting to retrieve user \""+req.body.username+"\" with password \""+req.body.password+"\"\nSQL: select * from Users where Username =\""+req.body.username+"\" and Password =\""+req.body.password+"\"ERROR: "+err+"\n");
			return}
		if(!rows[0]){
			console.log("INFO: Account \""+req.body.username+"\" does not exist, creating with password \""+req.body.password+"\"...\n");
			connection.query("insert into Users (Username,Password,birdsKilled,bulletsShot,eggs,weaponCooldownT,weaponSpeed,bulletSpeed,reloadTime,level) values (\""+req.body.username+"\",\""+req.body.password+"\",\""+req.body.birdsKilled+"\",\""+req.body.bulletsShot+"\",\""+req.body.eggs+"\",\""+req.body.weaponCooldownT+"\",\""+req.body.weaponSpeed+"\",\""+req.body.bulletSpeed+"\",\""+req.body.reloadTime+"\",\""+req.body.level+"\")");
			return;}
			connection.query("update Users set birdsKilled ="+req.body.birdsKilled+",bulletsShot = "+req.body.bulletsShot+",eggs ="+req.body.eggs+",weaponCooldownT = "+req.body.weaponCooldownT+",weaponSpeed = "+req.body.weaponSpeed+",bulletSpeed ="+req.body.bulletSpeed+",reloadTime ="+req.body.reloadTime+",level ="+req.body.level+" where Username =\""+req.body.username+"\"");
		res.send("saved");
});});
app.post("/load",function(req,res){
	connection.query("select * from Users where Username =\""+req.body.username+"\" and Password =\""+req.body.password+"\"",function(err,rows){
	if(err){
		console.log("ERROR: Error while attempting to retrieve user \""+req.body.username+"\" with password \""+req.body.password+"\"\nERROR: "+err+"\nSQL: select * from Users where Username =\""+req.body.username+"\" and Password =\""+req.body.password+"\"");
		res.send("error");
		return}
	if(!rows[0]){
		console.log("INFO: A request for nonexistent data was made\n");
		res.send("nonexistent");
	return;}
	var player = {
		birdsKilled:rows[0].birdsKilled,
		bulletsShot:rows[0].bulletsShot,
		eggs:rows[0].eggs,
		weaponCooldownT:rows[0].weaponCooldownT,
		weaponSpeed:rows[0].weaponSpeed,
		bulletSpeed:rows[0].bulletSpeed,
		reloadTime:rows[0].reloadTime,
		level:rows[0].level
	}
	var ps = JSON.stringify(player);
	console.log("INFO: Sent "+ps+" to user "+req.body.username+"\n");
	res.send(ps);
});});});});