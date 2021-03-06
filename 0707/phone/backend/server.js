const express = require('express');
const app = express();
const cors = require('cors')();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '0000',
	database : 'phone'
});

connection.connect((err)=>{
	if (err) {
		console.log(err);
		return;
	}
	console.log('DB 연결 완료');
})

app.use(cors);

app.listen(4000,()=>console.log('웹서버 성공'));

app.get('/test',(req,res)=>{
	connection.query('SELECT * FROM number',(err,rows)=>{
		if (err) {
			console.log(err);
			return;
		}
		res.json({result : rows});
	})	
})

app.post('/test',(req,res)=>{
	console.log(req.body);
	connection.query('INSERT INTO number SET number="'+req.body.num+'"',(err,rows)=>{
		console.log(rows);
	})
	res.json({message:'잘 받았다'});
})

app.delete('/test/:id',(req,res)=>{
	console.log(req.params.id)
	connection.query('DELETE FROM number WHERE id="'+req.params.id+'"',(err,rows)=>{
		console.log(rows)
		res.json({message:'잘 지웠다'});
	})
})


// ======= 추가 작업

app.post('/login',(req,res)=>{
	console.log(req.body);
	connection.query(`SELECT * FROM users WHERE username="${req.body.username}"`,(err,rows)=>{
		err && console.log(err);
		if (rows.length > 0) {
			if (req.body.userpass == rows[0].userpass) {
				res.json({success:1, user:rows[0]});
			} else {
				res.json({success:-2, message:'비밀번호가 틀림'});
			}
		} else {
			res.json({success:-1, message:'아이디가 없음'});
		}
	})
})

app.post('/phone',(req,res)=>{
	connection.query(`INSERT INTO phonebook (name,number,user_id) 
		values ("${req.body.phoneName}","${req.body.phoneNumber}",${req.body.userID})`,(err,rows)=>{
			err && console.log(rows);
			res.json({success:1});
		})
})

app.get('/phone/:user_id',(req,res)=>{
	connection.query(`SELECT * FROM phonebook WHERE user_id="${req.params.user_id}"`,(err,rows)=>{
		err && console.log(rows);
		res.json({success:1, list : rows});
	})
})

app.delete('/phone/:phone_id',(req,res)=>{
	console.log(req.params.phone_id)
	connection.query(`DELETE FROM phonebook WHERE phone_id="${req.params.phone_id}"`,(err,rows)=>{
		err && console.log(rows);
		res.json({success:1});
	})
})

app.put('/phone/:phone_id',(req,res)=>{
	connection.query(`UPDATE phonebook SET name="${req.body.name}", number="${req.body.number}" WHERE phone_id="${req.params.phone_id}"`,(err,rows)=>{
		err && console.log(rows);
		res.json({success:1});
	})
})
