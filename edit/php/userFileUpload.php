<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

include dirname(__FILE__) . "/../../php/checkFileUpload.php";

	$tmp = explode('.', $_FILES['file']['name']);
	$ownerID = $tmp[0];
	$ext = $tmp[1];
	
	$safe_filename = $ownerID . 'F' . time() . '.' . $ext;

	$dir_base = dirname(__FILE__) . '/../../files/';        // dirname(__FILE__) is the directory containing the script. This way don't need to know root of webspace						
	$isFile = is_uploaded_file($_FILES['file']['tmp_name']);						
	if ($isFile) {
			$isMove = move_uploaded_file($_FILES['file']['tmp_name'],  $dir_base . $safe_filename);
	}
	
	// add malware prevention to images, google search
	
	// return a response
	
	$response = $safe_filename . '.' . $ext;
	http_response_code(200);					//See https://docs.angularjs.org/api/ng/service/$http#json-vulnerability-protection
	echo ")]}',\n" . json_encode($response);	// )]}', is used to stop JSON attacks, angular strips it off for you.
	return;
	
?>  