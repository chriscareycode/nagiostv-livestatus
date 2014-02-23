<?php




// cors
header('Access-Control-Allow-Origin:*');

$q = $_GET['q'];

if (!$q) {


}
//if ($q=="services") 
$command = "GET services\nFilter: state = 1\nFilter: state = 2\nFilter: state = 3\nOr: 3\nOutputFormat: json";

//$command = $_GET['command'];       
//$command = urldecode($command);        
//$command = escapeshellcmd($command);  

// two popular locations for the mk livestatus pipe 
if (file_exists('/var/lib/nagios/rw/live')) {
  $cmd = "echo '".$command."' | unixcat /var/lib/nagios/rw/live";
}
if (file_exists('/var/lib/nagios3/rw/live')) {
  $cmd = "echo '".$command."' | unixcat /var/lib/nagios3/rw/live";
}     
passthru($cmd);






$json = json_encode(
    array(
        "services" => array(
            array("id"=>1, "firstName"=>"bob", "lastName"=>"last"),
            array("id"=>2, "firstName"=>"joe", "lastName"=>"last"),
            array("id"=>3, "firstName"=>"larry", "lastName"=>"last")
        )
    )
);

echo $json;


/*
{"services":[
{
  "id":"1",
  "firstName":"test",
  "lastName":"lasthere"
},
{
  "id":"2",
  "firstName":"two",
  "lastName":"twolast"
},
{
  "id":"3",
  "firstName":"three",
  "lastName":"threelast"
},
{
  "id":"4",
  "firstName":"four",
  "lastName":"threelast"
}
]}
*/
?>