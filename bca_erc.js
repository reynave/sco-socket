const { SerialPort, SpacePacketParser, ReadlineParser } = require('serialport')
const { SerialPortStream } = require('@serialport/stream')
let dataTxtString  = "P010000005500000000000000001688700627201892   251000000000000000  N00000                                                                              ";
let dataTxtString2 = "P010000612353000000000000005409120012345684   251000000000000000  N00000                                                                              	";


let msg = "0201500230313030303036313233353330303030303030303030303030303534303931323030313233343536383420202032353130303030303030303030303030303020204e30303030302020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020200309";
const b = Buffer.from(msg); 
console.log(hexToAscii(b));
let msgERC = hexToAscii(b);



const port = new SerialPort({
    path: 'com3',
    baudRate: 9600,
    autoOpen: false,
}, (err) => console.log(err));

function callCom3() {
    return new Promise(resolve => {
        port.open(function (res) {
            if (res) {
                console.log(res.name, ', opening port: ', res.message);
            } else {
                console.log('com3 Open');
            }

            port.write(msgERC, function (err) {
                if (err) throw err;
            });
            let i = 0;
            setTimeout(function() {
                i++;
                console.log(port.read() );
                console.log(" loop i ",i);
            }, 1000);
 
        });
      
    });
}

async function asyncCall() {

    const result = await callCom3();
    console.log('calling');
    console.log(result);
    // expected output: "resolved"
}

asyncCall();




function hexToAscii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }
 
 