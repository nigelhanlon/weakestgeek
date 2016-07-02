var socket = false;
var points = [0, 20,50,100,200,300, 450, 600, 800,1000];
var currentBank = 0;

function initSocket()
{
    socket = io.connect(window.location.host);

    socket.on('init', function (data) {
        socket.emit('controlevent', { 'event':'gamepageloaded' });
    });

    socket.on('uievent', function (data)
    {
        switch(data.event)
        {
            case 'showquestion':
                jQuery('#questionbox').html( "<center>-= " + data.name +" =-</center><br/>" + data.question );
            break;

            case 'setbankvalue':
                updateBankValue(data.value);
            break;

            case 'setbanktotal':
                setBankTotal(data.value);
            break;

            case 'startcountdown':
                startCountdown(data.value)
            break;

            case 'loadpage':
                if(data.page)
                {
                    window.location.href = "http://" + window.location.host + "/" + data.page;
                }
            break;
            default: break;
        }
    });
}

jQuery(document).ready(function(){
    initSocket();
});

function updateBankValue(value)
{
    if(value == 0) // reset bank
    {
        for(var i = 0; i < points.length; i++)
        {
            jQuery('#bluescore' + points[i]).show();
            jQuery('#redscore' + points[i]).hide();
        }
    }
    else
    {
        jQuery('#bluescore' + value).hide();
        jQuery('#redscore' + value).show();
    }
}

function setBankTotal(value)
{
    if(value < 10)
    {
        jQuery('#banktotal').css('left','123px');
    }
    else if(value < 100)
    {
        jQuery('#banktotal').css('left','118px');
    }
    else if(value < 1000)
    {
        jQuery('#banktotal').css('left','111px');
    }
    else
    {
        jQuery('#banktotal').css('left','103px');
    }
    jQuery('#banktotal').html(value);
}

/*
 *  Methods to run the countdown.
 */

var countdown = false;
var seconds = 0;

function stopCountdown(){ clearInterval(countdown); jQuery('#timer').html( "0:00" ); }
function startCountdown(start)
{
    seconds = start;
    countdown = setInterval( function(){
        if(seconds > 0)
        {
            var timeString = secondsToMinuteString(seconds);
            jQuery('#timer').html( timeString );
            seconds = seconds - 1;
        }
        else if(seconds == 0)
        {
            jQuery('#timer').html( "0:00" );
            clearInterval(countdown);
            socket.emit('controlevent', { 'event':'timerend' });
        }
    },1000);
}

function secondsToMinuteString(seconds)
{
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds - minutes * 60;

    // Pad the minutes and seconds with leading zeros, if required
    minutes = ( minutes < 10 ? "0" : "" ) + minutes;
    seconds = ( seconds < 10 ? "0" : "" ) + seconds;
    return minutes + ":" + seconds;
}
