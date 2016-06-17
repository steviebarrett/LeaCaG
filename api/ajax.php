<?php

$action = $_GET["action"];

switch ($action) {
	
	case "getEnglish":
		$query = $_GET["q"];
		echo getEnglish($query);
		break; 
}

function getEnglish($q) {
	$englishIndex = file_get_contents("../../lexicopia/gd/english-index.json");
	$results = array();
	$json = json_decode($englishIndex, true);
	foreach ($json["english_index"] as $item) {
		if (strtolower(substr($item["en"], 0, strlen($q))) == strtolower($q)) {
			$results[] = $item;
		}
	}
	return json_encode(array("results"=>$results));
}
