var socket = false;


function initSocket()
{
    socket = io.connect(window.location.host);

    socket.on('init', function (data){
        jQuery('.status').html('Connected to Game Server');
    });

    socket.on('feedbackevent', function (data)
    {
        switch(data.event)
        {
            case 'loadplayers':
                if( data.players !== undefined )
                {
                    for( var i = 0; i < data.players.length; i++)
                    {
                        jQuery('#playerlist').append('<a href="#" data-role="button" class="playerbutton">' + data.players[i] + '</a>');
                    }
                    jQuery('.playerbutton').buttonMarkup("refresh");
                }
                else
                {
                    console.log("Cannot Init Players... data error!");
                }
            break;
            case 'loadcontrolpage':
                jQuery.mobile.changePage( data.page );
            break;

            case 'loadfinalplayers':
                // Used when displaying the final
                console.log(data);
                jQuery('#player1').val( data.players[0].ame );
                jQuery('#player2').val( data.players[1].name );
                jQuery('.winbutton').buttonMarkup("refresh");

                if( data.players !== undefined )
                {
                    for( var i = 0; i < data.players.length; i++)
                    {
                        jQuery('#winlist').append('<a href="#" data-role="button" player="'+ data.players[i].name +'" onclick="WinHandler(this);" class="winbutton">' + data.players[i].name + '</a>');
                    }
                    jQuery('.winbutton').buttonMarkup("refresh");
                    jQuery('.requesting').hide();
                }
            break;

            case 'timerend':
                jQuery('#questionbox').val( "" );
                jQuery('#questionbox').attr('gid', 0);
                jQuery('#answerbox').val( "" );
                jQuery.mobile.changePage( "#end_round_page" );

                jQuery('#roundbank').html(data.roundbank);
                jQuery('#globalbank').html(data.globalbank);
                jQuery('#weakestlink').html(data.weakestlink);
                jQuery('#strongestlink').html(data.strongestlink);
                jQuery('#roundnum').html(data.roundnumber);
            break;

            case 'roundreply':
                if(data.round == 7){ jQuery.mobile.changePage('#start_h2h_page'); }
                var minutes = Math.floor(data.time / 60);
                var seconds = data.time - (60 * minutes);
                jQuery('#totalroundtime').html(minutes + " Minutes " + seconds + " Seconds");
                jQuery('#roundnumber').html(data.round);
            break;

            case 'showquestion':
                jQuery('#questionbox').val( data.name + ": " + data.question );
                jQuery('#questionbox').attr('gid', data.gid);
                jQuery('#answerbox').val( data.answer );

                jQuery('#h2hquestionbox').val( data.name + ": " + data.question );
                jQuery('#h2hquestionbox').attr('gid', data.gid);
                jQuery('#h2hanswerbox').val( data.answer );
            break;

            case 'loadvotelist':
                jQuery('#votelist').html("<p class='requesting'>Requesting List...</p>");
                if( data.players !== undefined )
                {
                    for( var i = 0; i < data.players.length; i++)
                    {
                        jQuery('#votelist').append('<a href="#" data-role="button" player="'+ data.players[i] +'" onclick="VoteHandler(this);" class="votebutton">' + data.players[i] + '</a>');
                    }
                    jQuery('.votebutton').buttonMarkup("refresh");
                }
                else
                {
                    console.log("Cannot Init Players... data error!");
                }
                jQuery('.requesting').hide();

            break;

            default:
                console.log(data);
        }
    });

    socket.emit('controlevent', { 'event':'getplayers'} );
}

/*
 * Handle voting for a player in Controller UI.
 */
function VoteHandler(button)
{
    var playername = jQuery(button).attr('player');
    jQuery('#playervote').html(playername);
    jQuery('#confirmvote').attr('player',playername);
    $.mobile.changePage( "#confirm_vote", { role: "dialog" } );
}

/*
 * Handle Winning for a player in Controller UI.
 */
function WinHandler(button)
{
    var playername = jQuery(button).attr('player');
    jQuery('#playerwin').html(playername);
    jQuery('#confirmwin').attr('player',playername);
    $.mobile.changePage( "#confirm_win", { role: "dialog" } );
}


/*
 * Dispatch an event for a button press.
 */
function UIHandler(control, button)
{
    switch(button)
    {
        case 'mainstart':
            socket.emit('controlevent', { 'event':'mainstart' });
        break;

        case 'roundinfo':
            socket.emit('controlevent', { 'event':'roundinfo' });
        break;

        case 'endround':
            socket.emit('controlevent', { 'event':'endround' });
        break;

        case 'startround':
            socket.emit('controlevent', { 'event':'startround' });
        break;

        case 'starth2h':
            socket.emit('controlevent', { 'event':'starth2h' });
        break;

        case 'right':
            var qgid = jQuery('#questionbox').attr('gid');
            if(qgid)
            {
                socket.emit('controlevent', { 'event':'rightevent', 'gid':qgid });
            }
            else{ console.log("Question without gid. Cannot submit right event."); }
        break;

        case 'wrong':
            var qgid = jQuery('#questionbox').attr('gid');
            if(qgid)
            {
                socket.emit('controlevent', { 'event':'wrongevent', 'gid':qgid });
            }
            else{ console.log("Question without gid. Cannot submit wrong event."); }
        break;

        case 'h2hright':
            var qgid = jQuery('#h2hquestionbox').attr('gid');
            if(qgid)
            {
                socket.emit('controlevent', { 'event':'h2hrightevent', 'gid':qgid });
            }
            else{ console.log("Question without gid. Cannot submit right event."); }
        break;

        case 'h2hwrong':
            var qgid = jQuery('#h2hquestionbox').attr('gid');
            if(qgid)
            {
                socket.emit('controlevent', { 'event':'h2hwrongevent', 'gid':qgid });
            }
            else{ console.log("Question without gid. Cannot submit wrong event."); }
        break;

        case 'bank':
            socket.emit('controlevent', { 'event':'bankevent' });
        break;

        case 'letsvote':
            // This event should cause the game server to emit a list of valid players.
            socket.emit('controlevent', { 'event':'letsvote' });
        break;

        case 'eliminate':
            // This event should cause the selected player to be eliminated.
            // We then should diplay the transistion page for elimination.
            // Then go to the next round or head to head if players.length == 2.
            var player = jQuery('#confirmvote').attr('player');
            console.log(player);
            socket.emit('controlevent', { 'event':'eliminateplayer', 'player': player });
        break;

        case 'winner':
            var player = jQuery('#confirmwin').attr('player');
            socket.emit('controlevent', { 'event':'winner', 'player': player });
        break;

        case 'gameover':
            socket.emit('controlevent', { 'event':'gameover' });
        break;

        default: break;
    }
}


/*
 * Start the fun when the page loads.
 */
jQuery(document).ready(function(){
    initSocket();
});
