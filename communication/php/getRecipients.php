<?php
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Pragma: no-cache');

error_reporting(E_ALL);
ini_set('display_errors', true);

$response['error']   = 'pending';
$response['success'] = 'pending';
$response['names'] = 'pending';

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
     	$error = "an internal error was encountered";
    	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

 $data = "id=6120";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

$id = $output['id'];

$id = test_input($link, $id);

// get the people interested in person with $id

$which = "mainID";
$where = "ownderID = $id";

$sql = mysqli_query($link, "SELECT $which FROM recipients WHERE $where");

if(!$sql) {
    	$error = mysqli_error($link);
	returnWithError($error, $link);
}

for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$who[$i] = mysqli_fetch_assoc($sql);
}

$who = implode(",",array_map(function($who) { return $who["mainID"]; }, $who));

mysqli_close($link);

// now get the full data for the people interested in $id

$link = mysqli_connect("localhost","root","mcwskw1","ancestors");
if (!$link) {
     	$error = "an internal error was encountered";
    	returnWithError($error, $link);
}

$which = "mainID, surname, givenName, curCity, curState";
$where = "mainID IN ($who)";

$sql = mysqli_query($link, "SELECT $which FROM main WHERE $where");

if(!$sql) {
    	$error = mysqli_error($link);
	returnWithError($error, $link);
}

for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$theName[$i] = mysqli_fetch_assoc($sql);
}

$response['names'] = $theName;

// return a response

	$response['success'] = 'success'; 		//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	http_response_code(200);
	echo ")]}',\n" . json_encode($response);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

function returnWithError($error, $link) {
	$response['success'] = 'failed'; 
	$response['error'] = $error;		
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