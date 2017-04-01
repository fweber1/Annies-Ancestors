<?php

//******************************************************************
//    Still to do: check for existance of the name in DB
//******************************************************************

$errors = array();
$results = array();
$returnStr = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
     	$errors['sql'] = "Error: Unable to connect to MySQL." . PHP_EOL;
	$errors['sql'] += "errno: " . mysqli_connect_errno() . PHP_EOL;
    	$errors['sql'] += "errno: " . mysqli_connect_error() . PHP_EOL;
    	returnWithError($errors, $results, $link);
}

//  get input to run script as forms handler

$data = $_SERVER[QUERY_STRING];

// text input to run script as stand-alone for debugging

//$data = "givenName=Fred&surname=Weber&email=fweber@utk.edu&password=test";

parse_str($data);

// test for required inputs

if ($givenName=="") {
    	$errors['firstName'] = "The givent name is required";
    	returnWithError($errors, $results, $link);
}

if ($surname=="") {
    	$errors['lastName'] = "The surname is required";
    	returnWithError($errors, $results, $link);
}

if ($email=="") {
    	$errors['email'] = "The email is required";
    	returnWithError($errors, $results, $link);
}

if ($password=="") {
    	$errors['password'] = "The password is required";
    	returnWithError($errors, $results, $link);
}

// remove any possible SQL injections in the form data

$givenName = test_input($link, $givenName);
$surname = test_input($link, $surname);
$email = test_input($link, $email);
$password = test_input($link, $password);

if (!preg_match("/^[a-zA-Z ]*$/",$givenName)) {
  $errors['given name'] = "Only letters and white spaces are allowed"; 
}
if (!preg_match("/^[a-zA-Z ]*$/",$surname)) {
  $$errors['surname'] = "Only letters and white spaces are allowed"; 
}

// check if person already exists

$sql = mysqli_query($link, "SELECT email FROM main WHERE email='$email'");

if($sql) {
	$nRows = mysqli_num_rows($sql);

	if($nRows>0) {
		$errors['exists'] = "$nRows";
		$errors['value'] = "$email";	
		returnWithError($errors, $results, $link);
	};
}

// no one with the submitted name exists, so continue

// Attempt insert query execution

mysqli_query($link, "INSERT INTO main (givenName,surname,email,password) VALUES ('$givenName','$surname','$email',SHA1('$password'))");

if ($user_id = mysqli_insert_id($link)) {							
	$results['sql'] = "Insert succeeded: new ID=" . $user_id;			// INSERT success	
 } else {										// INSERT failure
    	$errors['sql'] = "Error: " . mysqli_error($link);
 	returnWithError($errors, $results, $link);
}

// return a response

if (empty($errors)) {									// if there are errors, return them
	$results['newID'] = $user_id;
	$results['success'] = 'succeeded';
	$returnStr['results']  = $results;
	$returnStr['errors']  = $errors;
	echo json_encode($returnStr);
	mysqli_close($link);
	return;
} else {
	returnWithError($errors, $results, $link);
}
function returnWithError($errors, $results, $link) {
	$results['success'] = 'failed';
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