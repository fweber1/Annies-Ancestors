<?php

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
								'png' => 'image/png',
								'mp3' => 'audio/mpeg',
								'mp4' => 'video/mpeg'
						),
						true
						)) {
							throw new RuntimeException('Invalid file format.');
						}

	} catch (RuntimeException $e) {
		echo $e->getMessage();
	}
} catch (RuntimeException $e) {
	echo $e->getMessage();
}

?>  