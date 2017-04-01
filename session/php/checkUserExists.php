<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$error   = 'pending';
$response = 'pending';
$returnStr = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
	$error = "an internal error was encountered";
   	returnWithError($error, $link);
}

//  default data for live testing

 $data = "email=fweber9@utk.edu";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['email'])) {$email = $output['email'];} else {$email = '';};

// test for required inputs

if ($email=="") {
    	$error = "the email is required";
    	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$email = test_input($link, $email);

// check if person already exists

$sql = mysqli_query($link, "SELECT COUNT(email) FROM main WHERE email = '$email'");

if(mysqli_fetch_assoc($sql)['COUNT(email)']!=0) {
	$error = "the email exists. Please try another or login.";
	returnWithError($error, $link);
};

// return a response

	$returnStr['results']  = 'success';
	$returnStr['error']  = $error;
	http_response_code(200); 			//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($returnStr);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

function returnWithError($error, $link) {
	http_response_code(303);
	$returnStr['error']  = $error;
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