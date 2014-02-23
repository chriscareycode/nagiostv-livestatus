<?php




// cors
header('Access-Control-Allow-Origin:*');

$q = $_GET['q'];

if (!$q) {


}
//if ($q=="/services") $q = ltrim($q, '/');
//if ($q=="/servicenocaches") $q = ltrim($q, '/');
$q = ltrim($q, '/');

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
//passthru($cmd);


//loop through each item and output it in a format that makes EmberJS ember-data happy
$data = shell_exec($cmd);
//exec($cmd, $data);
//print('raw data time');
//print_r($data);

//$data_combined = $data[0].$data[1];
//$data_obj = json_decode($data_combined);
$data_obj = json_decode($data);
//$data_obj = $data;
/*
print('sizes');
//print_r($data_obj);
print('data_obj:'.sizeof($data_obj));
print(' data_obj0:'.sizeof($data_obj[0]));
print(' data_obj1:'.sizeof($data_obj[1]));
//print_r($data_obj[1]);
*/
$id=1;
$result = array();
for ($i=1;$i<sizeof($data_obj);$i++) {
  $inner = array();
  for($j=0;$j<sizeof($data_obj[0]);$j++) {
    //print('testy loop '.$i.' row '.$j);
    //print_r($data_obj[$i][$j]);

    $inner[$data_obj[0][$j]] = $data_obj[$i][$j]; 
  }
  $inner['id'] = $id; 
  array_push($result, $inner);
  
  //$inner['id'] = ++$id; array_push($result, $inner);
  //$inner['id'] = ++$id; array_push($result, $inner);
  //$inner['id'] = ++$id; array_push($result, $inner);

  $id++;
}
$json = json_encode(
    array(
        //"services" => array(
        //    $result
        //)
        $q => $result
    )
);
/*
$json = json_encode(
    array(
        "services" => array(
            array("id"=>1, "firstName"=>"bob", "lastName"=>"last"),
            array("id"=>2, "firstName"=>"joe", "lastName"=>"last"),
            array("id"=>3, "firstName"=>"larry", "lastName"=>"last")
        )
    )
);
*/

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