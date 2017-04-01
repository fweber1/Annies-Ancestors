<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$errors = 'pending';
$results = 'pending';
$returnStr = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
     	$errors = "an internal error was encountered";
    	returnWithError($errors, $results, $link);
}

// text input to run script as stand-alone for debugging

 $data = "email=fweber22@utk.edu&password=a";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['email'])) {$email = $output['email'];} else {$email = '';};
if(isset($output['password'])) {$password = $output['password'];} else {$password = '';};

// test for required inputs

if ($email=="") {
    	$errors = "the email is required";
    	returnWithError($errors, $results, $link);
}

if ($password=="") {
    	$errors = "the password is required";
    	returnWithError($errors, $results, $link);
}

// remove any possible SQL injections in the form data

$email = test_input($link, $email);
$password = test_input($link, $password);

if (!preg_match("/^[a-zA-Z@`.`0-9]*$/",$email)) {
  $errors = "only letters, numbers, '@', and '.' are allowed"; 
}

$sql = mysqli_query($link, "SELECT mainID FROM main WHERE email='$email'");

if(!$sql) {
    	$errors = "an internal error was detected";
 	returnWithError($errors, $results, $link);
}

if(mysqli_num_rows($sql) == 0) {
   	$errors = "no user has that email";
 	returnWithError($errors, $results, $link);
 } else if(mysqli_num_rows($sql) >1) {
  	$errors = "more than one user has that email (" . mysqli_num_rows($sql) . ")";
 	returnWithError($errors, $results, $link);
}

// have only one user with that email, so log them in

$sql = mysqli_query($link, "SELECT mainID FROM main WHERE email='$email' AND pswd=SHA1('$password')");

if(!$sql) {
    	$errors = "an internal error was encountered";
 	returnWithError($errors, $results, $link);
}

if(mysqli_num_rows($sql) == 0) {
   	$errors = "invalid login credentials. Try again";
 	returnWithError($errors, $results, $link);
}

$mainID = mysqli_fetch_assoc($sql);

// return a response

if ($errors=='pending') {									// if there are errors, return them
	http_response_code(200);
	$returnStr['mainID']  = $mainID;
	$returnStr['results']  = $results;
	$returnStr['errors']  = $errors;
	echo json_encode($returnStr);
	mysqli_close($link);
	return;
}

function returnWithError($errors, $results, $link) {
	http_response_code(303);
	$results = 'failed';
	$returnStr = array();
  	$returnStr['results']  = $results;
 	$returnStr['errors']  = $errors;
	echo json_encode($returnStr);
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
