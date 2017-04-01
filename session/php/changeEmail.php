<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$response = 'pending';
$error = 'pending';
$returnStr = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
     	$error = "an internal error was encountered";
    	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

 $data = "email1=fweber36@utk.edu&email2=fweber36@utk.edu&mainID=6120";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['email1'])) {$email1 = $output['email1'];} else {$email1 = '';};
if(isset($output['email2'])) {$email2 = $output['email2'];} else {$email2 = '';};
if(isset($output['mainID'])) {$mainID = $output['mainID'];} else {$mainID = '';};

// test for required inputs

if ($mainID=="") {
    	$error = "a user ID is required";
    	returnWithError($error, $link);
}

if ($email1=="") {
    	$error = "an email is required";
    	returnWithError($error, $link);
}

if ($email2=="") {
    	$error = "the verify email is required";
    	returnWithError($error, $link);
}

if (!is_Numeric($mainID)) {
  	$error = "IDs must be numeric"; 
    	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z@`.`0-9]*$/",$email1)) {
  	$error = "only letters, numbers, '@', and '.' are allowed in an email"; 
    	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z@`.`0-9]*$/",$email2)) {
  	$error= "only letters, numbers, '@', and '.' are allowed in an email"; 
    	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$email1 = test_input($link, $email1);
$email2 = test_input($link, $email2);
$mainID = test_input($link, $mainID);

// check that new email is unique

$sql = mysqli_query($link, "SELECT mainID FROM main WHERE email='$email1'");

if(!$sql) {
    	$error = "an internal error was detected";
 	returnWithError($error, $link);
}

if(mysqli_num_rows($sql) > 0) {
   	$error = "that email is already in use";
 	returnWithError($error, $link);
 }

// no one has that email, so update the email

$sql = mysqli_query($link, "UPDATE main SET email='$email1' WHERE mainID='$mainID'");

// return a response

	$returnStr['response']  = 'success';
	$returnStr['error']  = $error;
	http_response_code(200);
	echo ")]}',\n" . json_encode($returnStr);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

function returnWithError($error, $link) {
	http_response_code(303);
	$returnStr['response']  = 'failure';
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
