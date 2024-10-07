var hexToBinary = require('hex-to-binary'); 

let txt 	= "0201500230313132333435363738393030303030303030303030303030303136383837303036323732303138393220202032353130303030303030303030303030303020204E3030303030202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020030B";
let test 	= "0201500231373030303030303030303030303030303030303030303030302020202020202020202020202020202020202020202020303030303030303030303030303020204E30303030302020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020200308";
const b = Buffer.from(txt); 
let testAscii = "P17000000000000000000000000                       00000000000000  N00000                                                                              ";
console.log(b);
console.log(testAscii);
console.log(hexToAscii(b));  


let prefixHex = "02015002"; 
let code = "01"; 
let string = "000000640000"; 
let cc = "0000000000000000000000000000   000000000000000000  N00000                                                                              ";
let ETX = "03";
let LRC = "";

cc = Buffer.from(cc, 'utf8').toString('hex');
let strToHex = prefixHex+Buffer.from(code, 'utf8').toString('hex')+Buffer.from(string, 'utf8').toString('hex')+cc+ETX+LRC;
// console.log(strToHex); 
 
//console.log(Buffer.from(test).toString('hex'));




function hexToAscii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }
 
 
var str = string; 
String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += hex;
    }

    return result
}


String.prototype.hexEncode = function(){
    var hex, i; 
    var result = "";
	const arr = [];
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += hex; 
		arr.push(hex);
    }

    return arr
}
String.prototype.bin2 = function(){
    var hex, i;  
	const arr = [];
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16); 
		arr.push(hexToBinary(hex.toString()));

		//("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8)
    }

    return arr
}
  
let resXor = "";

let a = '09345'; 
 
 