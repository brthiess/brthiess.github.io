<?php 

include "simple_html_dom.php";


function getUrl($episodeNumber){
	sleep(1);
	return "https://www.theskepticsguide.org/podcasts/episode-" . $episodeNumber;
}


function getHtmlFromUrl($url){
	$html =  file_get_contents($url, false, stream_context_create(array('ssl' => array('verify_peer' => false, 'verify_peer_name' => false))));
	return $html;
}

function getItems($html){
	$dom = new simple_html_dom();
	$dom->load($html);
	$items = [];
	$number = 1;
	foreach($dom->find('.science-fiction__item') as $scienceFictionItem){
		$isFiction = stripos($scienceFictionItem->find(".quiz__answer",0)->plaintext, "Science") !== false ? false : true;
		$text = $scienceFictionItem->find("p", 0)->plaintext;
		$title = $scienceFictionItem->find(".science-fiction__item-title", 0)->plaintext;
		$items[] = array (
			'isFiction' => $isFiction,
			'text' => $text,
			'title' => $title,
			'number' => $number
		);
		$number++;
	}
	return $items;
}

function getPublishDate($html){
	$dom = new simple_html_dom();
	$dom->load($html);
	$date = $dom->find('.podcast__pub-date',0)->plaintext;
	return $date;
}

$episodes = array();
for($episodeNumber = 745; $episodeNumber > 100; $episodeNumber--){
	try {
		echo "\nGetting episode number: " . $episodeNumber;
		$url = getUrl($episodeNumber);
		$html = getHtmlFromUrl($url);

		
		$items = getItems($html);
		$date = getPublishDate($html);

		$episodes[] = array (
			'items' => $items,
			'episodeNumber' => $episodeNumber,
			'date' => $date
		);
	}
	catch(Exception $e){
		echo $e->getMessage();
	}
}
file_put_contents("test-all.json", json_encode($episodes));

