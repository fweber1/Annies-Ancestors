<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
	$error = "an internal error was encountered";
	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

$data = "ownerID=6120&mainID=6126&childID=6120&spouseID=6123";

//  get input to run script as forms handler

$data = $_SERVER['QUERY_STRING'];

// text input to run script as stand-alone for debugging

parse_str($data, $output);

if(isset($output['ownerID'])) {$ownerID = $output['ownerID'];} else {$ownerID = '';};
if(isset($output['mainID'])) {$mainID = $output['mainID'];} else {$mainID = '';};
if(isset($output['childID'])) {$childID = $output['childID'];} else {$childID = '';};
if(isset($output['spouseID'])) {$spouseID = $output['spouseID'];} else {$spouseID = '';};

// test for required inputs

if ($ownerID=="") {
	$error = "The owner ID is required";
	returnWithError($error, $link);
}

if ($mainID=="") {
	$error = "The person ID is required";
	returnWithError($error, $link);
}

// remove any possible SQL injections in the form data

$ownerID = test_input($link, $ownerID);
$mainID = test_input($link, $mainID);
$childID = test_input($link, $childID);
$spouseID = test_input($link, $spouseID);
$startDate = date('Y-m-d h:i:s');
$endDate = date('Y-m-d h:i:s');

// Attempt insert query execution

$createDate = date('Y-m-d h:i:s');

$which = "ownerID,mainID,childID,spouseID,startDate,endDate,CREATEDATE";
$value = "'$ownerID','$mainID','$childID','$spouseID','$startDate','$endDate','$createDate'";

mysqli_query($link, "INSERT INTO family ($which) VALUES ($value)");

if ($user_id = mysqli_insert_id($link)) {
	$response = $user_id;						// INSERT success
} else {										// INSERT failure
	$error = "Error: " . mysqli_error($link);
	returnWithError($error, $link);
}

$which = "ownerID,mainID,childID,spouseID,startDate,endDate,CREATEDATE";                                        // insert again with mainID and spouseID reversed
$value = "'$ownerID','$spouseID','$childID','$mainID','$startDate','$endDate','$createDate'";

mysqli_query($link, "INSERT INTO family ($which) VALUES ($value)");

if ($user_id = mysqli_insert_id($link)) {
	$response = $user_id;						// INSERT success
} else {										// INSERT failure
	$error = "Error: " . mysqli_error($link);
	returnWithError($error, $link);
}
	// return a response

	$response = "success";
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