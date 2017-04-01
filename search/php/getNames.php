<?php
error_reporting(E_ALL);
ini_set('display_errors', true);
date_default_timezone_set('EST5EDT');					// need to set time zone of server for date --> epoch time

$error   = 'pending';
$response = 'pending';
$returnStr = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
	$error = "an internal error was encountered";
   	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

 $data = "surname=joh&soundex=false";

//  get input to run script as forms handler

 $data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

$surname = $output['surname'];
$soundex = $output['soundex'];

$surname = test_input($link, $surname);
$soundex = test_input($link, $soundex);

// get the people whose name starts with $surname and if soundex is true, use it

$doSoundex = " surname LIKE '$surname" . "%'";
if($soundex == 'true') {
	$doSoundex = 'SOUNDEX("' . $surname . '") = SOUNDEX(surname)';
};

$which = "mainID, email, gender, namePrefix, surname, givenName, middleName, nameSuffix, if(birth IS NULL,'N/A', birth) AS birth, if(death IS NULL,'N/A', death) AS death, birthCity, deathCity";
$where = "email IS NOT NULL AND $doSoundex";

$sql = mysqli_query($link, "SELECT $which FROM main WHERE $where");

if(!$sql) {
    	$error = mysqli_error($link);
	returnWithError($error, $link);
}

for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$theName[$i] = mysqli_fetch_assoc($sql);
}


foreach ($theName as &$value) {
    $value['fullName']      = $value['namePrefix'] . ' ' . $value['givenName'] . ' ' . $value['middleName'] . ' ' . $value['surname'] . ' ' . $value['nameSuffix'];
   if($value['birth']     != 'N/A') $value['birth']     = date('F d, Y', strtotime($value['birth']));
    if($value['death']     != 'N/A') $value['death']     = date('F d, Y', strtotime($value['death']));
    if($value['birth']     != 'N/A') {
	$value['birthDate'] = date('F d, Y', strtotime($value['birth']));	
	$value['birthYear'] = date('Y', strtotime($value['birth']));
    } else {
	$value['birthDate'] = 'N/A';
	$value['birthYear'] = 'N/A';
   }
   if($value['death']     != 'N/A') {
	$value['deathDate'] = date('F d, Y', strtotime($value['death']));	
	$value['deathYear'] = date('Y', strtotime($value['death']));
    	$value['showPerson']= true;
      	$value['living']    = false;
    } else {
	$value['deathDate'] = 'Living';
	$value['deathYear'] = 'Living';
    	$value['showPerson']= true;
    	$value['living']    = true;
    }
 }

// return a response

	$returnStr['results']  = 'success';
	$returnStr['error']  = $error;
	$returnStr['names']  = $theName;
	http_response_code(200); 			//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($returnStr);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	mysqli_close($link);
	return;

function returnWithError($error, $link) {
	$returnStr['results']  = 'failure';
	$returnStr['error']  = $error;
	http_response_code(303);
	echo ")]}',\n" . json_encode($returnStr);
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
