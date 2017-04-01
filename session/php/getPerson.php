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

// text input to run script as stand-alone for debugging

 $data = "personID=6120";

//  get input to run script as forms handler (comment out line to run locally)

$data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['personID'])) {$personID = $output['personID'];} else {$personID = '';};

// test for required inputs

if (!is_numeric($personID)) {
    	$errors['personID'] = "A numeric personID is required";
    	returnWithError($errors, $results, $link);
}

// remove any possible SQL injections in the form data

$personID = test_input($link, $personID);

// get the person with ID of personID and include family info through the JOIN

$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, birth, death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, deathCounty, deathState, deathCountry, deathLocation";

$sql = mysqli_query($link, "SELECT $which FROM main WHERE mainID=$personID");

if(!$sql) {
    	$errors['sql'] = "Error: " . mysqli_error($link);
 	returnWithError($errors, $results, $link);
}

$data=mysqli_fetch_assoc($sql);	

foreach ($data as &$value) {
    $value['fullName']      = $value['namePrefix'] . ' ' . $value['givenName'] . ' ' . $value['middleName'] . ' ' . $value['surname'] . ' ' . $value['nameSuffix'];
};

// return a response

	echo json_encode($data);
	mysqli_close($link);
	return;

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