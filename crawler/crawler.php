<?php 

include "simple_html_dom.php";


function getUrl($episodeNumber){
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
	foreach($dom->find('.science-fiction__item') as $scienceFictionItem){
		$isFiction = stripos($scienceFictionItem->find(".quiz__answer",0)->plaintext, "Science") !== false ? false : true;
		$text = $scienceFictionItem->find("p", 0)->plaintext;
		$title = $scienceFictionItem->find(".science-fiction__item-title", 0)->plaintext;
		$items[] = array (
			'isFiction' => $isFiction,
			'text' => $text,
			'title' => $title
		);
	}
	return $items;
}

$episodes = array();
for($episodeNumber = 750; $episodeNumber > 100; $episodeNumber--){
	$url = getUrl($episodeNumber);
	$html = getHtmlFromUrl($url);

	
	$items = getItems($html);
	$episodes[] = array (
		'items' => $items,
		'episodeNumber' => $episodeNumber
	);
}

