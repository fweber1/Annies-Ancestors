<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$response = 'pending';
$error = 'pending';
$mainID = -1;
$returnStr = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
     	$error = "an internal error was encountered";
    	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

 $data = "email=fweber@utk.edu&password=a";

//  get input to run script as forms handler (comment out string to run stand-alone

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['email'])) {$email = $output['email'];} else {$email = '';};
if(isset($output['password'])) {$password = $output['password'];} else {$password = '';};

// test for required inputs

if ($email=="") {
    	$error = "the email is required";
    	returnWithError($error, $link);
}

if ($password=="") {
    	$error = "the password is required";
    	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z@`.`0-9]*$/",$email)) {
  	$error = "only letters, numbers, '@', and '.' are allowed in an email"; 
   	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$email = test_input($link, $email);
$password = test_input($link, $password);

// check if person already exists, if so, success

$sql = mysqli_query($link, "SELECT mainID FROM main WHERE email = '$email' AND pswd = SHA1('$password')");

if($sql == null) {
	$error = 'invalid Credentials';
	returnWithError($error, $link);
};

$data=mysqli_fetch_assoc($sql);

// return a response

	$returnStr['response']  = $data;
	$returnStr['error']  = $error;
	http_response_code(200);
	echo ")]}',\n" . json_encode($returnStr);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

function returnWithError($error, $link) {
	http_response_code(303);	$returnStr['response']  = 'failure';
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