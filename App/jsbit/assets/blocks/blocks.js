config.block_index = {
    blocks : [
        { address : 1, name : "MyVarA"},
        { address : 2, name : "MyVarB"},
        { address : 3, name : "MyVarC"},
        { address : 4, name : "FreeInput"},
        { address : 5, name : "If"},
        { address : 6, name : "Else"},
        { address : 7, name : "EndIf"},
        { address : 8, name : "If2"},
        { address : 9, name : "Else2"},
        { address : 10, name : "EndIf2"},
        { address : 11, name : "Lightbox"},
        { address : 12, name : "LightboxE"},
        { address : 13, name : "Log"},
        { address : 14, name : "LogE"},
        { address : 15, name : "Motorbox"},
        { address : 16, name : "MotorboxE"},
        { address : 17, name : "Loop"},
        { address : 18, name : "EndLoop"},
        { address : 19, name : "Operator1"},
        { address : 20, name : "Operator2"},
        { address : 21, name : "Operator3"}
    ]
};

function checkIndent (addr) {
    var indentBlocks = [5,6,8,9,17];
    for( var i = 0; i< indentBlocks.length; i++) {
        if (indentBlocks[i] == addr) return true;
    }
    return false;
}

function checkdeIndent (addr) {
    var indentBlocks = [6,7,9,10,18];
    for( var i = 0; i< indentBlocks.length; i++) {
        if (indentBlocks[i] == addr) return true;
    }
    return false;
}

function generateIndent(times) {
        var indent = 5+(30*times);
        return indent+"px";
}
