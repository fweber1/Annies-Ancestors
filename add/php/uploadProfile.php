<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

try {

	// following is checking for malware. see: http://php.net/manual/en/features.file-upload.php

	try {

		// Undefined | Multiple Files | $_FILES Corruption Attack
		// If this request falls under any of them, treat it invalid.
		if (
				!isset($_FILES['file']['error']) ||
				is_array($_FILES['file']['error'])
				) {
					throw new RuntimeException('Invalid parameters.');
				}

				// Check $_FILES['upfile']['error'] value.
				switch ($_FILES['file']['error']) {
					case UPLOAD_ERR_OK:
						break;
					case UPLOAD_ERR_NO_FILE:
						throw new RuntimeException('No file sent.');
					case UPLOAD_ERR_INI_SIZE:
					case UPLOAD_ERR_FORM_SIZE:
						throw new RuntimeException('Exceeded filesize limit.');
					default:
						throw new RuntimeException('Unknown errors.');
				}

				// You should also check filesize here.
				if ($_FILES['file']['size'] > 1000000) {
					throw new RuntimeException('Exceeded filesize limit.');
				}

				// DO NOT TRUST $_FILES['file']['mime'] VALUE !!
				// Check MIME Type by yourself.
				$finfo = new finfo(FILEINFO_MIME_TYPE);
				if (false === $ext = array_search(
						$finfo->file($_FILES['file']['tmp_name']),
						array(
								'jpg' => 'image/jpg',
								'jpeg' => 'image/jpeg',
								'gif' => 'image/gif',
								'png' => 'text/plain',
						),
						true
						)) {
							throw new RuntimeException('Invalid file format.');
						}

						$rEFileTypes = "/^\.(jpg|jpeg|gif|png){1}$/i";
						$dir_base = dirname(__FILE__) . '/../../sheet/profilePhotos/';        // dirname(__FILE__) is the directory containing the script. This way don't need to know root of webspace
						
						$isFile = is_uploaded_file($_FILES['file']['tmp_name']);
						if ($isFile) {
							$safe_filename = preg_replace(array("/\s+/", "/[^-\.\w]+/"), array("_", ""), trim($_FILES['file']['name']));
							if (preg_match($rEFileTypes, strrchr($safe_filename, '.'))) {
								$isMove = move_uploaded_file($_FILES['file']['tmp_name'],  $dir_base . $safe_filename);
							}
						}
						
	} catch (RuntimeException $e) {
		echo $e->getMessage();
	}
} catch (RuntimeException $e) {
	echo $e->getMessage();
}
?>  