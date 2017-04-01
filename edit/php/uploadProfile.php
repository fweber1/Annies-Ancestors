<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

include dirname(__FILE__) . "/../../php/checkFileUpload.php";

$rEFileTypes = "/^\.(jpg|jpeg|gif|png){1}$/i";
$dir_base = dirname(__FILE__) . '/../../sheet/profilePhotos/';        // dirname(__FILE__) is the directory containing the script. This way don't need to know root of webspace

$isFile = is_uploaded_file($_FILES['file']['tmp_name']);
if ($isFile) {
	$safe_filename = preg_replace(array("/\s+/", "/[^-\.\w]+/"), array("_", ""), trim($_FILES['file']['name']));
	if (preg_match($rEFileTypes, strrchr($safe_filename, '.'))) {
		$isMove = move_uploaded_file($_FILES['file']['tmp_name'],  $dir_base . $safe_filename);
	}
}

?>  