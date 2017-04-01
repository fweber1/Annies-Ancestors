<?php

$host = gethostname();

if($host=='Freds-MacBook-Pro.local') {
	$host = 'localhost';
	$username="root";
	$password="mcwskw1";
	$db_name="db1098262_ancestors";	
} else {
	$host = 'lin-mysql24.hostmanagement.net';
	$username="u1098262_fweber"; 
	$password="mcwskw1KathyHolman"; 
	$db_name="db1098262_ancestors";
}
?>