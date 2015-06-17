function logbox (val) {
    if (config.variables.konashiConnected) {
        if (blockOnList(13)) {
            log("logbox: "+val);
            if (val >= 0 && val <= 9) {
                var valToBlock = 0;
                
                if (config.constants.name == "konashi#4-0947") {
                    switch (val) {
                        case 0:
                            sendToBlock(13, 18, 0, 0);
                            break;
                        case 1:
                            sendToBlock(13, 35, 0, 0);
                            break;
                        case 2:
                            sendToBlock(13, 45, 0, 0);
                            break;
                        case 3:
                            sendToBlock(13, 59, 0, 0);
                            break;
                        case 4:
                            sendToBlock(13, 73, 0, 0);
                            break;
                        case 5:
                            sendToBlock(13, 84, 0, 0);
                            break;
                        case 6:
                            sendToBlock(13, 96, 0, 0);
                            break;
                        case 7:
                            sendToBlock(13, 109, 0, 0);
                            break;
                        case 8:
                            sendToBlock(13, 123, 0, 0);
                            break;
                        case 9:
                            sendToBlock(13, 135, 0, 0);
                            break;
                        default:
                            
                    }

                } else {
                    switch (val) {
                        case 0:
                            sendToBlock(13, 6, 0, 0);
                            break;
                        case 1:
                            sendToBlock(13, 18, 0, 0);
                            break;
                        case 2:
                            sendToBlock(13, 26, 0, 0);
                            break;
                        case 3:
                            sendToBlock(13, 37, 0, 0);
                            break;
                        case 4:
                            sendToBlock(13, 51, 0, 0);
                            break;
                        case 5:
                            sendToBlock(13, 62, 0, 0);
                            break;
                        case 6:
                            sendToBlock(13, 74, 0, 0);
                            break;
                        case 7:
                            sendToBlock(13, 86, 0, 0);
                            break;
                        case 8:
                            sendToBlock(13, 99, 0, 0);
                            break;
                        case 9:
                            sendToBlock(13, 109, 0, 0);
                            break;
                        default:
                            
                    }

                }
                
            } else {
                if (config.constants.name == "konashi#4-0947") {
                    sendToBlock(13, 0, 0, 0);
                } else {
                     sendToBlock(13, 150, 0, 0);
                }
            }
            
        } else {
            log("<span style=\"color : red; font-weight : bold;\">Please connect the logblock.</span>");
        }
    } else {
        log("<span style=\"color : red; font-weight : bold;\">Please connect to the main block.</span>");
    }
}

function Log (device) {
    this.blockType = "Log";
    this.address = 13;
    this.id = "logbox";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "90px"};
    this.value = 0;
    this.active = false;
    this.color = "#ffd522";
    this.drawed = false;
    this.index = [0,0];
    this.value = 0;
    this.indent = 0;
    
    this.generateCode = function () {
        code = "";
        if (this.value == 255) {
            code += "logbox(0);";
        } else { code += "logbox(";
            if (this.value == 1) code += "myVarA";
            else if (this.value == 2) code += "myVarB";
            else if (this.value == 3) code += "myVarC";
            else code += 0;
            code += ");";
        }
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
            var code = "";
            if (!inner) {
                if (this.value == 255) {
                    code += "<div class=\"log\" id=\"" + this.id + this.markup_prefix +"\" >  " + this.id+"(0); </div>";
                } else {
                    code += "<div class=\"log\" id=\"" + this.id + this.markup_prefix +"\" >" + " logbox(<span class=\"value\">";
                    
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code += "0";
                    code += "</span>); </div>";
                    
                }
            } else {
                if (this.value == 255) {
                    code += "logbox(0);";
                } else {
                    code += "logbox(<span class=\"value\">";
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code+="0";
                }
                code += "</span>); </div>";
            }
        return code;
    }
    
    this.generateGraphics = function ($blockArea,$codeEditor) {
        if (!this.drawed) {
            var code = this.generateMarkupCode(false);
            $codeEditor.append(code);
            var $markup = $(this.markup_html_id);
            $markup.css("background-color", this.color);
            $markup.css("margin-left", generateIndent(this.indent));
            
            //Generate the markup for the block
            var html = '<div class="block" id="'+this.id+'" style="width:'+this.size.w+'; height:'+this.size.h+';background:'+this.color+';"> '+this.blockType+' </div>';
            $blockArea.append(html);
            
            var $markup = $(this.markup_html_id);
            var $block = $(this.html_id);
            var padding = 10;
            var margin = 50;
            var svgWidth = $("#line_svg").width();
            var bezierPointOffset = 15;
            
            //Calculate the points for the line and draw it
            var points = [
                          [0, $markup.position().top+margin],
                          [65, $block.position().top],
                          [65, $block.position().top+$block.height()+padding],
                          [0, $markup.position().top+$markup.height()+margin],
                         ];
            
            var path = "M "+points[0][0]+","+points[0][1]+" C "+bezierPointOffset+","+points[0][1]+" "+(svgWidth-bezierPointOffset*1.5)+","+points[1][1]+" "+points[1][0]+","+points[1][1]+" C "+points[1][0]+","+(points[1][1]+bezierPointOffset)+" "+points[2][0]+","+(points[2][1]-bezierPointOffset)+" "+points[2][0]+","+points[2][1]+"C "+(points[2][0]-bezierPointOffset)+","+points[2][1]+" "+(points[3][0]+bezierPointOffset)+","+points[3][1]+" "+points[3][0]+","+points[3][1]+" Z";
            
            this.polyline = line_svg.path(path).fill(this.color).stroke({ width: 0 });
            this.drawed = true;
        }
    }
    
    this.updateGraphics = function () {
        if ((this.index[0] != this.index[1] || this.value[0] != this.value[1]) && this.drawed) this.cleanGraphics();
    }
    
    this.updateIndex = function (ind) {
        this.index[0] = this.index[1];
        this.index[1] = ind;
    }
    
    this.updateValue = function (val) {
        this.value = val;
        
        if (this.drawed) {
            $(this.markup_html_id).html(this.generateMarkupCode(true));
        }
        
    }
    
    this.cleanGraphics = function () {
        $(this.html_id).remove();
        $(this.markup_html_id).remove();
        this.polyline.remove();
        this.drawed = false;
    }
}


function LogE (device) {
    this.blockType = "Log";
    this.address = 14;
    this.id = "logboxE";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "90px"};
    this.value = 0;
    this.active = false;
    this.color = "#ffd522";
    this.drawed = false;
    this.index = [0,0];
    this.value = 0;
    this.indent = 0;
    
    this.generateCode = function () {
        code = "";
        if (this.value == 255) {
            code += "logbox(0);";
        } else { code += "logbox(";
            if (this.value == 1) code += "myVarA";
            else if (this.value == 2) code += "myVarB";
            else if (this.value == 3) code += "myVarC";
            else code += 0;
            code += ");";
        }
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
            var code = "";
            if (!inner) {
                if (this.value == 255) {
                    code += "<div class=\"log\" id=\"" + this.id + this.markup_prefix +"\" >  " + this.id+"(0); </div>";
                } else {
                    code += "<div class=\"log\" id=\"" + this.id + this.markup_prefix +"\" >" + " logbox(<span class=\"value\">";
                    
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code += "0";
                    code += "</span>); </div>";
                    
                }
            } else {
                if (this.value == 255) {
                    code += "logbox(0);";
                } else {
                    code += "logbox(<span class=\"value\">";
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code+="0";
                }
                code += "</span>); </div>";
            }
        return code;
    }
    
    this.generateGraphics = function ($blockArea,$codeEditor) {
        if (!this.drawed) {
            var code = this.generateMarkupCode(false);
            $codeEditor.append(code);
            var $markup = $(this.markup_html_id);
            $markup.css("background-color", this.color);
            $markup.css("margin-left", generateIndent(this.indent));
            
            //Generate the markup for the block
            var html = '<div class="block" id="'+this.id+'" style="width:'+this.size.w+'; height:'+this.size.h+';background:'+this.color+';"> '+this.blockType+' </div>';
            $blockArea.append(html);
            
            var $markup = $(this.markup_html_id);
            var $block = $(this.html_id);
            var padding = 10;
            var margin = 50;
            var svgWidth = $("#line_svg").width();
            var bezierPointOffset = 15;
            
            //Calculate the points for the line and draw it
            var points = [
                          [0, $markup.position().top+margin],
                          [65, $block.position().top],
                          [65, $block.position().top+$block.height()+padding],
                          [0, $markup.position().top+$markup.height()+margin],
                         ];
            
            var path = "M "+points[0][0]+","+points[0][1]+" C "+bezierPointOffset+","+points[0][1]+" "+(svgWidth-bezierPointOffset*1.5)+","+points[1][1]+" "+points[1][0]+","+points[1][1]+" C "+points[1][0]+","+(points[1][1]+bezierPointOffset)+" "+points[2][0]+","+(points[2][1]-bezierPointOffset)+" "+points[2][0]+","+points[2][1]+"C "+(points[2][0]-bezierPointOffset)+","+points[2][1]+" "+(points[3][0]+bezierPointOffset)+","+points[3][1]+" "+points[3][0]+","+points[3][1]+" Z";
            
            this.polyline = line_svg.path(path).fill(this.color).stroke({ width: 0 });
            this.drawed = true;
        }
    }
    
    this.updateGraphics = function () {
        if ((this.index[0] != this.index[1] || this.value[0] != this.value[1]) && this.drawed) this.cleanGraphics();
    }
    
    this.updateIndex = function (ind) {
        this.index[0] = this.index[1];
        this.index[1] = ind;
    }
    
    this.updateValue = function (val) {
        this.value = val;
        
        if (this.drawed) {
            $(this.markup_html_id).html(this.generateMarkupCode(true));
        }
        
    }
    
    this.cleanGraphics = function () {
        $(this.html_id).remove();
        $(this.markup_html_id).remove();
        this.polyline.remove();
        this.drawed = false;
    }
}