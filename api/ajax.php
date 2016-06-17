<?php

$action = $_GET["action"];

switch ($action) {
	
	case "getEnglish":
		$query = $_GET["q"];
		echo getEnglish($query);
		break;

	case "getGaelic":
		$query = $_GET["q"];
		echo getGaelic($query);
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

function getGaelic($q) {
	$gaelicIndex = file_get_contents("../../lexicopia/gd/target-index.json");
	$results = array();
	$json = json_decode($gaelicIndex, true);
	foreach ($json["gaelic_index"] as $item) {
		if (strtolower(substr($item["word"], 0, strlen($q))) == strtolower($q)) {
			$results[] = $item;
		}
	}
	return json_encode(array("results"=>$results));
}
