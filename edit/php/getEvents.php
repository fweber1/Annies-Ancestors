<?php
error_reporting(E_ALL);
ini_set('display_errors', true);
date_default_timezone_set('EST5EDT');					// need to set time zone of server for date --> epoch time

$error   = 'pending';
$response = array();
$returnStr = array();
$result = array();

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

/// get main person

$which = "mainID, surname, CONCAT_WS( ' ', namePrefix, givenName,  middleName, surname, nameSuffix) AS fullName";
$where = "mainID = $personID";

$sql = mysqli_query($link, "SELECT $which FROM main WHERE $where");

if(!$sql) {
	$error = "Error: " . mysqli_error($link);
 	returnWithError($error, $link);
}

$result[0] = mysqli_fetch_assoc($sql);
$result[0] = array_merge(array('what' => 'person'), $result[0]);

// next, get all events for the person

$which = "main.mainID, events.ownerID, fatherID, motherID, theType, dateModifier, date1, date2, phrase, city, state, county, country, details, ";
$which = $which . "surname, CONCAT_WS( ' ', givenName, surname) AS fullName";
$where = "main.mainID = $personID AND mainType = 'EVEN'";
$sql = mysqli_query($link, "SELECT $which FROM main, events WHERE $where");

if(!$sql) {
	$error = "Error: " . mysqli_error($link);
	returnWithError($error, $link);
}

for ($i=1;$i<mysqli_num_rows($sql)+1;$i++) {
	$result[$i] = mysqli_fetch_assoc($sql);
	$result[$i] = array_merge(array('what' => 'event'), $result[$i]);
}

// get father name

$theLen = count($result) - 1;
for ($i=1;$i<mysqli_num_rows($sql);$i++) {
	$which = "mainID, surname, CONCAT_WS( ' ', namePrefix, givenName,  middleName, surname, nameSuffix) AS fullName";
	$id = $result[$i]['fatherID'];
	$where = "mainID = $id";
	$sql1 = mysqli_query($link, "SELECT $which FROM main WHERE $where");
	$tmp = mysqli_fetch_assoc($sql1);
	$result[$i+$theLen] = array_merge(array('what' => 'father'), array('date1' => $result[$i]['date1']), array('date2' => $result[$i]['date2']), $tmp);
}

$theLen = count($result) - 1;
for ($i=1;$i<mysqli_num_rows($sql);$i++) {
	$which = "mainID, surname, CONCAT_WS( ' ', namePrefix, givenName,  middleName, surname, nameSuffix) AS fullName";
	$id = $result[$i]['motherID'];
	$where = "mainID = $id";
	$sql1 = mysqli_query($link, "SELECT $which FROM main WHERE $where");
	$tmp = mysqli_fetch_assoc($sql1);
	$result[$i+$theLen] = array_merge(array('what' => 'mother'), array('date1' => $result[$i]['date1']), array('date2' => $result[$i]['date2']), $tmp);
}

// return a response

	http_response_code(200);					//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($result);	// )]}', is used to stop JSON attacks, angular strips it off for you.
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