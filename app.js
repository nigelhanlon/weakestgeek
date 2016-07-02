
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/controller', routes.controller);
app.get('/round', routes.round);
app.get('/final', routes.final);
app.get('/transition', routes.transition);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Redwolf server listening on port ' + app.get('port'));
});

io = require('socket.io').listen(server);

require('./gameserver.js');
var colors = require('colors');

console.log("               ____  _____ ______        _____  _     _____                ".bold.red);
console.log("       _____  |  _ \\| ____|  _ \\ \\      / / _ \\| |   |  ___|  _____        ".bold.red);
console.log(" _____|_____| | |_) |  _| | | | \\ \\ /\\ / / | | | |   | |_    |_____|_____  ".bold.red);
console.log("|_____|_____| |  _ <| |___| |_| |\\ V  V /| |_| | |___|  _|   |_____|_____| ".bold.red);
console.log("              |_| \\_\\_____|____/  \\_/\\_/  \\___/|_____|_|                   ".bold.red);
console.log("                                                                           ".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'~~~     ~~~`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@@@@@@'                     `@@@@@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@@@'                           `@@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@'                               `@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@'                                   `@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@'                                     `@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@'                                       `@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@                                         @@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@'                                         `@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@                                           @@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@                                           @@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@                       n,                  @@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@                     _/ | _                @@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@                    /'  `'/                @@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@a                 <~    .'                a@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@                 .'    |                 @@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@a              _/      |                a@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@a           _/      `.`.              a@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@a     ____/ '   \\__ | |______       a@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@a__/___/      /__\\ \\ \\     \\___.a@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@/  (___.'\\_______)\\_|_|        \\@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@".bold.red);
