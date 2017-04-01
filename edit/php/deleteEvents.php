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

$data = "id=1";

//  get input to run script as forms handler, comment out to run in terminal

 $data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

parse_str($data, $output);

if(isset($output['id'])) {$id = $output['id'];} else {$id = '';};

// remove any possible SQL injections in the form data

$id = test_input($link, $id);

/// delete event with $id

$which = "mainID, surname, CONCAT_WS( ' ', namePrefix, givenName,  middleName, surname, nameSuffix) AS fullName";
$where = "mainID = $personID";

$sql = mysqli_query($link, "DELETE FROM events WHERE id=$id");

if(!$sql) {
	$error = "Error: " . mysqli_error($link);
 	returnWithError($error, $link);
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