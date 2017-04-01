<?php
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Pragma: no-cache');

error_reporting(E_ALL);
ini_set('display_errors', true);
date_default_timezone_set('EST5EDT');					// need to set time zone of server for date --> epoch time

$error = 'pending';
$response['error']   = 'pending';
$response['success'] = 'pending';
$response['person'] = 'pending';
$mothers = [];
$minYear = 1990;
$tmp1 = array();

include dirname(__FILE__) . "/../../php/database.php";

$link = mysqli_connect($host,$username,$password,$db_name);

if (!$link) {
	$error = "an internal error was encountered";
   	returnWithError($error, $link);
}

// text input to run script as stand-alone for debugging

 $data = "personID=6120";

//  get input to run script as forms handler

$data = $_SERVER['QUERY_STRING'];

parse_str($data, $output);

if(isset($output['personID'])) {$personID = $output['personID'];} else {$personID = '';};

// test for required inputs

if (!is_numeric($personID)) {
	$response['error'] = "A numeric personID is required";
	returnWithError($response, $link);
}

$personID = test_input($link, $personID);

// don't need to retrieve personID since it is already known as $personID

// get the spouses of personID

$which = "mainID, spouseID, childID";
$where = "mainID = $personID AND childID = 0";

$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

if(!$sql) {
    	$error = mysqli_error($link);
	returnWithError($error, $link);
}

if(mysqli_num_rows($sql)>0) {
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$spouseIDs[$i] = mysqli_fetch_assoc($sql);
	}
	$spouseIDs = array_column($spouseIDs, 'spouseID');
} else {
	$spouseIDs[0] = -1;
}

// get the children of personID

$which = "mainID, spouseID, childID";
$where = "mainID = $personID AND childID != 0";

$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

if(!$sql) {
	$error = mysqli_error($link);
	returnWithError($error, $link);
}

for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$children[$i] = mysqli_fetch_assoc($sql);
}
$children = array_column($children, 'childID');

// get the parents of personID

$which = "mainID";
$where = "childID = $personID";

$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

if(!$sql) {
	$error = mysqli_error($link);
	returnWithError($error, $link);
}

if(mysqli_num_rows($sql)>0) {
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$parents[$i] = mysqli_fetch_assoc($sql);
	}
} else {
	$parents[0] = -1;
}
$parents = array_column($parents, 'mainID');

// get the parents of each spouse

$which = "mainID";
foreach($spouseIDs as $id) {
	$where = "childID = $id";
	
	$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");
	
	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}
	
	$tmp = null;
	if(mysqli_num_rows($sql)>0) {
		for ($i=0;$i<mysqli_num_rows($sql);$i++) {
			$tmp[$i] = mysqli_fetch_assoc($sql);
		}
	} else {
		$tmp[0] = array('mainID'=>-1);
	}

	$spouseParents[$id] = array_column($tmp, 'mainID');
}

// ******************************************
// get full person data for person
// ******************************************

$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";

$sql = mysqli_query($link, "SELECT $which FROM main WHERE mainID = $personID");

if(!$sql) {
	$error = mysqli_error($link);
	returnWithError($error, $link);
}

$person = mysqli_fetch_assoc($sql);

$which = "spouseID, childID, if(startDate IS NULL, 'N/A', DATE_FORMAT(startDate,'%M %d %Y')) AS startDate, ";
$which = $which . "if(endDate IS NULL, 'N/A', DATE_FORMAT(endDate,'%M %d %Y')) AS endDate";

$sql = mysqli_query($link, "SELECT $which FROM family WHERE mainID=$personID");

if(!$sql) {
	$error = mysqli_error($link);
	returnWithError($error, $link);
}

$tmp = mysqli_fetch_assoc($sql);
$person= array_merge($person, $tmp, array('what' => 'person'));
if($person['birthYear'] > $minYear) {
	$private = 'Y';
} else {
	$private = 'N';
}
$person = array_merge($person, array('privacy' => $private));


// ******************************************
// get full person data for spouses
// ******************************************

	$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
	$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
	$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
	$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
	$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
	$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";
	$spouseList = implode(',', $spouseIDs);
	
	$sql = mysqli_query($link, "SELECT $which FROM main WHERE main.mainID IN ($spouseList)");
	
	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}
	
	$tmp = null;
	if(mysqli_num_rows($sql)>0) {
		for ($i=0;$i<mysqli_num_rows($sql);$i++) {
			$tmp[$i] = mysqli_fetch_assoc($sql);
		}
		$spouses = $tmp;
	} else {
		$spouses[0] = -1;
	}

	$which = "spouseID, childID, if(startDate IS NULL, 'N/A', DATE_FORMAT(startDate,'%M %d %Y')) AS startDate, ";
	$which = $which . "if(endDate IS NULL, 'N/A', DATE_FORMAT(endDate,'%M %d %Y')) AS endDate";
	
	$sql = mysqli_query($link, "SELECT $which FROM family WHERE mainID IN ($spouseList) AND childID=0");
	
	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}
	
	$tmp = null;
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$tmp[$i] = mysqli_fetch_assoc($sql);
		$spouses[$i] = array_merge($spouses[$i], $tmp[$i], array('what' => 'spouse'));
		if($spouses[$i]['birthYear'] > $minYear) {
			$private = 'Y';
		} else {
			$private = 'N';
		}
		$spouses[$i] = array_merge($spouses[$i], array('privacy' => $private));
	}

	
	// ******************************************
	// get full person data for spouses parents
	// ******************************************

	$cnt = 0;
	foreach($spouseParents as $row) {
		$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
		$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
		$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
		$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
		$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
		$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";

		$parentList = implode(',', $row);
		$sql = mysqli_query($link, "SELECT $which FROM main WHERE mainID IN ($parentList)");

		if(!$sql) {
			$error = mysqli_error($link);
			returnWithError($error, $link);
		}
		
		$tmp1 = null;
		$tmp = null;
		if(mysqli_num_rows($sql)>0) {
			for ($i=0;$i<mysqli_num_rows($sql);$i++) {
			$tmp[$i] = mysqli_fetch_assoc($sql);
			if($tmp[$i]['birthYear'] > $minYear) {
				$private = 'Y';
			} else {
				$private = 'N';
			}
			$tmp[$i] = array_merge($tmp[$i], array('privacy' => $private));
			$tmp1[$cnt] = $tmp;
			}
		} else {
			$tmp1[$cnt] = array('mainID' => -1);
		}
	
		$spouseFathers = null;
		$spouseMothers = null;
		foreach($tmp1[$cnt] as $val) {
			if($val['gender'] == 'M') {
				$spouseFathers[$cnt] = $val;
			} else {
				$spouseMothers[$cnt] = $val;
			}
		}
		$spouses[$cnt]['fathers'] = $spouseFathers;
		$spouses[$cnt]['mothers'] = $spouseMothers;
		$cnt++;
	}

// ******************************************
// get full person data for parents
// ******************************************
		
	$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
	$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
	$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
	$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
	$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
	$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";
	$parentList = implode(',', $parents);
	
	$sql = mysqli_query($link, "SELECT $which FROM main WHERE main.mainID IN ($parentList) ORDER BY mainID");
	
	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}
	
	
	$tmp = null;
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$tmp[$i] = mysqli_fetch_assoc($sql);
	}
	$parents = $tmp;
	
	$which = "spouseID, childID, if(startDate IS NULL, 'N/A', DATE_FORMAT(startDate,'%M %d %Y')) AS startDate, ";
	$which = $which . "if(endDate IS NULL, 'N/A', DATE_FORMAT(endDate,'%M %d %Y')) AS endDate";
	
	$sql = mysqli_query($link, "SELECT $which FROM family WHERE mainID IN ($parentList) AND (childID=$personID OR childID IN ($spouseList)) ORDER BY mainID");
	
	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}
	
	$tmp = null;
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$tmp[$i] = mysqli_fetch_assoc($sql);
		if($parents[$i]['gender']=='M') {
			$fathers[$i] = array_merge($parents[$i], $tmp[$i], array('what' => 'father'));
			if($fathers[$i]['birthYear'] > $minYear) {
				$private = 'Y';
			} else {
				$private = 'N';
			}
			$fathers[$i] = array_merge($fathers[$i], array('privacy' => $private));
			} else {
			$mothers[$i] = array_merge($parents[$i], $tmp[$i], array('what' => 'mother'));
			if($mothers[$i]['birthYear'] > $minYear) {
				$private = 'Y';
			} else {
				$private = 'N';
			}
			$mothers[$i] = array_merge($mothers[$i], array('privacy' => $private));
		}
	}
	if(!isset($mothers) || count($mothers)==0) {
		$mothers[0] = -1;
		$mothers[0]['privacy'] = 'N';
		$mothers = array_merge($mothers, array('what' => 'mother'));
		}
	if(!isset($fathers) || count($fathers)==0) {
		$fathers[0] = -1;
		$fathers[0]['privacy'] = 'N';
		$fathers = array_merge($fathers, array('what' => 'mother'));
		}

	$fathers = array_values($fathers);
	$mothers = array_values($mothers);
	
	// ******************************************
	// get full person data for children
	// ******************************************
	
	$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
	$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
	$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
	$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
	$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
	$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";
	$childrenList = implode(',', $children);
	
	$sql = mysqli_query($link, "SELECT $which FROM main WHERE mainID IN ($childrenList)");
	
	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}
	
	$tmp = null;
	if(mysqli_num_rows($sql)>0) {
		for ($i=0;$i<mysqli_num_rows($sql);$i++) {
			$tmp[$i] = mysqli_fetch_assoc($sql);
		}
		$children = $tmp;
	} else {
		$children[0] = -1;
	}
	
	$which = "spouseID, childID, if(startDate IS NULL, 'N/A', DATE_FORMAT(startDate,'%M %d %Y')) AS startDate, ";
	$which = $which . "if(endDate IS NULL, 'N/A', DATE_FORMAT(endDate,'%M %d %Y')) AS endDate";
	
	$sql = mysqli_query($link, "SELECT $which FROM family WHERE childID IN ($childrenList) AND mainID=$personID");
	
	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}
	
	$tmp = null;
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$tmp[$i] = mysqli_fetch_assoc($sql);
		$children[$i] = array_merge($children[$i], $tmp[$i], array('what' => 'children'));
		if($children[$i]['birthYear'] > $minYear) {
			$private = 'Y';
		} else {
			$private = 'N';
		}
		$children[$i] = array_merge($children[$i], array('privacy' => $private));
	}

	$person = array_merge($person, array('curSpouse' => count($spouses)-1), array('numSpouse' => count($spouses)));
	$person = array_merge($person, array('numParent' => count($parents)), array('numChildren' => count($children)));
	$person = array_merge($person, array('curFather' => count($fathers)-1), array('curMother' => count($mothers)-1));
	$person = array_merge($person, array('spouses' => $spouses), array('children' => $children));
	$person = array_merge($person, array('fathers' => $fathers), array('mothers' => $mothers));

	// return a response

$response['success'] = 'success'; 		//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
$response['person'] = $person; 
$response['error'] = $error; 
http_response_code(200);
echo ")]}',\n" . json_encode($response);	// )]}', is used to stop JSON attacks, angular strips it off for you.
mysqli_close($link);
return;

function returnWithError($error, $link) {
	http_response_code(303);
	echo ")]}',\n" . json_encode($error);
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