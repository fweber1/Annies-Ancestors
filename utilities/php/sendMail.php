<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

$error   = 'pending';
$success = 'pending';
date_default_timezone_set ('America/Kentucky/Louisville');

// text input to run script as stand-alone for debugging

 $data = "to=fweber@utk.edu&subject=Registration&body=ddsfsdfdsf&headers=From:+fweber@utk.edu";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['to'])) {$to = $output['to'];} else {$to = '';};
if(isset($output['subject'])) {$subject = $output['subject'];} else {$subject = '';};
if(isset($output['body'])) {$body = $output['body'];} else {$body = '';};
if(isset($output['headers'])) {$headers = $output['headers'];} else {$headers = '';};

// test for required inputs

if ($to=="") {
    	$error = "the to: email is required";
    	returnWithError($error);
}

if ($subject=="") {
	$error = "the subject is required";
    	returnWithError($error);
}

if ($body=="") {
	$error = "the body is required";
    	returnWithError($error);
}

if ($headers=="") {
	$error = "the headers are required";
    	returnWithError($error);
}

// remove any possible SQL injections in the form data

$to = test_input($to);
$subject = test_input($subject);
$body = test_input($body);
$headers = test_input($headers);

if (!preg_match("/^[a-zA-Z@`.`0-9]*$/",$to)) {
	$error = "only letters, '@', and '.' are allowed in the receipent"; 
   	returnWithError($error);
}

mail($to,$subject,$body,$headers);

// return a response

	http_response_code(200); 		 			//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	$returnStr['results']  = 'success';
	$returnStr['error']  = $error;
	echo ")]}',\n" . json_encode($returnStr);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	return;

function returnWithError($error) {
	http_response_code(303);
	$returnStr['response']  = 'failure';
	$returnStr['error']  = $error;
	echo ")]}',\n" . json_encode($returnStr);
	exit;
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>
