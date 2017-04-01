<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$error   = 'pending';
$response = 'pending';

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
	$error = "an internal error was encountered";
   	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

 $data = "userID=6120";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

$userID = $output['userID'];

$userID = test_input($link, $userID);

// get the skype name of the current user


$which = "skype";
$where = "mainID='$userID'";

$sql = mysqli_query($link, "SELECT $which FROM main WHERE $where");

if(!$sql) {
    	$error = mysqli_error($link);
	returnWithError($error, $link);
}

$skype = mysqli_fetch_assoc($sql);
$results = 'no';
if($skype!="") {
	$results = $skype;
}

// return a response

	$returnStr['results']  = $results;
	http_response_code(200); 			//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($returnStr);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

function returnWithError($error, $link) {
	$returnStr['results']  = 'failure';
	$returnStr['error']  = $error;
	http_response_code(303);
	echo ")]}',\n" . json_encode($returnStr);
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
