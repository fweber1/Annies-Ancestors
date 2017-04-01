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

$data = "gender=M&surname=johnson&namePrefix=&givenName=&middleName=&nameSuffix=&theNote=&theSource=&theQual=";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

parse_str($data, $output);

if(isset($output['gender'])) {$gender = $output['gender'];} else {$gender = '';};
if(isset($output['namePrefix'])) {$namePrefix = $output['namePrefix'];} else {$namePrefix = '';};
if(isset($output['givenName'])) {$givenName = $output['givenName'];} else {$givenName = '';};
if(isset($output['middleName'])) {$middleName = $output['middleName'];} else {$middleName = '';};
if(isset($output['surname'])) {$surname = $output['surname'];} else {$surname = '';};
if(isset($output['nameSuffix'])) {$nameSuffix = $output['nameSuffix'];} else {$nameSuffix = '';};
if(isset($output['theNote'])) {$theNote = $output['theNote'];} else {$theNote = '';};
if(isset($output['theSource'])) {$theSource = $output['theSource'];} else {$theSource = '';};
if(isset($output['theQual'])) {$theQual = $output['theQual'];} else {$theQual = '';};

// test for required inputs

if ($surname=="") {
    	$error = "The last name is required";
    	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$gender = test_input($link, $gender);
$namePrefix = test_input($link, $namePrefix);
$givenName = test_input($link, $givenName);
$middleName = test_input($link, $middleName);
$surname = test_input($link, $surname);
$nameSuffix = test_input($link, $nameSuffix);
$theNote = test_input($link, $theNote);
$theQual = test_input($link, $theQual);
$theSource = test_input($link, $theSource);

if ($theQual=='') $theQual = 0;

if ($gender!='M' && $gender!='F') {
	$error = "Only male or female is allowed";
	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$surname)) {
	$error = "Only letters and white spaces are allowed in the surname";
	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$namePrefix)) {
	$error = "Only letters and white spaces are allowed in the name prefix";
	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$givenName)) {
  $error = "Only letters and white spaces are allowed in the given name"; 
  returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$middleName)) {
	$error = "Only letters and white spaces are allowed in the middle name";
	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$nameSuffix)) {
	$error = "Only letters and white spaces are allowed in the name suffix";
	returnWithError($error, $link);
}

// check if person already exists

// Attempt insert query execution

$createDate = date('Y-m-d h:i:s');

$which = "gender,namePrefix,givenName,middleName,surname,nameSuffix,theNote,theQual,theSource,CREATEDATE";
$value = "'$gender','$namePrefix','$givenName','$middleName','$surname','$nameSuffix','$theNote','$theQual','$theSource','$createDate'";

mysqli_query($link, "INSERT INTO main ($which) VALUES ($value)");

if ($user_id = mysqli_insert_id($link)) {							
	$response = $user_id;						// INSERT success	
	$source = dirname(__FILE__) . '/../../sheet/profilePhotos/missing.jpeg';
	$dest = dirname(__FILE__) . '/../../sheet/profilePhotos/' . $user_id . '.jpeg';
	copy($source , $dest);
} else {										// INSERT failure
    $error = "Error: " . mysqli_error($link);
 	returnWithError($error, $link);
}

// return a response

	http_response_code(200);					//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($response);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

	function returnWithDuplicates($response, $link) {
		http_response_code(302);
		echo ")]}',\n" . json_encode($response);
		mysqli_close($link);
		exit;
	}

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