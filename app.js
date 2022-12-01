import express from 'express';
import fs from 'fs'
//import http from 'http'
import got from 'got'
import {readdir} from 'fs/promises';
import {getData, getStream} from './dbstuff.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; 
const app = express();

app.set('view engine','ejs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname + '/public'));
app.get('/', async function(req, res){
	let pic_names = []
	let title_names = []
	const filenames = await readdir('./public/cards')
	for (let filename of filenames) {
		pic_names.push('cards/'+filename)
		title_names.push(filename.split('.')[0])
	}
	res.render('index', {data:{pics:pic_names,
							   titles: title_names	
	}})

})

app.get('/show/:title', async function (req,res){
	let data = await getData(req.params.title)
	res.render('show', {data:{title:req.params.title,
							  ep_data: data,
						}})
})

app.get('/watch/:title/:ep', async function (req, res){
	let data = await getStream(req.params.title, req.params.ep)
	console.log(data)
	res.render('watch', {data: {ep: req.params.ep,
								meta: data
	}})
})

app.get('/stream/:title/:ep', async function (req, res) {
	const ipAddresses = req.header('x-forwarded-for') || req.socket.remoteAddress;
	let d = await getStream(req.params.title, req.params.ep)
    let url = "http://"+d.IP+":3000"+"/watch/"+d.Show_Title+"/"+d.Show_Episode
    console.log(ipAddresses)
    console.log(url)
    got.stream(url).pipe(res)
})

app.listen('80');