function FreeInput (device) {
    this.blockType = "free input";
    this.address = 4;
    this.id = "freeInput";
    this.html_id = "#"+this.id;
    this.markup_prefix = "_markup";
    this.markup_html_id = this.html_id+this.markup_prefix;
    this.size = (device == "mini") ? {w : "195px", h : "105px"} : {w : "195px", h : "90px"};
    this.value = 0;
    this.active = false;
    this.color = "#559999";
    this.drawed = false;
    this.index = [0,0];
    this.indent = 0;
    
    this.inputCode = "log(\"Hello Worf\");";
    
    this.generateCode = function () {
        return this.inputCode;
    }
    
    this.generateMarkupCode = function (inner) {
        //Generate the markup for the code
            var code = "";
            code += "<div class=\"freeInput\" id=\"" + this.id + this.markup_prefix +"\">" + this.inputCode + "</div>";
        return code;
    }
    
    this.generateGraphics = function ($blockArea,$codeEditor) {
        if (!this.drawed) {
            var code = this.generateMarkupCode(false);
            $codeEditor.append(code);
            
            var $markup = $(this.markup_html_id);
            
            $markup.css("background-color", this.color);
            $markup.css("margin-left", generateIndent(this.indent));
                        
            $markup.on("touchstart", function () {
                var pcode = prompt("Type your code", block_objects[getIndexOfObjectWithAddress(4)].inputCode);
                $markup.html(pcode);
                block_objects[getIndexOfObjectWithAddress(4)].inputCode = pcode;
            });
            
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
    
    this.updateGraphics = function () { }
    
    this.updateIndex = function (ind) {
        this.index[0] = this.index[1];
        this.index[1] = ind;
    }
    
    this.updateValue = function (val) { }
    
    this.cleanGraphics = function () {
        
        $(this.markup_html_id).off("touchstart");
        
        $(this.html_id).remove();
        $(this.markup_html_id).remove();
        this.polyline.remove();
        this.drawed = false;
    }
}