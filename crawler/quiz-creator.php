<?php 
$json = file_get_contents("test-all.json");
$questions = json_decode($json, TRUE);

$random_number_array = range(0, count($questions) + 1);
shuffle($random_number_array);

$questionsPerQuiz = 7;
$currentQuestionNumber = 1;
$quizNumber = 1;
$quizSectionArray = [];
for($i = 0; $i < count($questions); $i++){
	$quizSectionArray[$currentQuestionNumber] = createSectionArray($questions[$random_number_array[$i]], $currentQuestionNumber);
	if ($currentQuestionNumber == $questionsPerQuiz){
		$quizQuestionArray["activeQuestionNumber"] =  1;
		$quizQuestionArray["active"] =  true;
		$quizQuestionArray["onFirstQuestion"] =  true;
		$quizQuestionArray["onLastQuestion"] =  false;
		$quizQuestionArray["quizProgressPercentage"] =  0;
		$quizQuestionArray["finished"] =  false;
		$quizQuestionArray["totalNumberOfQuestions"] =  $questionsPerQuiz;
		$quizQuestionArray["results"] = [];
		$quizQuestionArray["results"]["placing"] = 1;
		$quizQuestionArray["results"]["percentage"] = 100;
		$quizQuestionArray["results"]["quizRankings"] = [];
		$quizQuestionArray["sections"] = $quizSectionArray;
		echo "\nQuiz Number: " . $quizNumber;
		echo "\nFile Name: " . "quiz-" . $quizNumber . ".json";
		print_r($quizQuestionArray);
		pause();
		file_put_contents("quiz-" . $quizNumber . ".json", json_encode($quizQuestionArray));
		$quizQuestionArray = [];
		$quizSectionArray = [];
		$currentQuestionNumber = 1;
		$quizNumber++;
	}
	$currentQuestionNumber++;
}

function createSectionArray($questions, $currentQuestionNumber){
	$questionsArray =  array("type" => isset($questions["type"]) ? $questions["type"] : "normal",
				 "date" => date("F j, Y", strtotime($questions["date"])),
				 "episodeNumber" => $questions["episodeNumber"],
				 "answers" => createAnswersArray($questions["items"]),
				 "question" => isset($questions["question"]) ? $questions["question"] : "Pick the fiction",
				 "number" => $currentQuestionNumber,
				 "active" => $currentQuestionNumber == 1,
				 "answered" => false,
				 "answeredCorrectly" => false
	);
	return $questionsArray;
}

function createAnswersArray($answers){
	$answersArray = [];
	for($i = 0; $i < count($answers); $i++){
		$answersArray[$answers[$i]["number"]] = array(
			"number" => $answers[$i]["number"],
			"text" => $answers[$i]["text"],
			"correct" => $answers[$i]["isFiction"] == 1,
			"picked" => false
		);
	}
	return $answersArray;
}

function pause(){
	echo "Are you sure you want to do this?  Type 'yes' to continue: ";
	$handle = fopen ("php://stdin","r");
	$line = fgets($handle);
	if(trim($line) != 'yes'){
		echo "ABORTING!\n";
		exit;
	}
	fclose($handle);
	echo "\n"; 
	echo "Thank you, continuing...\n";
}