/* Track Game State */
var Game = function(){
    this.questionNumber = 0;
    this.lastEvent = false;
    this.currentQuestion = "";
    this.currentAnswer = "";
    this.questionJSON = {};
    this.bank = 0;
    this.bankTotal = 0;
    this.globalBank = 0;
    this.players = [];
    this.playerCount = 0;
    this.lastPlayerID = 0;

    this.roundNumber = 1;
    this.roundTimes = [150,140,130,120,110,100];
    //this.roundTimes = [11,12,13,14,15,16];
    this.roundJSON = { 'round': this.roundNumber, 'time': this.roundTimes[this.roundNumber - 1] };;

    this.nextRound = function(){
        if(this.roundNumber > this.roundTimes.length)
        {
            this.roundJSON = { 'round': 7, 'time': -1 };
        }
        else
        {
            this.roundNumber++;
            this.roundJSON = { 'round': this.roundNumber, 'time': this.roundTimes[this.roundNumber - 1] };
        }
        return this.roundJSON;
    }

    /* We need to loop though players */
    this.nextPlayerID = function(){
        if( (this.lastPlayerID % this.playerCount) == 0 )
        {
            this.lastPlayerID = 1;
            return this.lastPlayerID;
        }
        else
        {
            this.lastPlayerID++;
            return this.lastPlayerID;
        }
    }

    this.h2hplayerid = 1;
    this.toggleh2h = function(){
        if(this.h2hplayerid == 1)
        {
            this.h2hplayerid = 2;
        }
        else
        {
            this.h2hplayerid = 1;
        }
    }

    this.eliminatePlayer = function( playerName )
    {
        for(var i = 0; i < this.players.length; i++)
        {
            if(this.players[i].name == playerName)
            {
                this.players[i].pop();
            }
        }
    }

    this.h2hQuestionNumber = 0;
    this.nextH2HID = function(playerid)
    {
        var id = 'p' + playerid + '_q' + this.h2hQuestionNumber + '_';
        this.h2hQuestionNumber++;
        return id;
    }
}

var QuestionBank = require('./db/quiz.json'); // Load quiz questions.
var Players = require('./db/players.json'); // Load Player List.

if(QuestionBank == undefined || QuestionBank == null || QuestionBank == []){
    console.log("Could not load Question JSON.");
    process.exit(1);
}

if(Players == undefined || Players == null || Players == []){
    console.log("Could not load Players JSON.");
    process.exit(1);
}

// Assume we have players.
console.log("Loaded " + QuestionBank.length + " questions from bank.");
var gameserver = new Game(); // Our global game object.
gameserver.players = Players;
gameserver.playerCount = gameserver.players.length;


/*
 * Get the next question from the Array.
 */
function getAQuestion()
{
    var nextQ = gameserver.questionNumber + 1;
    gameserver.questionNumber++;
    if(nextQ >= QuestionBank.length)
    {
        console.log("Out of Questions. Question ID:" + nextQ);
        return { 'question':'Out of questions!', 'answer':'Out of questions!', 'gid':'9999'};
    }
    else
    {
        gameserver.currentQuestion = QuestionBank[nextQ].question;
        gameserver.currentAnswer = QuestionBank[nextQ].answer;
        return QuestionBank[nextQ];
    }
}


function nextQuestionJSON()
{
    var theQuestion = getAQuestion();
    var nextPlayer = gameserver.players[ gameserver.nextPlayerID()  - 1 ];
    var json = {
        'event':'showquestion',
        'answer':theQuestion.answer,
        'question':theQuestion.question,
        'gid': gameserver.questionNumber,
        'name': nextPlayer.name,
        'id': nextPlayer.playerid
    };
    gameserver.questionJSON = json;
    return json;
}

/*
 * Get the next point value for the on screen bank.
 */
function getNextBankValue()
{
    switch(gameserver.bank)
    {
        case 0: gameserver.bank  = 20; break;
        case 20: gameserver.bank  = 50; break;
        case 50: gameserver.bank  =  100; break;
        case 100: gameserver.bank =  200; break;
        case 200: gameserver.bank =  300; break;
        case 300: gameserver.bank =  450; break;
        case 450: gameserver.bank =  600; break;
        case 600: gameserver.bank =  800; break;
        case 800: gameserver.bank =  1000; break;
        default: gameserver.bank = 0;
    }
    return gameserver.bank;
}

io.sockets.on('connection', function (socket){

    socket.emit('init', { hello: 'world' });

    socket.on('controlevent', function (data)
    {
        switch(data.event)
        {
            case 'mainstart':
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=start&round=1' });
            break;

            case 'starth2h':
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'final' });
            break;

            case 'getplayers':
                playerNames = [];
                for(var i = 0; i < gameserver.players.length; i++)
                {
                    playerNames.push(gameserver.players[i].name);
                }
                socket.emit('feedbackevent', { 'event':'loadplayers', 'players': playerNames });
            break;

            case 'h2hpageloaded':
                socket.emit('uievent', { 'event':'loadh2hplayers', 'players': gameserver.players });
                socket.broadcast.emit('feedbackevent', { 'event':'loadfinalplayers', 'players': gameserver.players });

                var questionJSON = nextQuestionJSON();
                socket.broadcast.emit('feedbackevent', questionJSON );
                socket.emit('uievent', questionJSON );
            break;

            case 'roundinfo':
                socket.emit( 'feedbackevent', { 'event':'roundreply', 'round': gameserver.roundJSON.round, 'time': gameserver.roundJSON.time } );
                if( gameserver.roundJSON.round == 7 )
                {
                    socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=head2head' });
                }
                else
                {
                    socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=start&round=' + gameserver.roundJSON.round });
                }

            break;

            case 'startround':
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'round' });
            break;

            case 'gamepageloaded':
                var questionJSON = nextQuestionJSON();
                socket.broadcast.emit('feedbackevent', questionJSON );
                socket.emit('uievent', questionJSON );
                socket.emit('uievent', { 'event':'startcountdown', 'value': gameserver.roundJSON.time });
                gameserver.bankTotal = 0;
            break;

            case 'h2hrightevent':
                var questionJSON = nextQuestionJSON();
                socket.emit('feedbackevent', questionJSON );
                socket.broadcast.emit('uievent', questionJSON );

                var id = gameserver.nextH2HID( gameserver.h2hplayerid );
                gameserver.toggleh2h();
                socket.broadcast.emit('uievent', { 'event': 'markcorrect', 'id': id } );

            break;

            case 'h2hwrongevent':
                var questionJSON = nextQuestionJSON();
                socket.emit('feedbackevent', questionJSON );
                socket.broadcast.emit('uievent', questionJSON );

                var id = gameserver.nextH2HID( gameserver.h2hplayerid );
                gameserver.toggleh2h();
                socket.broadcast.emit('uievent', { 'event': 'markwrong', 'id':id } );

            break;

            case 'rightevent':
                var questionJSON = nextQuestionJSON();
                socket.emit('feedbackevent', questionJSON );
                socket.broadcast.emit('uievent', questionJSON );

                var bank = getNextBankValue();
                gameserver.banktotal = gameserver.bankTotal + bank;
                console.log( "Next bank value: " + bank );
                socket.broadcast.emit('uievent', { 'event':'setbankvalue', 'value': bank } );
            break;

            case 'wrongevent':
                var questionJSON = nextQuestionJSON();
                socket.emit('feedbackevent', questionJSON );
                socket.broadcast.emit('uievent', questionJSON );

                gameserver.bank = 0; // lost the bank
                socket.broadcast.emit('uievent', { 'event':'setbankvalue','value': gameserver.bank } );
            break;

            case 'bankevent':
                gameserver.bankTotal = gameserver.bankTotal + gameserver.bank;
                gameserver.globalBank = gameserver.globalBank +  gameserver.bank;
                socket.broadcast.emit('uievent', { 'event':'setbanktotal','value': gameserver.bankTotal } );
                gameserver.bank = 0; // lost the bank
                socket.broadcast.emit('uievent', { 'event':'setbankvalue','value': gameserver.bank } );
            break;

            case 'timerend':
                socket.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=end' });
                socket.broadcast.emit('feedbackevent', {
                    'event':'timerend',
                    'roundbank': gameserver.bankTotal,
                    'globalbank': gameserver.globalBank,
                    'weakestlink': 'Not Implemented',
                    'strongestlink': 'Not Implemented',
                    'roundnumber': gameserver.roundJSON.round
                });
            break;

            case 'endround':
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=end' });
                socket.emit('feedbackevent', {
                    'event':'timerend',
                    'roundbank': gameserver.bankTotal,
                    'globalbank': gameserver.globalBank,
                    'weakestlink': 'Not Implemented',
                    'strongestlink': 'Not Implemented',
                    'roundnumber': gameserver.roundJSON.round
                });
            break;

            case 'letsvote':
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=vote' });
                playerNames = [];
                for(var i = 0; i < gameserver.players.length; i++)
                {
                    playerNames.push(gameserver.players[i].name);
                }
                socket.emit('feedbackevent', { 'event':'loadvotelist', 'players': playerNames });
            break;

            case 'eliminateplayer':
                var playtmp = [];
                for(var i = 0; i < gameserver.players.length; i++)
                {
                    if(data.player != gameserver.players[i].name)
                    {
                        playtmp.push( gameserver.players[i] );
                    }
                }

                gameserver.players = playtmp;
                gameserver.playerCount = gameserver.players.length;
                gameserver.lastPlayerID = 0;
                socket.emit('feedbackevent', { 'event':'loadcontrolpage', 'page': '#vote_complete'} );
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=eliminated' });

                gameserver.nextRound();

            break;

            case 'winner':
                socket.emit('feedbackevent', { 'event':'loadcontrolpage', 'page': '#end_page'} );
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=winner&bank=' + gameserver.globalBank });

            break;

            case 'gameover':
                socket.broadcast.emit('uievent', { 'event':'loadpage', 'page':'transition?banner=gameover' });

            default:
                console.log('==> Unknown Event:');
                console.log(data);
        }

    });

});
