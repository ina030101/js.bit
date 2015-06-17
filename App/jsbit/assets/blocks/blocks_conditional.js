function getComparatorValueFromInput (val) {
    if (val <= 26) {
        return "==";
    } else if (val >= 27 && val <= 44 ) {
        return "!=";
    } else if (val >= 45 && val <= 84 ) {
        return "<";
    } else if (val >= 85 && val <= 151 ) {
        return ">";
    } else if (val >= 152 && val <= 218 ) {
        return "<=";
    } else if (val >= 219) {
        return ">=";
    }
}

function If (device) {
    this.blockType = "if block";
    this.address = 5;
    this.id = "if_1";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "110px"};
    this.value = [[0,0,0],[0,0,0]];
    this.active = false;
    this.color = "#ffb624";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.generateCode = function () {
        var code = "";
                code += "if (";
                if (this.value[1][0] == 0 && this.value[1][1] == 0) {
                    code += "true";
                } else if (this.value[1][0] != 0 && this.value[1][1] == 0) {
                    code += getVariableNameFromAddress(this.value[1][0]);
                } else if (this.value[1][0] == 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][1])
                } else if (this.value[1][0] != 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][0])+" "+getComparatorValueFromInput(this.value[1][2])+" "+getVariableNameFromAddress(this.value[1][1]);
                }
                code += ") {";
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
            var code = "";
            if (!inner) {
                code += "<div class=\"if\" id=\"" + this.id + this.markup_prefix +"\" >";
                code += this.generateMarkupCode(true);               
                code += "</div>";
            } else {
                var code = "";
                code += "<span class=\"if\">if</span> (";
                if (this.value[1][0] == 0 && this.value[1][1] == 0) {
                    code += "true";
                } else if (this.value[1][0] != 0 && this.value[1][1] == 0) {
                    code += getVariableNameFromAddress(this.value[1][0]);
                } else if (this.value[1][0] == 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][1])
                } else if (this.value[1][0] != 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][0])+" "+getComparatorValueFromInput(this.value[1][2])+" "+getVariableNameFromAddress(this.value[1][1]);
                }
                code += ") {";
                return code;
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
        if ((this.index[0] != this.index[1] ||
             this.value[0][0] != this.value[1][0] || 
             this.value[0][1] != this.value[1][1] || 
             this.value[0][2] != this.value[1][2]) 
             && this.drawed) this.cleanGraphics();
    }
    
    this.updateIndex = function (ind) {
        this.index[0] = this.index[1];
        this.index[1] = ind;
    }
    
    this.updateValue = function (val) {
        this.value[0][0] = this.value[1][0];
        this.value[0][1] = this.value[1][1];
        this.value[0][2] = this.value[1][2];
        
        this.value[1][0] = val[0];
        this.value[1][1] = val[1];
        this.value[1][2] = val[2];
        
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

function Else (device) {
    this.blockType = "else block";
    this.address = 6;
    this.id = "else";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "90px"};
    this.value = [0,0,0];
    this.active = false;
    this.color = "#ffb624";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.generateCode = function () {
        var code = "} else {"
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
        var code = "";
        code += "<div class=\"else_1\" id=\"" + this.id + this.markup_prefix +"\" > } else { </div>";
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
    
    this.updateGraphics = function () { if ((this.index[0] != this.index[1]) && this.drawed) this.cleanGraphics(); }
    this.updateIndex = function (ind) { this.index[0] = this.index[1]; this.index[1] = ind; }
    this.updateValue = function (val) {}
    
    this.cleanGraphics = function () {
        $(this.html_id).remove();
        $(this.markup_html_id).remove();
        this.polyline.remove();
        this.drawed = false;
    }
}

function EndIf (device) {
    this.blockType = "end condition";
    this.address = 7;
    this.id = "endif_1";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "110px"};
    this.value = [0,0,0];
    this.active = false;
    this.color = "#ffb624";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.generateCode = function () {
        var code = "}"
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
        var code = "";
        code += "<div class=\"endif\" id=\"" + this.id + this.markup_prefix +"\" >}</div>";
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
    
    this.updateGraphics = function () { if ((this.index[0] != this.index[1]) && this.drawed) this.cleanGraphics(); }
    this.updateIndex = function (ind) { this.index[0] = this.index[1]; this.index[1] = ind; }
    this.updateValue = function (val) {}
    
    this.cleanGraphics = function () {
        $(this.html_id).remove();
        $(this.markup_html_id).remove();
        this.polyline.remove();
        this.drawed = false;
    }
}

function If2 (device) {
    this.blockType = "if block";
    this.address = 8;
    this.id = "if_2";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "110px"};
    this.value = [[0,0,0],[0,0,0]];
    this.active = false;
    this.color = "#ffb624";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.generateCode = function () {
        var code = "";
                code += "if (";
                if (this.value[1][0] == 0 && this.value[1][1] == 0) {
                    code += "true";
                } else if (this.value[1][0] != 0 && this.value[1][1] == 0) {
                    code += getVariableNameFromAddress(this.value[1][0]);
                } else if (this.value[1][0] == 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][1])
                } else if (this.value[1][0] != 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][0])+" "+getComparatorValueFromInput(this.value[1][2])+" "+getVariableNameFromAddress(this.value[1][1]);
                }
                code += ") {";
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
            var code = "";
            if (!inner) {
                code += "<div class=\"if\" id=\"" + this.id + this.markup_prefix +"\" >";
                code += this.generateMarkupCode(true);               
                code += "</div>";
            } else {
                var code = "";
                code += "<span class=\"if\">if</span> (";
                if (this.value[1][0] == 0 && this.value[1][1] == 0) {
                    code += "true";
                } else if (this.value[1][0] != 0 && this.value[1][1] == 0) {
                    code += getVariableNameFromAddress(this.value[1][0]);
                } else if (this.value[1][0] == 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][1])
                } else if (this.value[1][0] != 0 && this.value[1][1] != 0) {
                    code += getVariableNameFromAddress(this.value[1][0])+" "+getComparatorValueFromInput(this.value[1][2])+" "+getVariableNameFromAddress(this.value[1][1]);
                }
                code += ") {";
                return code;
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
        if ((this.index[0] != this.index[1] ||
             this.value[0][0] != this.value[1][0] || 
             this.value[0][1] != this.value[1][1] || 
             this.value[0][2] != this.value[1][2]) 
             && this.drawed) this.cleanGraphics();
    }
    
    this.updateIndex = function (ind) {
        this.index[0] = this.index[1];
        this.index[1] = ind;
    }
    
    this.updateValue = function (val) {
        this.value[0][0] = this.value[1][0];
        this.value[0][1] = this.value[1][1];
        this.value[0][2] = this.value[1][2];
        
        this.value[1][0] = val[0];
        this.value[1][1] = val[1];
        this.value[1][2] = val[2];
        
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

function Else2 (device) {
    this.blockType = "else block";
    this.address = 9;
    this.id = "else_2";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "90px"};
    this.value = [0,0,0];
    this.active = false;
    this.color = "#ffb624";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.generateCode = function () {
        var code = "} else {"
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
        var code = "";
        code += "<div class=\"else\" id=\"" + this.id + this.markup_prefix +"\" > } else { </div>";
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
    
    this.updateGraphics = function () { if ((this.index[0] != this.index[1]) && this.drawed) this.cleanGraphics(); }
    this.updateIndex = function (ind) { this.index[0] = this.index[1]; this.index[1] = ind; }
    this.updateValue = function (val) {}
    
    this.cleanGraphics = function () {
        $(this.html_id).remove();
        $(this.markup_html_id).remove();
        this.polyline.remove();
        this.drawed = false;
    }
}

function EndIf2 (device) {
    this.blockType = "end condition";
    this.address = 10;
    this.id = "endif_2";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "110px"};
    this.value = [0,0,0];
    this.active = false;
    this.color = "#ffb624";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.generateCode = function () {
        var code = "}"
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
        var code = "";
        code += "<div class=\"endif\" id=\"" + this.id + this.markup_prefix +"\" >}</div>";
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
    
    this.updateGraphics = function () { if ((this.index[0] != this.index[1]) && this.drawed) this.cleanGraphics(); }
    this.updateIndex = function (ind) { this.index[0] = this.index[1]; this.index[1] = ind; }
    this.updateValue = function (val) {}
    
    this.cleanGraphics = function () {
        $(this.html_id).remove();
        $(this.markup_html_id).remove();
        this.polyline.remove();
        this.drawed = false;
    }
}