var socket = false;

function initSocket()
{
    socket = io.connect(window.location.host);

    socket.on('init', function (data) {
        socket.emit('controlevent', { 'event':'h2hpageloaded' });
    });

    socket.on('uievent', function (data)
    {
        switch(data.event)
        {
            case 'loadh2hplayers':
                jQuery('#player1').html( data.players[0].name );
                jQuery('#player2').html( data.players[1].name );
            break;

            case 'showquestion':
                jQuery('#h2h_questionbox').html( "<center>-= " + data.name +" =-</center><br/>" + data.question );
            break;

            case 'markcorrect':
                jQuery('#' + data.id + 'active').hide();
                jQuery('#' + data.id + 'correct').show();
            break;

            case 'markwrong':
                jQuery('#' + data.id + 'active').hide();
                jQuery('#' + data.id + 'wrong').show();
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
