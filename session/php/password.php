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

// text input to run script as stand-alone for debugging

 $data = "email=fweber@utk.edu&pswd=test";

//  get input to run script as forms handler

// $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['email'])) {$email = $output['email'];} else {$email = '';};
if(isset($output['pswd'])) {$pswd = $output['pswd'];} else {$pswd = '';};

// test for required inputs

if ($email=="") {
    	$errors = "the email is required";
    	returnWithError($errors, $link);
}

if ($pswd=="") {
    	$errors = "the password is required";
    	returnWithError($errors, $link);
}

// remove any possible SQL injections in the form data

$email = test_input($link, $email);
$pswd = test_input($link, $pswd);

if (!preg_match("/^[a-zA-Z@`.`0-9]*$/",$email)) {
  	$error = "only letters, numbers, '@', and '.' are allowed"; 
    	returnWithError($errors, $link);
}

if (!preg_match("/^[a-zA-Z0-9]*$/",$pswd)) {
  	$errors = "only letters and numbers are allowed"; 
    	returnWithError($errors, $link);
}

$which = "pswd = SHA1('$pswd')";

$sql = mysqli_query($link, "UPDATE main SET $which WHERE email='$email'");

if(!$sql) {
    	$errors = "an internal error was encountered";
 	returnWithError($errors, $link);
}

$sql = mysqli_query($link, "SELECT mainID FROM main WHERE email='$email'");

if(!$sql) {
    	$errors = "an internal error was encountered";
 	returnWithError($errors, $link);
}

$mainID=mysqli_fetch_assoc($sql);	

// return a response

	$returnStr['results']  = 'success';
	$returnStr['error']  = $error;
	$returnStr['mainID']  = $mainID;
	http_response_code(200); 			//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($returnStr);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

function returnWithError($error, $link) {
	$returnStr['results']  = 'failure';
	$returnStr['error']  = $error;
	http_response_code(303);
	echo ")]}',\n" . $error;
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
