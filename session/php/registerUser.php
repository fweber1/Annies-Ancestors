<?php
error_reporting(E_ALL);
ini_set('display_errors', true);
date_default_timezone_set('EST5EDT');					// need to set time zone of server for date --> epoch time

$response['error']   = 'pending';
$response['success'] = 'pending';

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
	$response['error'] = "an internal error was encountered";
   	returnWithError($response, $link);
}

//  default data for live testing

 $data = "givenName=Fred&surname=Weber&email=fweber@utk.edu&password=test";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['email'])) {$email = $output['email'];} else {$email = '';};
if(isset($output['password'])) {$password = $output['password'];} else {$password = '';};
if(isset($output['givenName'])) {$givenName = $output['givenName'];} else {$givenName = '';};
if(isset($output['surname'])) {$surname = $output['surname'];} else {$surname = '';};

// test for required inputs

if ($givenName=="") {
    	$response['error'] = "the given name is required";
    	returnWithError($response, $link);
}

if ($surname=="") {
    	$response['error'] = "the surname is required";
    	returnWithError($response, $link);
}

if ($email=="") {
    	$response['error'] = "the email is required";
    	returnWithError($response, $link);
}

if ($password=="") {
    	$response['error'] = "the password is required";
    	returnWithError($response, $link);
}

// remove any possible SQL injections in the form data

$givenName = test_input($link, $givenName);
$surname = test_input($link, $surname);
$email = test_input($link, $email);
$password = test_input($link, $password);

if (!preg_match("/^[a-zA-Z]*$/", $givenName)) {
  	$response['error'] = "only letters are allowed in a givenName"; 
	returnWithError($response, $link);
}

if (!preg_match("/^[a-zA-Z]*$/", $surname)) {
  	$response['error'] = "only letters are allowed in a surname"; 
	returnWithError($response, $link);
}

$createDate = date('Y-m-d h:i:s');

// Attempt insert query execution

$which = "givenName, surname, email, pswd, CREATEDATE";
$value = "'$givenName', '$surname', '$email', SHA1('$password'), '$createDate'";

mysqli_query($link, "INSERT INTO main ($which) VALUES ($value)");

if ($user_id = mysqli_insert_id($link)) {							
	$response['success'] = "Success";
 	$response['mainID'] = $user_id;				// INSERT success	
 } else {								// INSERT failure
    	$response['error'] = "an internal error was encountered";
 	returnWithError($response, $link);
}

// return a response

	http_response_code(200); 			//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
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