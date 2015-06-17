/*
	
	BLOCKS JS
	José María Campaña Rojas
	rev: 15 feb 2015

*/

var config = {
	constants : {
		findInterval : 15,
        click : "touchend",
        name : ""
	},
	variables : {
        konashiConnected : false,
        findIntervalTime : 0,
        serialBuffer : []
    },
    block_index : {}
};

var version = "0.7.5"

var block_objects = [];
var orderOfBlocks = [];

var logCount = 0;

var line_svg;


$('.button').on('touchstart', function(){
  $(this).css("background-color", "#b2b2b2");
});

$('.button').on('touchend', function(){
    $(this).css("background-color", "#eaeaea");
});

function log (msg) {
    
    if (logCount == 100) {
        logCount = 1;
        $("#console_log_contents_logs").html("");
    } else {
        logCount++;
    }
    
    var $msg = $("<div>").html(msg);
    $msg.prepend($("<span>", {class : "log_line"}).html(logCount));
    $("#console_log_contents_logs").prepend($msg);
    
    log_scroll.refresh();
}

function setKonashiEvents () {
    k.ready(konashi_setup);
    k.disconnected(konashi_disconected);
}

//When all the javascript code has ben loaded and the app is ready to run.
function setup ()  {
    
    //Run button
    runbutton = $("#run");
    runbutton.css({
                  position : "absolute",
                  top : "-150px",
                  left: "0px",
                  "border-radius" : "20px",
                  border : "none"
    });
    
    
    //----->
    
    
    log_scroll = new iScroll("console_log_contents");
    
    setKonashiEvents();
    
    $("#konashi_connect_loading_indicator").hide();

    $("#btn-find").on(config.constants.click, konashi_connect);
    
    $("#btn-gotit").on(config.constants.click, function () {
       
                       $("#warning").hide();
                       setTimeout (konashi_connect, 100);
                       
    });
    
    
    
    line_svg = SVG('line_svg').size(65, 980);
    
    
    
    
    
    
}

//Code for connecting to the konashi device
function konashi_connect() {
    
    $("#console_log_contents_logs").html("");
    log_scroll.refresh();

    setupBlocks();

    var konashi_name = "konashi#" + $("#input_konashi_name").val();
    config.constants.name = konashi_name;

    $("#btn-find").hide();
    $("#connect_dialog_order").hide();
    $("#input_konashi_name").hide();
    $("#konashi_connect_loading_indicator").show();

    k.findWithName(konashi_name);

    console.log("connecting to " + konashi_name);

    //If no connection is stablished reset the connect button
    connectinterval = setInterval(function () {
        config.variables.findIntervalTime++;

        if (config.variables.konashiConnected) {
            clearInterval(connectinterval);
        }

        if (config.variables.findIntervalTime == config.constants.findInterval) {
            config.variables.findIntervalTime = 0;
            $("#btn-find").show();
            $("#connect_dialog_order").show();
            $("#input_konashi_name").show();
            $("#konashi_connect_loading_indicator").hide();
            clearInterval(connectinterval);
        }
    }, 1000);
}

function setupBlocks () {
    
    var device = "retina";
    
    for (bl in config.block_index.blocks) {
		var block = config.block_index.blocks[bl];
        block_objects.push(new window[block.name](device));        
    }
    
    log("Welcome to js.bit "+version);
    
}

function drawActiveBlocks () {
    
}

//The konashi setup function.
function konashi_setup () {

    console.log("Setting up Konashi");
    
    k.pinMode(k.LED2, k.OUTPUT);
    k.digitalWrite(k.LED2, k.HIGH);    
    
    k.uartMode(k.KONASHI_UART_ENABLE);
    k.uartBaudrate(k.KONASHI_UART_RATE_9K6);
    
    k.uartWrite(parseInt(9));
    
    $("#blrefresh").on(config.constants.click, function () {
        log("Refreshing Main Box");
        k.uartWrite(parseInt(9));
    });
    
    $("#run").on(config.constants.click, function () {
        generateCodeAndRun();
    });
    
    $("#reset").on(config.constants.click, function () {
        reset();
    });
    
    k.completeUartRx(function(value){
        var char = String.fromCharCode(value);
        //var char = value;
        
        if (char == ">") {
            parseSerial(config.variables.serialBuffer);
        } else if (char == "<") {
        	$("#klog").html("");            
            while(config.variables.serialBuffer.length > 0) {
                config.variables.serialBuffer.pop();
            }
        } else {
            if (value < 32) $("#klog").append(value);
            else $("#klog").append(char);
            
            config.variables.serialBuffer.push(value);
        }
     });
     		
    $("#konashi").fadeOut();
    
    config.variables.konashiConnected = true;
	console.log("Konashi setup end");
}

//When konashi is disconnected
function konashi_disconected () {
    k.off("completeUartRx");    
	config.variables.konashiConnected = true;
    $("#btn-find").show();
    $("#connect_dialog_order").show();
    $("#input_konashi_name").show();
    $("#konashi_connect_loading_indicator").hide();
    $("#konashi").fadeIn();
	console.log("Konashi disconnected");
    
    $("#blrefresh").off(config.constants.click);
    $("#run").off(config.constants.click);
    $("#reset").off(config.constants.click);
    
}

function parseSerial(buffer) {
    
    
    var command = String.fromCharCode(buffer[0]);
    
    
    
    if (command == 'U') {
        //updateblock
        
        
        
        var addr = buffer[2];
        var value = buffer[4];
        
        if (addr == 5) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([buffer[4], buffer[5], buffer[6]]);
        } else if (addr == 8) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([buffer[4], buffer[5], buffer[6]]);
        } else if (addr == 11) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([buffer[4], buffer[5], buffer[6]]);
        } else if (addr == 12) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([buffer[4], buffer[5], buffer[6]]);
        } else if (addr == 19) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([buffer[4], buffer[5], buffer[6]]);
        } else if (addr == 20) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([buffer[4], buffer[5], buffer[6]]);
        } else if (addr == 21) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([buffer[4], buffer[5], buffer[6]]);
        } else {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue(value);
        }
        
        /*
        if (addr == 8) {
            block_objects[getIndexOfObjectWithAddress(addr)].updateValue([value, buffer[5], buffer[6]]);
        }
        */
        
        button.css({ "background-color" : "#f98787"  });
        
    } else if (command == 'H' || command == 'R' ) {
        //Hello!
    } else {
        
        //log("buff ("+buffer.length+") "+buffer);
        var tempActive = [];
        
        if (command != "E") {
            for (var i = 0; i < buffer.length; i ++) {
                tempActive.push(Number(buffer[i]));
            }
        }
        
        

        orderOfBlocks = tempActive;

        //Update graphics

        
        
        var indenting = 0;
        
        for (var i = 0; i < orderOfBlocks.length; i++) {
            

            indenting -= (checkdeIndent(orderOfBlocks[i]) && indenting > 0) ? 1 : 0;
            
            block_objects[getIndexOfObjectWithAddress(orderOfBlocks[i])].updateIndex(orderOfBlocks[i]);
            block_objects[getIndexOfObjectWithAddress(orderOfBlocks[i])].indent = indenting;
            
            indenting += (checkIndent(orderOfBlocks[i])) ? 1 : 0;
        }

        for (var i = 0; i < block_objects.length; i++) {
            if (block_objects[i].active && !blockOnList(block_objects[i].address)) {
                //Si está activo pero no en la lista
                //Remover eventos del bloque
                block_objects[i].active = false;
                //block_objects[i].cleanGraphics();
            } else if (block_objects[i].active && blockOnList(block_objects[i].address)) {
                //Si está activo y si en la lista
                //actualizar informacion
                //block_objects[i].updateGraphics();
            } else if (!block_objects[i].active && blockOnList(block_objects[i].address)) {
                //Si está inactivo y está en la lista
                //Activar los eventos para los bloques
                block_objects[i].active = true;       
            }

            block_objects[i].drawed = false;

            if (block_objects[i].polyline) block_objects[i].polyline.remove();
        }

        var $codeEditor = $("#code_editor");    
        var $block_area = $("#blockArea");

        $codeEditor.html("");
        $block_area.html("");

        for (var i = 0; i < orderOfBlocks.length; i++) {
            block_objects[getIndexOfObjectWithAddress(orderOfBlocks[i])].generateGraphics($block_area, $codeEditor);
        }
        
        
        updateRunButton();
        
        }
    
}

function blockOnList(addr) {
    for (var i = 0; i < orderOfBlocks.length; i++)
        if (orderOfBlocks[i] == addr)
            return true;
    return false;
}

function getIndexOfObjectWithAddress(addr) {
    for (var i = 0; i < block_objects.length; i++) {
        if (block_objects[i].address == addr) {
            return i;
        }
    }
}

function sendToBlock(who, v1, v2, v3) {
    k.uartWrite(parseInt(1));
    k.uartWrite(parseInt(who));
    k.uartWrite(parseInt(v1));
    k.uartWrite(parseInt(v2));
    k.uartWrite(parseInt(v3));
}

function generateCodeAndRun() {
   
    
    $("#run").css({"background-color" : "#b7b7ba" });
    
    code = "";
    for (var i = 0; i < orderOfBlocks.length; i++) {
        code += block_objects[getIndexOfObjectWithAddress(orderOfBlocks[i])].generateCode();
    }

    log(code);

    try {
        eval(code);
    } catch (err) {
        log("<span style=\"color : red; font-weight : bold;\">Error executing code:  " + err.message + "</span>");
    }
}

function reset () {
    log("Resetting block state");
    if (blockOnList(11)) lightbox(0, 0, 0);
    if (blockOnList(13)) logbox(99);
    if (blockOnList(15)) motorbox(90);
}


//update run button

function updateRunButton () {
    
    button =  $("#run");
    elements = $("#code_editor > div");
    
    if (elements.length) {
        button.fadeIn();
        button.css({"z-index" : "-9999999" });
        button.animate({ top: (elements.last().offset().top - 25)+"px" }, 300, "swing", function () {
                            button.css({"z-index" : "9999999" });
                       });
        button.css({ "background-color" : "#f98787"  });
    } else {
        button.fadeOut();
    }
    
}



//-------->
