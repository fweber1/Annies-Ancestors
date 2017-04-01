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

$data = "mainID=6120";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

parse_str($data, $output);

if(isset($output['mainID'])) {$mainID = $output['mainID'];} else {$mainID = '';};

// test for required inputs

if ($mainID=="") {
    	$error = "The id is required";
    	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$mainID = test_input($link, $mainID);

$which = "mainID,ownerID,gender,namePrefix,givenName,middleName,surname,nameSuffix";
$value = "mainID=$mainID";

$sql = mysqli_query($link, "SELECT $which FROM main WHERE $value");

$response = mysqli_fetch_assoc($sql);

$response['fullName'] = $response['namePrefix'] . ' ' . $response['givenName'] . ' ' . $response['middleName'] . ' ' . $response['surname'] . ' ' . $response['nameSuffix'];

// return a response

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