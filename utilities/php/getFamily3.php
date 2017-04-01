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

//$data = $_SERVER['QUERY_STRING'];

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

$which = "spouseID";
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
	$nSpouses = count($spouseIDs);
} else {
	$nSpouses = 0;
}

// get the children of personID

$which = "mainID, spouseID, childID";
$where = "mainID = $personID AND childID != 0";

$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

if(!$sql) {
	$error = mysqli_error($link);
	returnWithError($error, $link);
}

$children = null;
for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$childrenIDs[$i] = mysqli_fetch_assoc($sql);
}

if(!isset($childrenIDs) || count($childrenIDs)==0) {
	$nChildren = 0;
	$childrenIDs[0] = -1;
} else {
	$childrenIDs = array_column($childrenIDs, 'childID');
	$nChildren = count($childrenIDs);
}

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
			$parentIDs[$i] = mysqli_fetch_assoc($sql);
		}
		$nParents = count($parentIDs);
		$parentIDs = array_column($parentIDs, 'mainID');
	} else {
		$nParents = 0;
		$parentIDs[0] = -1;
}

// get the parents of each spouse

	if($nSpouses>0) {
		$which = "mainID, childID";
		for ($i=0;$i<$nSpouses;$i++) {
			$where = "childID = $spouseIDs[$i]";

			$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

			if(!$sql) {
				$error = mysqli_error($link);
				returnWithError($error, $link);
			}

			if(mysqli_num_rows($sql)>0) {
				$spouseParentIDs[$i] = mysqli_fetch_assoc($sql);
				$nSpouseParents = count($spouseParentIDs);
			} else {
				$nSpouseParents = 0;
			}
		}
	} else {
		$nSpouseParents = 0;
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

	if($person['birthYear'] > $minYear) {
		$private = 'Y';
	} else {
		$private = 'N';
	}
	$person = array_merge($person, array('privacy' => $private));

// ******************************************
// get full person data for spouses
// ******************************************

	if($nSpouses>0) {
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
			$spouses[0]['mainID'] = -1;
		}

		$which = "spouseID, childID, if(startDate IS NULL, 'N/A', DATE_FORMAT(startDate,'%M %d %Y')) AS startDate, ";
		$which = $which . "if(endDate IS NULL, 'N/A', DATE_FORMAT(endDate,'%M %d %Y')) AS endDate";

		$sql = mysqli_query($link, "SELECT $which FROM family WHERE mainID IN ($spouseList) AND childID=0 AND spouseID=$personID");

		if(!$sql) {
			$error = mysqli_error($link);
			returnWithError($error, $link);
		}

		$tmp = null;
		for ($i=0;$i<mysqli_num_rows($sql);$i++) {
			$tmp[$i] = mysqli_fetch_assoc($sql);
			$spouses[$i] = array_merge($spouses[$i], $tmp[$i]);
			if($spouses[$i]['birthYear'] > $minYear) {
				$private = 'Y';
			} else {
				$private = 'N';
			}
			$spouses[$i] = array_merge($spouses[$i], array('privacy' => $private));
		}
	} else {
		$spouses[0]['mainID'] = -1;
	}

// ******************************************
// get full person data for spouses parents
// ******************************************

	if($nSpouseParents>0) {
		for($i=0;$i<$nSpouseParents;$i++) {
			$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
			$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
			$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
			$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
			$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
			$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";

			$id = $spouseParentIDs[$i]['mainID'];
			$where = "mainID=$id";
			$sql = mysqli_query($link, "SELECT $which FROM main WHERE $where");

			if(!$sql) {
				$error = mysqli_error($link);
				returnWithError($error, $link);
			}

			if(mysqli_num_rows($sql)>0) {
				$tmp = mysqli_fetch_assoc($sql);
				for($j=0;$j<$nSpouses;$j++) {
					if ($spouses[$j]['mainID'] == $spouseParentIDs[$i]['childID']) {
						if($tmp['gender'] == 'M') {
							$spouses[$j] = array_merge($spouses[$j], array('fathers' => $tmp));
						} else {
							$spouses[$j] = array_merge($spouses[$j], array('mothers' => $tmp));
						}
					}
				}
			}
		}
		for($i=0;$i<$nSpouses;$i++) {
			if(!array_key_exists('fathers',$spouses[$i])) {
				echo array_key_exists('fathers',$spouses);
				$spouses[$i] = array_merge($spouses[$i], array('fathers' => $tmp1));
			}
			if(!array_key_exists('mothers',$spouses[$i])) {
				$spouses[$i] = array_merge($spouses[$i], array('mothers' => $tmp1));
			}
		}
	}

// ******************************************
// get full person data for parents
// ******************************************

	if($nParents>0) {
		$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
		$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
		$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
		$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
		$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
		$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";
		$parentList = implode(',', $parentIDs);

		if($parentList=='') $parentList = '-1,-1';

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

		$sql = mysqli_query($link, "SELECT $which FROM family WHERE mainID IN ($parentList) AND (childID=$personID) ORDER BY mainID");

		if(!$sql) {
			$error = mysqli_error($link);
			returnWithError($error, $link);
		}


	} else {
		$mothers[0]['mainID'] = -1;
		$fathers[0]['mainID'] = -1;
	}

// ******************************************
// get full person data for children
// ******************************************

	if($nChildren>0) {
		$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix, if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%Y')) AS birthYear, ";
		$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birthDate, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
		$which = $which . "if(birth IS NULL,'N/A', DATE_FORMAT(birth,'%M %d %Y')) AS birth, if(death IS NULL,'Living', DATE_FORMAT(death,'%M %d %Y')) AS deathDate, ";
		$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName, ";
		$which = $which . "if(death IS NULL,'N/A', DATE_FORMAT(death,'%M %d %Y')) AS death, birthCity, birthCounty, birthState, birthCountry, birthLocation, deathCity, ";
		$which = $which . "deathCounty, deathState, deathCountry, deathLocation, if(death IS NULL,'Y','N') AS living";
		$childrenList = implode(',', $childrenIDs);

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
		$nChildren = count($children);
	} else {
		$nChildren = 0;
		$children[0]['mainID'];
	}

	$person = array_merge($person, array('curSpouse' => count($spouses)-1), array('numSpouse' => count($spouses)));
	$person = array_merge($person, array('numChildren' => $nChildren));
	$person = array_merge($person, array('curFather' => count($fathers)-1), array('curMother' => count($mothers)-1));
	$person = array_merge($person, array('spouses' => $spouses), array('children' => $children));
	$person = array_merge($person, array('fathers' => $fathers), array('mothers' => $mothers));

	// ******************************************
	// get media for main person
	// ******************************************

	$which = "theType,mainType,theContent,theFile,theTitle,longTitle,id";
	$where = "$personID = mainID";

	$sql = mysqli_query($link, "SELECT $which FROM media WHERE $where");

	if(!$sql) {
		$error = "Error: " . mysqli_error($link);
		returnWithError($error, $link);
	}
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$tmp[$i] = mysqli_fetch_assoc($sql);
	}

	if(isset($tmp)) {
		$response = $tmp;
	}
	$person = array_merge($person, array('media' => $response));
	$response = null;

	// ******************************************
	// get attributes for main person
	// ******************************************

	$which = "spouseID,fatherID,motherID,mainType,theType,dateModifier,date1,date2,phrase,city,county,";
	$which = $which . "state,country,details,theFile,id";
	$where = "$personID = mainID";

	$sql = mysqli_query($link, "SELECT $which FROM events WHERE $where");

	if(!$sql) {
		$error = "Error: " . mysqli_error($link);
		returnWithError($error, $link);
	}

	$tmp = array();
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$tmp[$i] = mysqli_fetch_assoc($sql);
	}

	if(isset($response)) {
		$response = array_merge($response, $tmp);
	} else {
		$response = $tmp;
	}

	$person = array_merge($person, array('attributes' => $response));
	$response = null;

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