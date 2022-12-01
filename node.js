const express = require('express');
const fs = require('fs');
const net = require('net')
const app = express();


app.get('/watch/:title/:ep', function (req, res) {
	console.log(req.params.title, req.params.ep);
	let path = "./shows/"+req.params.title+"/"+req.params.ep
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0],10);
		const end = parts[1] ? parseInt(parts[1],10) : fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		let msg = 'RES: 206,' + 'BYTES: ' + start + '-' + end + " SENDER: 192.168.1.98 "
		var client = new net.Socket();
		client.connect(5000, '192.168.1.70', function() {
				console.log('Connected');
    		    client.write(msg);
    		    client.destroy()
		});
		console.log(msg)		
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head)
		file.pipe(res)		
		//await sendMsg('192.168.1.70', 5000, msg)
	} else {
		let msg = "RES: 200 "+"SENDER: 192.168.1.98 COMPLETE"
		var client = new net.Socket();
		client.connect(5000, '192.168.1.70', function() {
   		    console.log('Connected');
    		    client.write(msg);
    		    client.destroy()
		});
		console.log(msg)
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
})

app.listen('3000');
