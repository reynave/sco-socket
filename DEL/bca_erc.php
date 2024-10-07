<?php 
header('Content-Type: application/javascript');
echo "09345 : [ '00110000', '00111001', '00110011', '00110100', '00110101' ]";
echo "\n";

echo "\n".sprintf( "%08d",decbin(0x1));
echo "\n".sprintf( "%08d",decbin(0x50)); 
echo "\n".sprintf( "%08d",decbin(0x3));  

 
                    // 123456789-123456789-123456789-123456789-123456789-123456789-123456789-123456789-123456789-123456789-123456789-
$erc_STX            = "02";
$erc_messageLenght  = "0150"; 
$erc_version        = "02";
$erc_transType      = "01";
$erc_transAmount    = "000061235300"."000000000000"; 
$erc_cc             = "5409120012345684   251000000000000000  ";
$erc_other          = "N00000                                                                              "; 
$erc_ETX            = "03"; 

echo "\nmessage length = ".strlen($erc_version.$erc_transType.$erc_transAmount.$erc_cc.$erc_other)."\n";
$erc_message =  ($erc_transType).($erc_transAmount).($erc_cc).($erc_other) ;
  
$msg  = $erc_STX.
    $erc_messageLenght.
    $erc_version.
    bin2hex($erc_transType).
    bin2hex($erc_transAmount).
    bin2hex($erc_cc).
    bin2hex($erc_other).$erc_ETX.
    fnXor($erc_message);
   
echo "\n\nmsg : ".$msg."\n";
    

function fnXor($str  = []){
    $bit = strToBit($str);
    $xor = "";
    $resp = [];
   
    $data =  array_fill(0, count($bit), 0); 
    $data[0] = sprintf( "%08d",decbin(0x1));
    $data[1] = sprintf( "%08d",decbin(0x50));
    $data[2] = sprintf( "%08d",decbin(0x2));
    $i = 3;
     
    foreach($bit as $arr){
        $data[$i] = $arr;
        $i++; 
    }
    $data[$i] = sprintf( "%08d",decbin(0x3));

    $sum =  array_fill(0, 8, 0); 

    foreach($data as $arr){
        $a = str_split($arr);
        for($i = 0; $i < 8 ; $i++){ 
            $sum[$i] += $a[$i];
        }  
    }    
    for($i = 0; $i < 8 ; $i++){ 
        $sum[$i] = $sum[$i]%2 ;
    }   
     

    for($i = 0; $i<8; $i++ ){
        $sum[$i] = $sum[$i]%2;
        $xor .= $sum[$i];
    } 
 
    $char = bindec($xor);
    $char = dechex($char);  
   $char = sprintf("%02d", $char);  

    return $char;
}
 


function strToBit($str =[]){
    $resp = [];
    foreach(str_split($str) as  $arr){ 
        $bin = sprintf( "%08d",decbin(ord($arr))); // "00011010"
        array_push($resp, $bin);
    } 
    return $resp; 
}
