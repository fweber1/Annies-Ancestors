<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$response['error']   = 'pending';
$response['success'] = 'pending';
$response['names'] = 'pending';
$theRooms = [];

$link = mysqli_connect("localhost","root","mcwskw1","chat");
if (!$link) {
     	$response['error'] = "Error: Unable to connect to MySQL." . PHP_EOL;
	$response['error'] += "errno: " . mysqli_connect_errno() . PHP_EOL;
    	$response['error'] += "errno: " . mysqli_connect_error() . PHP_EOL;
    	returnWithError($response, $link);
}

$sql = mysqli_query($link, "SELECT roomID, roomName FROM rooms WHERE active=true");

if(!$sql) {
    	$response['error'] = mysqli_error($link);
	returnWithError($response, $link);
}

for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$theRooms[$i] = mysqli_fetch_assoc($sql);
}

$response['rooms'] = $theRooms;

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

?>