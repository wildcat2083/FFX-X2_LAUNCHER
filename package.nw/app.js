var win = nw.Window.get();
var fs = require('fs');
var os = require('os');
var path = require('path');
var nwPath = process.execPath;
var nwDir = path.dirname(nwPath);
var ini = require(nwDir+'\\package.nw\\lib\\ini.js');

var isGamepadConnected = false;
var gamepad = undefined;
var LastFrameButtonStatus=[];
var AFirstPressed = false;
var insideSettings = false;
var unxIsPresent = false;
var curPosition = 0;
var curPosition_setting = 1;
var isRunning = false;
var resolutionList = [
    "1440*900",
    "1920*1080",
    "1680*1050",
    "1600*1024",
    "1600*900",
    "1366*768",
    "1360*768",
    "1280*1024",
    "1280*960",
    "1280*800",
    "1280*768",
    "1280*720",
    "1152*864",
    "1024*768",
    "800*600",
    "720*576",
    "720*480",
    "640*480" ]
var currrentResolution = undefined;
var cursorTimeout = 0.5;
var volumeBGM = 0.3;
 if (localStorage.getItem("volumeBGM") === null){}
 else
 {
  volumeBGM = parseFloat(localStorage.volumeBGM);
 }
  
  $(document).ready(function() {
  
  updateVolumeBGM(0);
  mouse_fallback();
  
  if(!!navigator.getGamepads){

    $(window).on("gamepadconnected", function() {
                    isGamepadConnected = true;
                    $("#prompt").css("visibility","hidden")
                    $(".button").attr("gamepad","");
                    $("#button0").attr("gamepad","selected");
                    curPosition = 0;
                    PlaySound(0);
                    if (insideSettings){
                      $("#setting1").find(".cursor").css("visibility","visible")
                      curPosition_setting = 1;
                    }                 
                    gamepad = navigator.getGamepads()[0];
                    for (i = 0; i < gamepad.buttons.length-4; i++) {
                      LastFrameButtonStatus[i] = false;
                    }
                    UserInput = window.setInterval(getGamepadInput,100);
    });

    $(window).on("gamepaddisconnected", function() {
        isGamepadConnected = false;
        $("#prompt").css("visibility","visible")
        $(".button").attr("gamepad","");
        window.clearInterval(UserInput);
    });
  }
  
});


function settings_write_ini(){

  var ff_ini = homedir()+"\\Documents\\SQUARE ENIX\\FINAL FANTASY X&X-2 HD Remaster\\GameSetting.ini"; 
  var unx_ini = nwDir+'\\UnX.ini';
  
  fs.stat(ff_ini, function(err, stat) {
      if(err == null) {

          var config = ini.parse(fs.readFileSync(ff_ini, 'utf8'));

          if ($('#text_en').is("[selected='selected']")) { config.Language = "en"; }
          else if ($('#text_fr').is("[selected='selected']")) { config.Language = "fr"; }
          else if ($('#text_de').is("[selected='selected']")) { config.Language = "de"; }
          else if ($('#text_it').is("[selected='selected']")) { config.Language = "it"; }
          else if ($('#text_es').is("[selected='selected']")) { config.Language = "es"; }
          else if ($('#text_jp').is("[selected='selected']")) { config.Language = "jp"; }
          else if ($('#text_cn').is("[selected='selected']")) { config.Language = "cn"; }
          else if ($('#text_kr').is("[selected='selected']")) { config.Language = "kr"; }

          config.Resolution = resolutionList[currrentResolution];

          if ($('#screen_full').is("[selected='selected']")) { config.ScreenMode = "SM_FULLSCREEN"; }
          else if ($('#screen_border').is("[selected='selected']")) { config.ScreenMode = "SM_BORDERLESS"; }
          else if ($('#screen_win').is("[selected='selected']")) { config.ScreenMode = "SM_WINDOW"; }

          if ($('#quality_low').is("[selected='selected']")) { config.Quality = "VQ_LOW"; }
          else if ($('#quality_medium').is("[selected='selected']")) { config.Quality = "VQ_MEDIUM"; }
          else if ($('#quality_high').is("[selected='selected']")) { config.Quality= "VQ_HIGH"; }

          fs.writeFileSync(ff_ini, ini.stringify(config), 'utf8');
  }
  });

  if (unxIsPresent) {

      config = ini.parse(fs.readFileSync(unx_ini, 'utf16le').slice(1));

      if ($('#dpi_isDisabled').is("[selected='selected']")) { config.UnX.Display.DisableDPIScaling = "true"; }
      else if ($('#dpi_isEnabled').is("[selected='selected']")) { config.UnX.Display.DisableDPIScaling = "false"; }

      if ($('#hide_cursor').is("[selected='selected']")) { config.UnX.Input.ManageCursor = "true"; }
      else if ($('#show_cursor').is("[selected='selected']")) { config.UnX.Input.ManageCursor = "false"; }

      if ($('#donothing_on_kinput').is("[selected='selected']")) { config.UnX.Input.KeysActivateCursor = "false"; }
      else if ($('#show_on_kinput').is("[selected='selected']")) { config.UnX.Input.KeysActivateCursor = "true"; }

      if ($('#audio_en').is("[selected='selected']")) { config.UnX.Language.Voice = "en"; }
      else if ($('#audio_jp').is("[selected='selected']")) { config.UnX.Language.Voice = "jp"; }

      config.UnX.Input.CursorTimeout = cursorTimeout;

      fs.writeFileSync(unx_ini, '\ufeff'+ini.stringify(config), 'utf16le');
   }

  localStorage.volumeBGM = volumeBGM;

  PlaySound(3);
}

function settings_read_ini(){

  $('.btn').removeAttr( "selected" );

  var ff_ini = homedir()+"\\Documents\\SQUARE ENIX\\FINAL FANTASY X&X-2 HD Remaster\\GameSetting.ini"; 
  var unx_ini = nwDir+'\\UnX.ini';

  
  fs.stat(ff_ini, function(err, stat) {
      if(err == null) {
  
      var config = ini.parse(fs.readFileSync(ff_ini, 'utf8'));
      
        switch (config.Language) {
            case 'en':
                    $('#text_en').attr('selected', 'selected' ); 
            break;
            case 'fr':
                    $('#text_fr').attr('selected', 'selected' ); 
            break;
            case 'de':
                    $('#text_de').attr('selected', 'selected' ); 
            break;
            case 'it':
                    $('#text_it').attr('selected', 'selected' ); 
            break;
            case 'es':
                    $('#text_es').attr('selected', 'selected' ); 
            break;
            case 'jp':
                    $('#text_jp').attr('selected', 'selected' ); 
            break;
            case 'cn':
                    $('#text_cn').attr('selected', 'selected' ); 
            break;
            case 'kr':
                    $('#text_kr').attr('selected', 'selected' ); 
            break;
            default:
                    $('#text_en').attr('selected', 'selected' );
            break;
        }

        for (i = 0; i < resolutionList.length; i++) {  
          if (config.Resolution == resolutionList[i]) { currrentResolution = i; break; }
          else if ( i == resolutionList.length-1) { currrentResolution = 1; }
        } 
        $("#resolution").text(resolutionList[currrentResolution]);

      switch (config.ScreenMode) {
            case 'SM_FULLSCREEN':
                    $('#screen_full').attr('selected', 'selected' ); 
            break;
            case 'SM_BORDERLESS':
                    $('#screen_border').attr('selected', 'selected' ); 
            break;
            case 'SM_WINDOW':
                    $('#screen_win').attr('selected', 'selected' ); 
            break;
            default:
                    $('#screen_full').attr('selected', 'selected' );
            break;
        }
        
        switch (config.Quality) {
            case 'VQ_HIGH':
                    $('#quality_high').attr('selected', 'selected' ); 
            break;
            case 'VQ_MEDIUM':
                    $('#quality_medium').attr('selected', 'selected' ); 
            break;
            case 'VQ_LOW':
                    $('#quality_low').attr('selected', 'selected' ); 
            break;
            default:
                    $('#quality_medium').attr('selected', 'selected' ); 
            break; 
        }
      }
      });
      
      fs.stat(unx_ini, function(err, stat) {
      if(err == null) {
          
          unxIsPresent = true;
          config = ini.parse(fs.readFileSync(unx_ini, 'utf16le').slice(1));

          switch (config.UnX.Display.DisableDPIScaling) {
              case true:
                      $('#dpi_isDisabled').attr('selected', 'selected' ); 
              break;
              case false:
                      $('#dpi_isEnabled').attr('selected', 'selected' ); 
              break;
              default:
                      $('#dpi_isDisabled').attr('selected', 'selected' );
              break;
          }
          
          switch (config.UnX.Input.ManageCursor) {
              case true:
                      $('#hide_cursor').attr('selected', 'selected' ); 
              break;
              case false:
                      $('#show_cursor').attr('selected', 'selected' ); 
              break;
              default:
                      $('#hide_cursor').attr('selected', 'selected' );
              break;
          }
          
          switch (config.UnX.Input.KeysActivateCursor) {
              case true:
                      $('#show_on_kinput').attr('selected', 'selected' ); 
              break;
              case false:
                      $('#donothing_on_kinput').attr('selected', 'selected' ); 
              break;
              default:
                      $('#donothing_on_kinput').attr('selected', 'selected' );
              break;
          }
          
          switch (config.UnX.Language.Voice) {
              case 'jp':
                      $('#audio_jp').attr('selected', 'selected' ); 
              break;
              case 'en':
                      $('#audio_en').attr('selected', 'selected' ); 
              break;
              default:
                      $('#audio_jp').attr('selected', 'selected' );
              break;
          }
          
          cursorTimeout = parseFloat(config.UnX.Input.CursorTimeout);
          $('#cursortimeout').text(cursorTimeout+"s")
          
          
          $('#input').show();
          $('#setting6').show();
          $('#setting2').show();
          
      } else {
          
          $('#input').hide();
          $('#setting6').hide();
          $('#setting2').hide();
      }
  });
    
    
}


function updateVolumeBGM(i){

            var audio = document.getElementById('bgm');
    
               var volume = (volumeBGM+i)
               if (volume <= 0) { volume = 0 }
               else if (volume >= 1) { volume = 1 }

               audio.volume= volume.toFixed(2);
               volumeBGM= audio.volume;
               $('#volume').text(volumeBGM*100+"%");
}

function PlaySound(i){

            var audio = document.getElementById('sfx');
            var source = document.getElementById('oggSource');
            
            audio.volume=1
            switch (i){
                  case 0:
                      source.src='resources/sound/sfx_select.ogg'
                  break;
                  case 1:
                      source.src='resources/sound/sfx_cancel.ogg'
                  break;
                  case 2:
                      source.src='resources/sound/sfx_enter.ogg'
                  break;
                  case 3:
                      source.src='resources/sound/sfx_save.ogg'
                      audio.volume=0.5
                  break;
            }
    
                audio.load();
                audio.play();
}

function menuSelect(i){
  if (!isRunning) {
    isRunning = true;
    $("#button"+curPosition).attr("gamepad","");
    curPosition += i;

    if ( curPosition == 7 ) { curPosition = 0; }
    else if ( curPosition == -1 ) { curPosition = 6; }


    $("#button"+curPosition).attr("gamepad","selected");
    PlaySound(0);
    
    setTimeout(function() {
        isRunning = false;
    }, 100);

  }
}

function settingSelect(i){

  if (!isRunning) {
    isRunning = true;
    $(".cursor").css("visibility","hidden")
    if (!unxIsPresent) { var previousPosition = curPosition_setting; }
    curPosition_setting += i;

    if (!unxIsPresent) { 
         if ( previousPosition < curPosition_setting && curPosition_setting == 6 ) { curPosition_setting += 4; }
         else if ( previousPosition > curPosition_setting && curPosition_setting == 9 ) { curPosition_setting -= 4; }
         else if ( previousPosition < curPosition_setting && curPosition_setting == 2 ) { curPosition_setting += 1; }
         else if ( previousPosition > curPosition_setting && curPosition_setting == 2 ) { curPosition_setting -= 1; }    
    }
    
      if ( curPosition_setting == 11 ) { curPosition_setting = 1; }
      else if ( curPosition_setting == 0 ) { curPosition_setting = 10; } 


    $("#setting"+curPosition_setting).find(".cursor").css("visibility","visible")
    PlaySound(0);
    
    setTimeout(function() {
        isRunning = false;
    }, 100);



  } 
}

function updateSetting(i){

  if (!isRunning) {
    isRunning = true;
    
    
    if (i == 1) {
    
        $("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" ).next().attr("selected","selected");
        if ( $("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").length===0 ) { $("#setting"+curPosition_setting).find(" .btn ").last().attr("selected","selected"); }
        
        
        if ( $("#setting"+curPosition_setting).find(" #resolution_setting ").length>0 ) {
            change_resolution(-1);
            setTimeout(function() {$("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" )}, 100); 
        }
        else if ( $("#setting"+curPosition_setting).find(" #timeout_setting ").length>0 ) {
            change_timeout(1);
            setTimeout(function() {$("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" )}, 100);
        }
        else if ( $("#setting"+curPosition_setting).find(" #volume_setting ").length>0 ) {
            updateVolumeBGM(0.1)
            setTimeout(function() {$("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" )}, 100);
        }

    }
    else if (i == -1){

        $("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" ).prev().attr("selected","selected");
        if ( $("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").length===0 ) { $("#setting"+curPosition_setting).find(" .btn ").first().attr("selected","selected"); }
        
        if ( $("#setting"+curPosition_setting).find(" #resolution_setting ").length>0 ) {
            change_resolution(1);
            setTimeout(function() {$("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" )}, 100);
        }
        else if ( $("#setting"+curPosition_setting).find(" #timeout_setting ").length>0 ) {
            change_timeout(-1);
            setTimeout(function() {$("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" )}, 100);
        }
        else if ( $("#setting"+curPosition_setting).find(" #volume_setting ").length>0 ) {
            updateVolumeBGM(-0.1)
            setTimeout(function() {$("#setting"+curPosition_setting).find(" .btn[selected='selected'] ").removeAttr( "selected" )}, 100);
        }
    
    }
      
    PlaySound(0);
    
    setTimeout(function() {
        isRunning = false;
    }, 100);

  } 
}



function launch(button_id){

var spawn = require("child_process").spawn

      switch(button_id) {

        case 0:
                file = nwDir+'\\FFX.exe';
                var exec = spawn(file,{stdio:[ 'ignore', 'ignore', 'ignore' ], detached: true});
                exec.unref(); 
                win.close(); 
        break;
        case 1:
                file = nwDir+'\\FFX.exe';
                var exec = spawn(file,['_ECalm'],{stdio:[ 'ignore', 'ignore', 'ignore' ], detached: true});
                exec.unref();
                win.close(); 
        break;
        case 2:
                file = nwDir+'\\FFX2.exe';
                var exec = spawn(file,{stdio:[ 'ignore', 'ignore', 'ignore' ], detached: true});
                exec.unref(); 
                win.close(); 
        break;
        case 3:
                file = nwDir+'\\FFX2.exe';
                var exec = spawn(file,['FFX2_LASTMISSION'],{stdio:[ 'ignore', 'ignore', 'ignore' ], detached: true});
                exec.unref(); 
                win.close(); 
        break;
        case 4:
                file = nwDir+'\\FFX&X-2_Will.exe';
                var exec = spawn(file,{stdio:[ 'ignore', 'ignore', 'ignore' ], detached: true});
                exec.unref(); 
                win.close(); 
        break;
        case 5:
                win.close(); 
        break;
        case 6:
                settings_read_ini();
                enter_settings();
        break;
      }             
}


function enter_settings(){

       insideSettings = true;
       PlaySound(2);
       $("#container").find(".cursor").css("visibility","hidden")
       if (isGamepadConnected){
          $("#setting1").find(".cursor").css("visibility","visible")
          curPosition_setting = 1;
       }
       $('#settings').fadeIn("slow");
                
}

function exit_settings(){

      insideSettings = false;
      PlaySound(1);
      $('#settings').fadeOut("slow");
      
}

function save_settings(){

    settings_write_ini();
    insideSettings = false;
    $('#settings').fadeOut("slow");

}

function change_resolution(i) {

    if (i == -1) {
        currrentResolution--;
        if (currrentResolution <= 0) { currrentResolution = 0 }
    }
    else if (i == 1) {
        currrentResolution++;
        if (currrentResolution >= resolutionList.length-1) { currrentResolution = resolutionList.length-1 }
    }
  $("#resolution").text(resolutionList[currrentResolution]);
  
}

function change_timeout(i){

    if (i == -1) {
        cursorTimeout -= 0.5;
        if (cursorTimeout <= 0) { cursorTimeout = 0 }
    }
    else if (i == 1) {
       cursorTimeout += 0.5;
       if (cursorTimeout >= 60) { cursorTimeout = 60 }
    }
    $('#cursortimeout').text(cursorTimeout+"s");

}


function mouse_fallback() {
  $(".button").on("mouseenter", function(e){
    $(".button").attr("gamepad","");
    PlaySound(0);
  });
  
  $(".button").on("mouseleave", function(e){
    
    if (isGamepadConnected){
      $("#button"+curPosition).attr("gamepad","selected");
    }
  });
  
   $("#button0").click(function() { launch(0); });
   $("#button1").click(function() { launch(1); });  
   $("#button2").click(function() { launch(2); });  
   $("#button3").click(function() { launch(3); });  
   $("#button4").click(function() { launch(4); });  
   $("#button5").click(function() { launch(5); });  
   $("#button6").click(function() { launch(6); });  
   
   $("#cancel_button").click(function() { 
              if (insideSettings){  exit_settings(); }
   });
   
   $("#save_button").click(function() { 
                save_settings();
   });
   
  
   $(".btn").click(function() { 
   
        $(this).parent().find(" .btn[selected='selected'] ").removeAttr( "selected" ); $(this).attr("selected","selected" ); PlaySound(0); 
   
         if ($(this).parent().find(" #resolution_setting ").length>0) {  
                  if($(this).is(':contains("+")'))  {
                    change_resolution(-1);
                  }
                  else if($(this).is(':contains("-")')) {
                    change_resolution(1);
                  }
                  var that = $(this);
                  setTimeout(function(){that.removeAttr( "selected" );}, 200);
          }
            
          else if ($(this).parent().find(" #timeout_setting ").length>0) {  
                  if($(this).is(':contains("+")'))  {
                    change_timeout(1);
                  }
                  else if($(this).is(':contains("-")')) {
                      change_timeout(-1);
                  }
                  var that = $(this);
                  setTimeout(function(){that.removeAttr( "selected" );}, 200);
          } 
              
          else if ($(this).parent().find(" #volume_setting ").length>0) {  
        
                  if($(this).is(':contains("+")'))  {
                      updateVolumeBGM(0.1)
                  }
                  else if($(this).is(':contains("-")')) {
                      updateVolumeBGM(-0.1)
                  }
                  var that = $(this);
                  setTimeout(function(){that.removeAttr( "selected" );}, 200);
          } 

   });
   
}


    function getGamepadInput() {
    
        gamepad = navigator.getGamepads()[0];
    
        for(var i=0;i<gamepad.buttons.length;i++) {
        
// Button Pressed (No 'Auto Fire')
            if (gamepad.buttons[0].pressed) { LastFrameButtonStatus[0] = true; }                                                                           
            else if (!gamepad.buttons[0].pressed && LastFrameButtonStatus[0] && AFirstPressed) { 
                    if (!insideSettings) { launch(curPosition); }else if(insideSettings){ save_settings(); }
                    LastFrameButtonStatus[0] = false;  
            } // A

            else if (gamepad.buttons[0].pressed) { LastFrameButtonStatus[0] = true; }  // Prevent Launcher from insta closing/lauching game if user push for too long A when using A as front button gamepad detection
            else if (!gamepad.buttons[0].pressed && LastFrameButtonStatus[0] ) { AFirstPressed = true; LastFrameButtonStatus[0] = false; }
                
            else if (gamepad.buttons[1].pressed) { LastFrameButtonStatus[1] = true;}
            else if (!gamepad.buttons[1].pressed && LastFrameButtonStatus[1] ) { if (insideSettings){ exit_settings(); } LastFrameButtonStatus[1] = false; } // B
            
            else if (gamepad.buttons[2].pressed) { LastFrameButtonStatus[2] = true;}
            else if (!gamepad.buttons[2].pressed && LastFrameButtonStatus[2] ) { LastFrameButtonStatus[2] = false; } // X
                       
            else if (gamepad.buttons[3].pressed) { LastFrameButtonStatus[3] = true;}
            else if (!gamepad.buttons[3].pressed && LastFrameButtonStatus[3] ) { LastFrameButtonStatus[3] = false; } // Y
                        
            else if (gamepad.buttons[4].pressed) { LastFrameButtonStatus[4] = true;}
            else if (!gamepad.buttons[4].pressed && LastFrameButtonStatus[4] ) { LastFrameButtonStatus[4] = false; } // LB
                       
            else if (gamepad.buttons[5].pressed) { LastFrameButtonStatus[5] = true;}
            else if (!gamepad.buttons[5].pressed && LastFrameButtonStatus[5] ) { LastFrameButtonStatus[5] = false; } // RB
                       
            else if (gamepad.buttons[6].pressed) { LastFrameButtonStatus[6] = true;}
            else if (!gamepad.buttons[6].pressed && LastFrameButtonStatus[6] ) { LastFrameButtonStatus[6] = false; } // LT
                       
            else if (gamepad.buttons[7].pressed) { LastFrameButtonStatus[7] = true;}
            else if (!gamepad.buttons[7].pressed && LastFrameButtonStatus[7] ) { LastFrameButtonStatus[7] = false; } // RT
                       
            else if (gamepad.buttons[8].pressed) { LastFrameButtonStatus[8] = true;}
            else if (!gamepad.buttons[8].pressed && LastFrameButtonStatus[8] ) { LastFrameButtonStatus[8] = false; } // Back
                       
            else if (gamepad.buttons[9].pressed) { LastFrameButtonStatus[9] = true;}
            else if (!gamepad.buttons[9].pressed && LastFrameButtonStatus[9] ) { LastFrameButtonStatus[9] = false; } // Start
                       
            else if (gamepad.buttons[10].pressed) { LastFrameButtonStatus[10] = true;}
            else if (!gamepad.buttons[10].pressed && LastFrameButtonStatus[10] ) { LastFrameButtonStatus[10] = false; } // JoyLeftButton (1)
                        
            else if (gamepad.buttons[11].pressed) { LastFrameButtonStatus[11] = true;}
            else if (!gamepad.buttons[11].pressed && LastFrameButtonStatus[11] ) { LastFrameButtonStatus[11] = false; } // JoyRightButton (2)

// Button Pressed ('Auto Fire') 
            else if (gamepad.buttons[12].pressed) { 
                  if (!insideSettings) { menuSelect(-1)}
                  else if(insideSettings) { settingSelect(-1) } 
            } // D-Pad up
            else if (gamepad.buttons[13].pressed) { 
                  if (!insideSettings) { menuSelect(1)} 
                  else if(insideSettings) { settingSelect(1) }
            } // D-Pad Down
            else if (gamepad.buttons[14].pressed) { if(insideSettings) { updateSetting(-1) } } // D-Pad Left
            else if (gamepad.buttons[15].pressed) { if(insideSettings) { updateSetting(1) } } // D-Pad Right
        }
 
        for(var i=0;i<gamepad.axes.length; i+=2) {
 
            if (gamepad.axes[0] == -1 ) { if(insideSettings) { updateSetting(-1) } } //Joy1 Left
            else if (gamepad.axes[0] == 1 ) { if(insideSettings) { updateSetting(1) } } //Joy1 Right
            else if (gamepad.axes[1] == -1 ) { 
                  if (!insideSettings) { menuSelect(-1)}
                  else if(insideSettings) { settingSelect(-1) }  
            } //Joy1 Up
            else if (gamepad.axes[1] == 1 ) { 
                  if (!insideSettings) { menuSelect(1)} 
                  else if(insideSettings) { settingSelect(1) }
             } //Joy1 Down 
            
            if (gamepad.axes[2] == -1 ) {} //Joy2 Left
            else if (gamepad.axes[2] == 1 ) {} //Joy2 Right
            else if (gamepad.axes[3] == -1 ) {} //Joy2 Up
            else if (gamepad.axes[3] == 1 ) {} //Joy2 Down 
        }
    }