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

$data = "mainID=6120&surname=johnson&namePrefix=&givenName=&middleName=&nameSuffix=&theNote=&theSource=&theQual=";

//  get input to run script as forms handler

$data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

parse_str($data, $output);

if(isset($output['mainID'])) {$mainID = $output['mainID'];} else {$mainID = '';};
if(isset($output['gender'])) {$gender = $output['gender'];} else {$gender = '';};
if(isset($output['namePrefix'])) {$namePrefix = $output['namePrefix'];} else {$namePrefix = '';};
if(isset($output['givenName'])) {$givenName = $output['givenName'];} else {$givenName = '';};
if(isset($output['middleName'])) {$middleName = $output['middleName'];} else {$middleName = '';};
if(isset($output['surname'])) {$surname = $output['surname'];} else {$surname = '';};
if(isset($output['nameSuffix'])) {$nameSuffix = $output['nameSuffix'];} else {$nameSuffix = '';};

// test for required inputs

if ($surname=="") {
    	$error = "The last name is required";
    	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$mainID = test_input($link, $mainID);
$namePrefix = test_input($link, $namePrefix);
$givenName = test_input($link, $givenName);
$middleName = test_input($link, $middleName);
$surname = test_input($link, $surname);
$nameSuffix = test_input($link, $nameSuffix);


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

// NOTE: still need to figure out birth & death dates and places

$which = "namePrefix='$namePrefix', givenName='$givenName', middleName='$middleName', surname='$surname', nameSuffix='$nameSuffix', gender='$gender'";
$where = "mainID=$mainID";

$sql = mysqli_query($link, "UPDATE main SET $which WHERE $where");

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