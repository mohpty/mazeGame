var CANV = document.getElementById('mazeCanvas');
var CTx = canvas.getContext('2d');
var PLAYERLVL = 1;
function startGameMenu(){
    $('.mainMenu').fadeToggle('slow', function(){
        CTx.clearRect(0, 0, canvasSize, canvasSize);
        $('.mazeContainer').fadeIn('fast', function(){
            initGame(PLAYERLVL);
        });
        $('#mazeCanvas').fadeIn('fast');

    });
    
}
// ----------
// Modal Customization
function customModal(state){
    $('.modal p .h2').html("");
    $('.modal .button').html(""); // Clear the current innerHTML
    if(state === 'winLevel')
    {
        var newContent = $('<p class="h2">Level <strong></strong> <span>Completed</span></p>');
        $('.modal p.h2').html(newContent.html());
        $('.modal .h2 strong').text(PLAYERLVL);
        $('.modal .button').append("<a id='nextLevelButton' rel='modal:close' class='Button'>Next Level <span class='silkscreen-bold'>></span></a>");
        
        // Setting the event again because it's a new element
        // Next level button
        $('.modal .button a').click(()=>{
            PLAYERLVL += 1;
            CTx.clearRect(0, 0, canvasSize, canvasSize);
            $('.mazeContainer').fadeIn('fast', function(){
                initGame(PLAYERLVL);
            });
        })
    }
    else if(state === 'winGame'){
        var newContent = $('<p class="h2"><span>Congratulations<br>you finished the game!</span></p>');
        $('.modal p.h2').html(newContent.html());
        $('.modal .button').append("<a rel='modal:close' class='Button mazeBackButton'><span class='silkscreen-bold'><</span>Main Menu</a>");
        // Setting the event again because it's a new element
        // Next level button
        $('.modal .button a').click(()=>{
            PLAYERLVL = 0;
            CTx.clearRect(0, 0, canvasSize, canvasSize);
            $('.mazeContainer').fadeOut('fast', function(){
                $('.mainMenu').fadeIn('fast');
            });
        })    
    }
    
    $('.modal').modal({
        fadeDuration:100,
        escapeClose: false,
        clickClose: false,
        showClose: false
    });
}
// ----------

// $('.modal').modal({
//     fadeDuration:100,
//     escapeClose: false,
//     clickClose: false,
//     showClose: false
// });


// Credits Page functionality -----
$('#creditsButton').click(function creditsMenu(){
    $('.mainMenu').fadeToggle('slow', function(){
        $('.credits').fadeIn('slow');
    });
});

$('#creditsBackButton').click(function(){
    $('.credits').fadeOut('slow', function(){
        $('.mainMenu').fadeToggle('slow');
    });
});

$('.mainMenuButton').click(function(){
    alert("U");
});
// ----------

// Maze Functionality -----
$('.mazeBackButton').click(function(){
    $('.mazeContainer').fadeOut('slow', function(){
        $('.mainMenu').fadeIn('slow');
    });
});

$('#mazeResetButton').click(function(){
    initGame();
});


// Countdown
var countdownInterval;
function initCountdown() {
    var seconds = 90;
    function updateCountdown() {
      var minutes = Math.floor(seconds / 60);
      var remainingSeconds = seconds % 60;
  
      // Format the time with leading zeros
      var formattedMinutes = minutes.toString().padStart(2, "0");
      var formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  
      $('#countdown').html(formattedMinutes + ":" + formattedSeconds);
  
      if (seconds === 0) {
        // Timer finished! You can optionally add an action here.
        alert("Time's Up!");
        clearInterval(countdownInterval);
      }
  
      seconds--;
    }
  
    countdownInterval = setInterval(updateCountdown, 1000);
};
function stopCountdown() {
    clearInterval(countdownInterval);
}
// ----------