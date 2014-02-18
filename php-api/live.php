<?php

$command = $_GET['command'];       
$command = urldecode($command);        
//$command = escapeshellcmd($command);        
$cmd = "echo '".$command."' | unixcat /var/lib/nagios/rw/live";
passthru($cmd);

?>
