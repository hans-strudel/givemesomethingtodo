var request = require('request'),
	cheerio = require('cheerio'),
	path = require('path'),
	fs = require('fs'),
	os = require('os'),
	open = require('open')

function grab(url, cb){
	request(url, (err,res,txt)=>{
		
		if (err) throw new Error(err)
		
		cb(txt)
	})
}

function grabImage(url, file, cb){
	request.head(url, function(err, res, body){
		// console.log('content-type:', res.headers['content-type']);
		// console.log('content-length:', res.headers['content-length']);
		request(url).pipe(fs.createWriteStream(file)).on('close', cb);
	});
}

function imgDLdone(e){
	open(e)
}

function display(txt){
	console.log(txt)
	fs.writeFileSync('currentProblem.txt', txt)
	console.log(os.EOL +'Copy saved to currentProblem.txt')
}

function getEuler(problem){ // number
	console.log('Euler Problem: ', problem, os.EOL)
	grab('https://projecteuler.net/problem=' + problem, (html)=>{
		$ = cheerio.load(html)
		
		var imgs = $('.problem_content img')
		if (imgs.length > 0){ // imgs
			for (var i = 0; i < imgs.length; i++){
				var fn = path.parse(imgs.attr('src')).name + path.parse(imgs.attr('src')).ext
				grabImage('https://projecteuler.net/' + imgs.attr('src'), fn, imgDLdone)
				imgs.append('<span>OPEN FILE >>> ' + fn + '</span>')
			}
		}
		
		var sups = $('.problem_content sup')
		if (sups.length > 0){ // exponenents
				sups.prepend('^')
		}
		display($('.problem_content').text().trim())
	})
}

getEuler(Math.floor(Math.random()*100))
//getEuler(13)