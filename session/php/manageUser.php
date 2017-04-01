<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$response['error']   = 'pending';
$response['success'] = 'pending';

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
     	$response['error'] = "Error: Unable to connect to MySQL." . PHP_EOL;
	$response['error'] += "errno: " . mysqli_connect_errno() . PHP_EOL;
    	$response['error'] += "errno: " . mysqli_connect_error() . PHP_EOL;
    	returnWithError($response, $link);
}

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

// $data = "email1=fweber@utk.edu&email2=fweber@utk.edu";

parse_str($data, $output);

// test for required inputs

if(isset($output['email1'])) {$email = $output['email1'];} else {$email = '';};

// test for required inputs

if ($email=="") {
    	$response['error'] = "The email is required";
    	returnWithError($response, $results, $link);
}

if (!preg_match("/^[a-zA-Z@`.`0-9]*$/",$email)) {
  	$response['error'] = "Only letters, numbers, '@', and '.' are allowed in emails"; 
    	returnWithError($response, $results, $link);
}

// remove any possible SQL injections in the form data

$email = test_input($link, $email);

// Attempt insert query execution

$sql = mysqli_query($link, "UPDATE main SET email=$email");

if ($user_id = mysqli_insert_id($link)) {							
	$response['success'] = "Update succeeded";
	$response['mainID'] = $user_id;						// INSERT success	
 } else {										// INSERT failure
 	$response['error'] = 'SQL error';
	returnWithError($response, $link);
}

// return a response

$data=mysqli_fetch_assoc($sql);	

// return a response

	$response['success'] = 'success'; 		//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	http_response_code(200);
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