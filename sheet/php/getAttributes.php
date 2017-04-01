<?php
error_reporting(E_ALL);
ini_set('display_errors', true);
date_default_timezone_set('EST5EDT');					// need to set time zone of server for date --> epoch time

$error   = 'pending';
$response = array();
$returnStr = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
	$error = "an internal error was encountered";
	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

$data = "personID=6120";

//  get input to run script as forms handler, comment out to run in terminal

 $data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

parse_str($data, $output);

if(isset($output['personID'])) {$personID = $output['personID'];} else {$personID = '';};

// remove any possible SQL injections in the form data

$personID = test_input($link, $personID);

// get main person's media items

$which = "mainID,theType,mainType,theContent,theFile,theTitle";
$where = "$personID = mainID";

$sql = mysqli_query($link, "SELECT $which FROM media WHERE $where");

if(!$sql) {
	$error = "Error: " . mysqli_error($link);
 	returnWithError($error, $link);
}
for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$tmp[$i] = mysqli_fetch_assoc($sql);
}

if(isset($tmp)) {
	$response = $tmp;
} else {
	$tmp = array();
}

// get main person's attributes

$which = "mainID,spouseID,fatherID,motherID,mainType,theType,dateModifier,date1,date2,phrase,city,county,";
$which = $which . "state,country,details,theFile";
$where = "$personID = mainID";

$sql = mysqli_query($link, "SELECT $which FROM events WHERE $where");

if(!$sql) {
	$error = "Error: " . mysqli_error($link);
	returnWithError($error, $link);
}

$tmp = array();
for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$tmp[$i] = mysqli_fetch_assoc($sql);
}

if(isset($response)) {
	$response = array_merge($response, $tmp);
} else {
	$response = $tmp;
}
// return a response

// need to utf_encode for html entities and escape reserved chars

http_response_code(200);					//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($response);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

	function returnWithError($response, $link) {
		http_response_code(303);
		echo ")]}',\n" . json_encode($response);
		mysqli_close($link);
		exit;
	}
	
function test_input($link, $data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  $data = mysqli_real_escape_string($link, $data);
  return $data;
}
?>