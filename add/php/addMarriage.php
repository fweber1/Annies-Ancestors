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

$data = "ownerID=6120&mainID=6121&spouseID=6126&theType=MARR&dateModifier=EXA&date1=11/07/1952&date2=&phrase=&city=Minneapolis&state=Minnesota&county=Hennipen&country=USA&details=Hackley Hospital";

//  get input to run script as forms handler, comment out to run in terminal

 $data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

parse_str($data, $output);

if(isset($output['ownerID'])) {$ownerID = $output['ownerID'];} else {$ownerID = '';};
if(isset($output['mainID'])) {$mainID = $output['mainID'];} else {$mainID = '';};
if(isset($output['theType'])) {$theType = $output['theType'];} else {$theType = '';};
if(isset($output['dateModifier'])) {$dateModifier = $output['dateModifier'];} else {$dateModifier = '';};
if(isset($output['date1'])) {$date1 = $output['date1'];} else {$date1 = '';};
if(isset($output['date2'])) {$date2 = $output['date2'];} else {$date2 = '';};
if(isset($output['phrase'])) {$phrase = $output['phrase'];} else {$phrase = '';};
if(isset($output['city'])) {$city = $output['city'];} else {$city = '';};
if(isset($output['state'])) {$state = $output['state'];} else {$state = '';};
if(isset($output['county'])) {$county = $output['county'];} else {$county = '';};
if(isset($output['country'])) {$country = $output['country'];} else {$country = '';};
if(isset($output['details'])) {$details = $output['details'];} else {$details = '';};
if(isset($output['spouseID'])) {$spouseID = $output['spouseID'];} else {$spouseID = '';};

// test for required inputs

if ($date1=="") {
    	$error = "The event date is required";
    	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$ownerID = test_input($link, $ownerID);
$mainID = test_input($link, $mainID);
$theType = test_input($link, $theType);
$dateModifier = test_input($link, $dateModifier);
$date1 = test_input($link, $date1);
$date2 = test_input($link, $date2);
$phrase = test_input($link, $phrase);
$city = test_input($link, $city);
$state = test_input($link, $state);
$county = test_input($link, $county);
$country = test_input($link, $country);
$details = test_input($link, $details);
$spouseID = test_input($link, $spouseID);

if (!preg_match("/^[a-zA-Z ]*$/",$city)) {
	$error = "Only letters and white spaces are allowed in the city name";
	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$state)) {
	$error = "Only letters and white spaces are allowed in the state name";
	returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$county)) {
  $error = "Only letters and white spaces are allowed in the county name"; 
  returnWithError($error, $link);
}

if (!preg_match("/^[a-zA-Z ]*$/",$country)) {
	$error = "Only letters and white spaces are allowed in the country name";
	returnWithError($error, $link);
}

$date1 = date('Y-m-d ', strtotime($date1));
$date2= date('Y-m-d ', strtotime($date2));

$createDate = date('Y-m-d h:i:s');

// Attempt insert query execution

$which = "ownerID,mainID,theType,dateModifier,date1,date2,phrase,city,state,county,country,details,CREATEDATE";
$value = "'$ownerID','$mainID','$theType','$dateModifier','$date1','$date2','$phrase','$city','$county','$state','$country','$details','$createDate'";

mysqli_query($link, "INSERT INTO events ($which) VALUES ($value)");

if ($user_id = mysqli_insert_id($link)) {							
 } else {										// INSERT failure
    $error = "Error: " . mysqli_error($link);
 	returnWithError($error, $link);
}

if($spouseID=='Unknown') $spouseID = -1;

if($spouseID!=-1) {										// have mother and/or father, so add to family DB
	$which = "ownerID,mainID,spouseID,childID,startDate,endDate,CREATEDATE";
	$value = "'$ownerID','$mainID','$spouseID', '0','$date1','$date2','$createDate'";

	$sql = mysqli_query($link, "INSERT INTO family ($which) VALUES ($value)");

	if(!$sql) {
		$error = "Error: " . mysqli_error($link);
		returnWithError($error, $link);
	}

	$which = "ownerID,mainID,spouseID,childID,startDate,endDate,CREATEDATE";
	$value = "'$ownerID','$spouseID','$mainID', '0','$date1','$date2','$createDate'";
	
	$sql = mysqli_query($link, "INSERT INTO family ($which) VALUES ($value)");

	if(!$sql) {
		$error = "Error: " . mysqli_error($link);
		returnWithError($error, $link);
	}
}

// return a response

	http_response_code(200);					//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
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