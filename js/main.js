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
    stopCountdown();
});
// ----------

// Maze Functionality -----
$('.mazeBackButton').click(function(){
    $('.mazeContainer').fadeOut('slow', function(){
        PLAYERLVL = 1;
        $('.levelNumber').text(PLAYERLVL);
        $('.gameMessages').text("");
        $('.mainMenu').fadeIn('slow');
    });
    stopCountdown();
});

$('#mazeResetButton').click(function(){
    initGame();
    stopCountdown();
});

$('.nextLevelButton').click(()=>{
    if (!gameWon)
        return null;

    PLAYERLVL += 1;
    stopCountdown();
    $('.levelNumber').text(PLAYERLVL);
    CTx.clearRect(0, 0, canvasSize, canvasSize);
    $('.mazeContainer').fadeIn('fast', function(){
        initGame(PLAYERLVL);
    });
    $('.nextLevelButton').fadeOut('fast');
    $('.gameMessages').fadeOut("fast", ()=>$('.gameMessages').html(""));
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
        clearInterval(countdownInterval);
        $('.gameMessages').html("Time's Up<br>Your score is " + PLAYERLVL-1 + "/10");
      }
  
      seconds--;
    }
  
    countdownInterval = setInterval(updateCountdown, 1000);
};
function stopCountdown() {
    clearInterval(countdownInterval);
}
// ----------