var connect = require('connect'),
	util    = require('util'),
	fs = require('fs'),
	url = require("url"),
	path = require("path"),
	http = require('http'),
	https = require('https'),
	httpProxy = require('http-proxy')

var remoteHost = 'localhost';
var remoteUiHost = 'ui-qa.pertino.com'

var remotePort = 9443;
var localport = 443;

var privateKey = fs.readFileSync( 'certs/privatekey.pem' ).toString();
var certificate = fs.readFileSync( 'certs/certificate.pem' ).toString();

var options = {
	key: privateKey,
	cert: certificate
};

var alias = {

    app:'/app.html',
    neo:'/neo.html',
    emberdata:'/emberdata.html',
    old:'/old.html',
	login:'/login.html',
	download: '/download.html'
};

var publish = false;

for (var i = 2; i < process.argv.length; i += 1) {

	var argument = process.argv[i];
	if (argument) {
		var args = argument.split('=');
		var flag = args[0];
		var val = args[1];
		switch(flag) {

			case 'publish':
				publish = true;
				break;

			case 'host':
				remoteHost = val;
				break;

			case 'remoteport':
				remotePort = val;
				break;

			case 'localport':
				localport = val;
				break;

			default:
				util.log('Unknown argument:'+flag);
				util.log('options are publish, host, remoteport and localport');
				util.log('Example: node server.js host=dev-mc.pertino.com remoteport=443 localport=9443');
			break;
		}
	}
}

var proxy = new httpProxy.HttpProxy({
	target: {
		host: remoteHost,
		port: remotePort,
		https: true
	},
	enable: {
		xforward: true
	},
	changeOrigin: false
});

var uiProxy = new httpProxy.HttpProxy({
	target: {
		host: remoteUiHost,
		port: remotePort,
		https: true
	},
	enable: {
		xforward: true
	},
	changeOrigin: false
});

var serveFile = function (request, response) {

	var cookie = request.headers.cookie;
	var cookies = [];
	var filePath = request.url;
	var i = 0;
	var loggedIn = false;
	var cookieSplit;
	var extname;
	var tempPath;
	var filePathComponents;

	filePath = filePath.split('?')[0];
	filePath = filePath.split('#')[0];
	if (filePath === '/') {

		if (typeof(cookie) !== 'undefined') {
			cookies = cookie.split(';');
			for (i = 0; i < cookies.length; i += 1) {

				cookieSplit = cookies[i].split('=');
				if (cookieSplit && cookieSplit[0].trim() === 'PLAY_SESSION') {
					loggedIn = true;
					break;
				}
			}
		}

		filePath = alias.app;
	} else {
		
		tempPath = filePath.substring(1, filePath.length);
		//filePathComponents = tempPath.split('/');

		if (tempPath) {

			if (alias[tempPath]) {

				filePath = alias[tempPath];
			}
		}
	}

	extname = path.extname(filePath);
	filePathComponents = filePath.split('/');

	if (publish) {

		filePath = '../dist' + filePath;
	} else if(filePathComponents.length > 1 && filePathComponents[1] === 'jasmine') {

		filePath = '.' + filePath;
	}else if (extname === '.html') {
		if (filePath === alias.app) {
			filePath = './' + filePath;
		} else {
			filePath = './html' + filePath;
		}
	} else {

		filePath = '.' + filePath;
	}

	//util.log(filePath);
	
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.svg':
			contentType = 'image/svg+xml';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.jpg':
		case '.jpeg':
			contentType = 'image/jpeg';
			break;
		case '.gif':
			contentType = 'image/gif';
			break;
		case '.ico':
			contentType = 'image/x-icon';
			break;
		case '.json':
			contentType = 'application/json';
			break;
		case '.woff':
			contentType = 'application/x-font-woff';
			break;
		case '.html':
			contentType = 'text/html';
			break;
		case '.mp4':
			contentType = 'video/mp4';
			break;
		case '.ogv':
			contentType = 'video/ogg';
			break;

		default:
			util.log("Unknown extension for file "+filePath);
	}

	path.exists(filePath,
		function(exists) {

		if (exists) {

			fs.readFile(filePath, function(error, content) {

				if (error) {
					fs.readFile('./html/500.html', function(error, content) {

						response.writeHead(500);
						if (error) {

							response.end();
						} else {
							
							response.writeHead(500, { 'Content-Type': 'text/html'});
							response.end(content, 'utf-8');
						}
					});
				} else {
					response.writeHead(200, {
						'Content-Type': contentType,
						'Cache-Control' : 'no-cache, no-store, must-revalidate'
					});
					
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			util.log("Can't find "+filePath);
			fs.readFile('./html/404.html', function(error, content) {

				if (error) {
					response.writeHead(500);
					response.end();
				} else {
					response.writeHead(404, { 'Content-Type': 'text/html' });
					response.end(content, 'utf-8');
				}
			});
		}
	});
};



https.createServer(options, function (req, res) {

	var reqPath = req.url;
//    util.log(reqPath);

    if (reqPath.length > 1 && reqPath[0] === '.') {
        reqPath = reqPath.substring(1);
    }
    var querySplit = reqPath.split('?');
    var extensionSplit = querySplit[0].split('.');
    var extension = extensionSplit.length > 1 ? extensionSplit[1] : '';

    // If the path starts with '/api', 'api' else if it's a php script.
	if (reqPath.match(/^[\/]*api/)) {
		req.headers.host = remoteHost;
		util.log('sending proxy request '+req.url);
		//util.log(req.url);
		proxy.proxyRequest(req, res);

	} else if (reqPath.match(/^[\/]*zenDeskAuth/)) {
    	req.headers.host = remoteHost;
    	util.log('sending zenDeskAuth proxy request '+req.url);
    	//util.log(req.url);
    	proxy.proxyRequest(req, res);

    } else if (extension === 'php') {
        req.headers.host = remoteUiHost;
        util.log('sending UI proxy request '+req.url);
        //util.log(req.url);
        uiProxy.proxyRequest(req, res);
	} else {

		serveFile(req, res);
	}
		
}).listen(localport);


util.log("Opened proxy to "+ proxy.target.host +":"+ proxy.target.port+". Listening on localhost:"+localport+".");

if (publish) {

	util.log("using publish directory");
}

