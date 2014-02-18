<?php

$command = $_GET['command'];       
$command = urldecode($command);        
//$command = escapeshellcmd($command);   
if (file_exists('/var/lib/nagios/rw/live')) {
	$cmd = "echo '".$command."' | unixcat /var/lib/nagios/rw/live";
}
if (file_exists('/var/lib/nagios3/rw/live')) {
	$cmd = "echo '".$command."' | unixcat /var/lib/nagios3/rw/live";
}     

passthru($cmd);

?>
