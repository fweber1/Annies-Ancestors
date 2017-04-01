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

$which = "spouse1ID,spouse2ID";
$where = "childID = 0 AND (spouse1ID = $personID  OR spouse2ID = $personID)";

$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

if(!$sql) {
    $error = mysqli_error($link);
	returnWithError($error, $link);
}

if(mysqli_num_rows($sql)>0) {
	for ($i=0;$i<mysqli_num_rows($sql);$i++) {
		$tmp = mysqli_fetch_assoc($sql);
        foreach (array_keys($tmp, $personID, true) as $key) {               // remove all keys with $personID as the value
            unset($tmp[$key]);
        }
        foreach ($tmp as $value) {
            $spouseIDs[$i] = $value;                                        // save spouseID in simple array
        }
  	}
	$nSpouses = count($spouseIDs);                                          // array_values converts associative array to regular array
} else {
	$nSpouses = 0;                                                          // no spouses, so set values
}

// get the children of personID

$which = "spouse1ID, spouse2ID, childID";
$where = "childID != 0 AND (spouse1ID=$personID OR spouse2ID=$personID)";

$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

if(!$sql) {
	$error = mysqli_error($link);
	returnWithError($error, $link);
}

for ($i=0;$i<mysqli_num_rows($sql);$i++) {
	$childIDs[$i] = mysqli_fetch_assoc($sql);
}

if(!isset($childIDs) || count($childIDs)==0) {
	$nChildren = 0;
} else {
	$childIDs = array_column($childIDs, 'childID');                         // get childID column values
	$nChildren = count($childIDs);
}

// get the parents of personID

	$which = "spouse1ID,spouse2ID";
	$where = "childID = $personID";

	$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}

	if(mysqli_num_rows($sql)>0) {
		for ($i=0;$i<mysqli_num_rows($sql);$i++) {
			$tmp = mysqli_fetch_assoc($sql);
			$tmp1[$i] = $tmp['spouse1ID'];
			$tmp2[$i] = $tmp['spouse2ID'];
		}
        $parentIDs = array_merge($tmp1, $tmp2);
        $parentIDs = array_unique($parentIDs);
        $nParents = count($parentIDs);
     } else {
	    $nParents = 0;
    }

// get the parents of each spouse

    $tmp1 = null;
    $tmp2 = null;
	if($nSpouses>0) {
		$which = "spouse1ID, spouse2ID";
		for ($i=0;$i<$nSpouses;$i++) {
			$where = "childID = $spouseIDs[$i]";

			$sql = mysqli_query($link, "SELECT $which FROM family WHERE $where");

			if(!$sql) {
				$error = mysqli_error($link);
				returnWithError($error, $link);
			}

			if(mysqli_num_rows($sql)>0) {
                for ($j=0;$j<mysqli_num_rows($sql);$j++) {
                    $tmp = mysqli_fetch_assoc($sql);
                    $tmp1[$j][$i] = $tmp['spouse1ID'];
                    $tmp2[$j][$i] = $tmp['spouse2ID'];                                      // spouse1ID and spouse2ID are the parents of a spouse
                }
                $spouseParentIDs = array_merge($tmp1, $tmp2);                           // then merge into single array
 //               $spouseParentIDs = array_unique($spouseParentIDs);                      // remove duplicates (shouldn't be any though
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

	$which = "mainID, gender, namePrefix, givenName, middleName, surname, nameSuffix,";
	$which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) AS fullName";
	$where = "mainID=$personID";

	$sql = mysqli_query($link, "SELECT $which FROM main WHERE $where");

	if(!$sql) {
		$error = mysqli_error($link);
		returnWithError($error, $link);
	}

	$person = mysqli_fetch_assoc($sql);

    $tmp = getMedia("mainID=$personID", $link);
    $person = array_merge($person, array('media' => $tmp));

    $tmp = getAttributes("mainID=$personID", $link);
    $person = array_merge($person, array('attributes' => $tmp));

    if($tmp[0] != 'none') {
        $tmp = getEvents($tmp);
        $person = array_merge($person, array('dates' => $tmp));
    }

// ******************************************
// get full person data for spouses
// ******************************************

	if($nSpouses>0) {
 	    $which = "mainID, gender, surname,";
        $which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) AS fullName";

	  	$spouseList = implode(',', $spouseIDs);

		$sql = mysqli_query($link, "SELECT $which FROM main WHERE mainID IN ($spouseList)");

		if(!$sql) {
			$error = mysqli_error($link);
			returnWithError($error, $link);
		}

		if(mysqli_num_rows($sql)>0) {
			for ($i=0;$i<mysqli_num_rows($sql);$i++) {
				$spouses[$i] = mysqli_fetch_assoc($sql);

                $theID = $spouses[$i]['mainID'];
                $tmp = getAttributes("mainID=$theID", $link);
                $spouses[$i] = array_merge($spouses[$i], array('attributes' => $tmp));

                if($tmp[0] != 'none') {
                    $tmp = getEvents($tmp);
                    $spouses[$i] = array_merge($spouses[$i], array('dates' => $tmp));
			    }
			}
        }
	}
 //   $spouses = array('spouses' => $spouses);

// ******************************************
// get full person data for spouses parents
// ******************************************

	if($nSpouseParents>0) {
        $which = "mainID, gender, surname,";
        $which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName";

		for($i=0;$i<$nSpouses;$i++) {
            $spouseParentsList = implode(',', $spouseParentIDs[$i]);
            $sql = mysqli_query($link, "SELECT $which FROM main WHERE mainID IN ($spouseParentsList)");
            if(!$sql) {
                $error = mysqli_error($link);
                returnWithError($error, $link);
            }

            $mothers = null;
            $fathers = null;
            if(mysqli_num_rows($sql)>0) {
                for($j=0;$j<mysqli_num_rows($sql);$j++) {
                    $tmp = mysqli_fetch_assoc($sql);
                     if($tmp['gender'] == 'M') {
                        $fathers[$j] = $tmp;
                    } else {
                        $mothers[$j] = $tmp;
                    }
                }
            }
            $spouses[$i]['fathers'] = array_values($fathers);
            $spouses[$i]['mothers'] = array_values($mothers);
        }

        for($i=0;$i<$nSpouses;$i++) {
 			if(array_key_exists('fathers',$spouses[$i])) {
                $theID = $spouses[$i]['fathers'][$i]['mainID'];
                $tmp = getAttributes("mainID=$theID", $link);
//                $spouses[$i] = array_merge($spouses[$i]['fathers'], array('attributes' => $tmp));
print_r($spouses);
 return;
                if($tmp[0] != 'none') {
                    $tmp = getEvents($tmp);
                    $fathers[$i] = array_merge($fathers[$i], array('dates' => $tmp));
                }
                $spouses[$i] = array_merge($spouses[$i], array('fathers' => array_values($fathers)));
            }
			if(!array_key_exists('mothers',$spouses[$i])) {
                $theID = $mothers[$i]['mainID'];
                $tmp = getAttributes("mainID=$theID", $link);
                $mothers[$i] = array_merge($mothers[$i], array('attributes' => $tmp));

                if($tmp[0] != 'none') {
                    $tmp = getEvents($tmp);
                    $mothers[$i] = array_merge($mothers[$i], array('dates' => $tmp));
                }
                $spouses[$i] = array_merge($spouses[$i], array('mothers' => array_values($mothers)));
			}

 		}
	}
print_r($spouses);
return;

// **************************************************************
// get full person data for parents of current person
// **************************************************************

	if($nParents>0) {
	    $fathers = null;
        $mothers = null;

        $which = "mainID, gender, surname,";
        $which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName";

		$parentList = implode(',', $parentIDs);

		$sql = mysqli_query($link, "SELECT $which FROM main WHERE main.mainID IN ($parentList)");

		if(!$sql) {
			$error = mysqli_error($link);
			returnWithError($error, $link);
		}

        if(mysqli_num_rows($sql)>0) {
  		    for($i=0;$i<$nParents;$i++) {
              $tmp = mysqli_fetch_assoc($sql);
                if($tmp['gender'] == 'M') {
                    $fathers[$i] = $tmp;
                } else {
                    $mothers[$i] = $tmp;
                }
            }
        }
	}

// ******************************************
// get full person data for children
// ******************************************

	if($nChildren>0) {
        $which = "mainID, gender, surname,";
        $which = $which . "CONCAT_WS(' ',namePrefix, givenName, middleName, surname, nameSuffix) as fullName";

		$childrenList = implode(',', $childIDs);

		$sql = mysqli_query($link, "SELECT $which FROM main WHERE mainID IN ($childrenList)");

		if(!$sql) {
			$error = mysqli_error($link);
			returnWithError($error, $link);
		}

		if(mysqli_num_rows($sql)>0) {
			for ($i=0;$i<mysqli_num_rows($sql);$i++) {
				$children[$i] = mysqli_fetch_assoc($sql);
			}
		}
	}

	// ******************************************
	// put pieces together on current person
	// ******************************************

	$person = array_merge($person, array('spouses' => $spouses), array('children' => $children));
	$person = array_merge($person, array('fathers' => $fathers), array('mothers' => $mothers));

	// ******************************************
	// get attributes for main person
	// ******************************************

	$person = array_merge($person, array('attributes' => $response));
	$response = null;

	// return a response
print_r($person);
return;

$response['success'] = 'success'; 		//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
$response['person'] = $person;
$response['error'] = $error;
http_response_code(200);
echo ")]}',\n" . json_encode($response);	// )]}', is used to stop JSON attacks, angular strips it off for you.
mysqli_close($link);
return;

function getEvents($events) {
    $death = [];
    $annul = [];
    $divorce = [];
    for($i=0;$i<count($events);$i++) {
       if ($events[$i]['theType'] == 'ANUL') {
             $filtered[$i]['start'] = strtotime($events[$i]['date1']);
             $filtered[$i]['spouseID'] = $events[$i]['spouseID'];
             $filtered[$i]['type'] = "annulment";
             if(count($annul)==0) {
                 $annul[0] = $i;
             } else {
                 $annul = array_push($annul, $i);
             }
       }
       if ($events[$i]['theType'] == 'BIR') {
             $filtered[$i]['start'] = strtotime($events[$i]['date1']);
             $filtered[$i]['type'] = "birth";
      }
       if ($events[$i]['theType'] == 'COMM') {
             $filtered[$i]['start'] = strtotime($events[$i]['date1']);
             $filtered[$i]['spouseID'] = $events[$i]['spouseID'];
             $filtered[$i]['type'] = "common";
       }
       if ($events[$i]['theType'] == 'DEA') {
            $filtered[$i]['end'] = strtotime($events[$i]['date1']);
            if(count($death)==0) {
                 $death[0] = $i;
            } else {
                 $death = array_push($death, $i);
            }
       }
       if ($events[$i]['theType'] == 'DIV') {
            $filtered[$i]['start'] = strtotime($events[$i]['date1']);
            $filtered[$i]['spouseID'] = $events[$i]['spouseID'];
            $filtered[$i]['type'] = "divorce";
            if(count($divorce)==0) {
                $divorce[0] = $i;
            } else {
                $divorce = array_push($divorce, $i);
            }
       }
       if ($events[$i]['theType'] == 'MARR') {
            $filtered[$i]['start'] = strtotime($events[$i]['date1']);
            $filtered[$i]['spouseID'] = $events[$i]['spouseID'];
            $filtered[$i]['type'] = "marriage";
        }
    }

    return array_values($filtered);
}

function getAttributes($where, $link) {
	$which = "spouseID,fatherID,motherID,mainType,theType,dateModifier,date1,date2,phrase,";
	$which = $which . "city,county,state,country,details,theFile,id";

	$sql = mysqli_query($link, "SELECT $which FROM events WHERE $where ORDER BY theType");

	if(!$sql) {
		$error = "Error: " . mysqli_error($link);
		returnWithError($error, $link);
	}

	if(mysqli_num_rows($sql)>0) {
        for ($i=0;$i<mysqli_num_rows($sql);$i++) {
            $tmp[$i] = mysqli_fetch_assoc($sql);
        }
    } else {
        $tmp[0] = 'none';
    }
    return $tmp;
}

function getMedia($where, $link) {
	$which = "theType,mainType,theContent,theFile,theTitle,longTitle";

	$sql = mysqli_query($link, "SELECT $which FROM media WHERE $where");

	if(!$sql) {
		$error = "Error: " . mysqli_error($link);
		returnWithError($error, $link);
	}

	if(mysqli_num_rows($sql)>0) {
        for ($i=0;$i<mysqli_num_rows($sql);$i++) {
            $tmp[$i] = mysqli_fetch_assoc($sql);
        }
     } else {
        $tmp[0] = 'none';
     }
     return $tmp;
}

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