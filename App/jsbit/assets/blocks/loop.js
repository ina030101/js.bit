function Loop (device) {
    this.blockType = "loop";
    this.address = 17;
    this.id = "loop";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "90px"};
    this.value = 0;
    this.active = false;
    this.color = "#ffea92";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.generateCode = function () {
        var code = "";
        code += "for (var i = 0; i < "+ this.value+"; i ++) {";
        return code;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
            var code = "";
            if (!inner) {
                
                    code += "<div class=\"loop\" id=\"" + this.id + this.markup_prefix +"\" >";
                    code += this.generateMarkupCode(true);
                    code += "</div>";
                
            } else {
                code += "for (<span class='var'>var </span> i = 0; i < "+ this.value+"; i ++) {";
            }
        return code;
    }
    
    this.generateGraphics = function ($blockArea,$codeEditor) {
        if (!this.drawed) {
            var code = this.generateMarkupCode(false);
            $codeEditor.append(code);
            
            var $markup = $(this.markup_html_id);
            
            $markup.css("background-color", this.color);
            $markup.css("color", "#000000");
            $markup.css("margin-left", generateIndent(this.indent));
            
            //Generate the markup for the block
            var html = '<div class="block" id="'+this.id+'" style="width:'+this.size.w+'; height:'+this.size.h+';background:'+this.color+';"> '+this.blockType+' </div>';
            $blockArea.append(html);
            
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

function EndLoop (device) {
    this.blockType = "end loop";
    this.address = 18;
    this.id = "endloop";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "90px"};
    this.value = 0;
    this.active = false;
    this.color = "#ffea92";
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
            if (!inner) {
                
                    code += "<div class=\"loopend\" id=\"" + this.id + this.markup_prefix +"\" >";
                    code += this.generateMarkupCode(true);
                    code += "</div>";
                
            } else {
                code += "}";
            }
        return code;
    }
    
    this.generateGraphics = function ($blockArea,$codeEditor) {
        if (!this.drawed) {
            var code = this.generateMarkupCode(false);
            $codeEditor.append(code);
            var $markup = $(this.markup_html_id);
            $markup.css("background-color", this.color);
            $markup.css("color", "#000000");
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