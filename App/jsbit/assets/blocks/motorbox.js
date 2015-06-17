function motorbox (val) {
    if (config.variables.konashiConnected) {
        if (blockOnList(15)) {
            log("Writting "+val+" degrees on motorbox.");
            if (val >= 0 && val <= 180) {
                sendToBlock(15, val, 0, 0);
            }
        } else {
            log("<span style=\"color : red; font-weight : bold;\">Please connect the motorbox.</span>");
        }
    } else {
        log("<span style=\"color : red; font-weight : bold;\">Please connect to the main block.</span>");
    }
}

function Motorbox (device) {
    this.blockType = "motorbox";
    this.address = 15;
    this.id = "motorbox";
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
            code += "motorbox(0);";
        } else { code += "motorbox(";
            if (this.value == 1) code += "myVarA";
            else if (this.value == 2) code += "myVarB";
            else if (this.value == 3) code += "myVarC";
            else code += 0;
            code += "*20);";
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
                    code += "<div class=\"log\" id=\"" + this.id + this.markup_prefix +"\" >" + " motorbox(<span class=\"value\">";
                    
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code += "0";
                    code += "</span>*20); </div>";
                    
                }
            } else {
                if (this.value == 255) {
                    code += "motorbox(0);";
                } else {
                    code += "motorbox(<span class=\"value\">";
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code+="0";
                }
                code += "</span>*20); </div>";
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


function MotorboxE (device) {
    this.blockType = "motorbox";
    this.address = 16;
    this.id = "motorboxE";
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
    this.multiplier = 20;
    
    this.generateCode = function () {
        code = "";
        if (this.value == 255) {
            code += "motorbox(0);";
        } else { code += "motorbox(";
            if (this.value == 1) code += "myVarA";
            else if (this.value == 2) code += "myVarB";
            else if (this.value == 3) code += "myVarC";
            else code += 0;
            code += "*20);";
        }
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
            var code = "";
            if (!inner) {
                if (this.value == 255) {
                    code += "<div class=\"log\" id=\"" + this.id + this.markup_prefix +"\" >  motorbox(0); </div>";
                } else {
                    code += "<div class=\"log\" id=\"" + this.id + this.markup_prefix +"\" >" + " motorbox(<span class=\"value\">";
                    
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code += "0";
                    code += "*20</span>); </div>";
                    
                }
            } else {
                if (this.value == 255) {
                    code += "motorbox(0);";
                } else {
                    code += "motorbox(<span class=\"value\">";
                    if (this.value == 1) code += "myVarA";
                    else if (this.value == 2) code += "myVarB";
                    else if (this.value == 3) code += "myVarC";
                    else code+="0";
                }
                code += "*20</span>); </div>";
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