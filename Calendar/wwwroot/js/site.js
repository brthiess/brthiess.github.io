function beginQuiz() {
	setupQuizUI();
	getQuestions(true).then(function (data) {
		console.log(data);
		populateQuizHtml(data);
	}).catch(function (error) {
		console.log(error);
	});
}

function setupQuizUI() {
	$("[data-change-when-quiz-active]").addClass("quiz-active");
}
function getQuestions(createNewQuiz) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve(getFakeData());
		}, 1000);
	});
}

function populateQuizHtml(data) {
	var $quiz = $("[data-quiz-template]").clone();
	var quizHtml = populateQuizTemplates($quiz, data);
	$(quizHtml).appendTo($("[data-quiz-container]"));
}

function populateQuizTemplates(template, data) {
	var quizHtml = $(template).clone().html("");
	for (var i = 0; i < data.questions.length; i++) {
		var quizSection = populateQuizSection($(template).find("[data-quiz-section]"), data.questions[i], data.activeQuestionNumber);
		$(quizSection).appendTo($(quizHtml));
	}
	return quizHtml;
}

function populateQuizSection(sectionTemplate, questionData, activeQuestionNumber) {
	var quizSection = $(sectionTemplate).clone().html("");

	var quizQuestion = populateQuizQuestion($(sectionTemplate).find("[data-quiz-question-container]"), questionData.question);
	$(quizQuestion).appendTo($(quizSection));	

	var quizAnswers = populateQuizQuestionAnswers($(sectionTemplate).find("[data-quiz-answers]"), questionData.answers);
	$(quizAnswers).appendTo($(quizSection));	

	if (activeQuestionNumber < questionData.number) {
		$(quizSection).addClass("next");
	}
	else if (activeQuestionNumber > questionData.number) {
		$(quizSection).addClass("previous");
	}
	else {
		$(quizSection).addClass("activeQuestion");
	}

	$(quizSection).attr("data-quiz-question-number", questionData.number);

	return quizSection;
}

function populateQuizQuestionAnswers(answersTemplate, answersData) {
	var answersHtml = $(answersTemplate).clone().html("");
	for (var i = 0; i < answersData.length; i++) {
		var answerHtml = populateAnswer($(answersTemplate).find("[data-quiz-answer]"), answersData[i]);
		$(answerHtml).appendTo($(answersHtml));
	}
	return answersHtml;
}

function populateQuizQuestion(questionTemplate, questionText) {
	var questionHtml = questionTemplate.clone();
	$(questionHtml).find("[data-quiz-question]").text(questionText);
	return questionHtml;
}

function populateAnswer(answerTemplate, answer) {
	var answerHtml = answerTemplate.clone();
	$(answerHtml).text(answer.text);
	return answerHtml;
}

function goToNextQuestion() {
	nextQuestionNumber = getCurrentQuestionNumber() + 1;
	goToQuestionNumber(nextQuestionNumber);
}

function goToPreviousQuestion() {
	previousQuestionNumber = getCurrentQuestionNumber() + -1
	goToQuestionNumber(previousQuestionNumber);
}

function getCurrentQuestionNumber() {
	return parseInt($(".activeQuestion").attr("data-quiz-question-number"));
}

function goToQuestionNumber(questionNumber) {
	var currentQuestionNumber = getCurrentQuestionNumber();

	if (questionNumber > currentQuestionNumber) {
		$("[data-quiz-question-number=" + currentQuestionNumber + "]").addClass("previous");
		$("[data-quiz-question-number=" + currentQuestionNumber + "]").removeClass("activeQuestion");
	}
	else if (questionNumber < currentQuestionNumber) {
		$("[data-quiz-question-number=" + currentQuestionNumber + "]").addClass("next");
		$("[data-quiz-question-number=" + currentQuestionNumber + "]").removeClass("activeQuestion");
	}

	$("[data-quiz-question-number=" + questionNumber + "]").addClass("activeQuestion");
	$("[data-quiz-question-number=" + questionNumber + "]").removeClass("previous");
	$("[data-quiz-question-number=" + questionNumber + "]").removeClass("next");

	enableAndDisableNavigationButtons();

	console.log(questionNumber);
}

function enableAndDisableNavigationButtons() {
	var currentQuestionNumber = getCurrentQuestionNumber();
	if (!questionNumberExists(currentQuestionNumber + 1)) {
		$(".quiz-footer-navigation-button.next").addClass("disabled");
	}
	if (questionNumberExists(currentQuestionNumber + 1)) {
		$(".quiz-footer-navigation-button.next").removeClass("disabled");
	}
	if (!questionNumberExists(currentQuestionNumber - 1)) {
		$(".quiz-footer-navigation-button.previous").addClass("disabled");
	}
	if (questionNumberExists(currentQuestionNumber - 1)) {
		$(".quiz-footer-navigation-button.previous").removeClass("disabled");
	}
}

function questionNumberExists(questionNumber) {
	return $("[data-quiz-question-number=" + questionNumber + "]").length > 0;
}

function getFakeData() {
	var fakeData = {
		activeQuestionNumber: 2,
		questions: [
			{
				type: "normal",
				answers: [
					{
						text: "answer 1"
					},
					{
						text: "answer 2"
					},
					{
						text: "answer 3",
						correct: true
					}
				],
				question: "Pick the fiction",
				number: 1,
				active: false,
				answered: false
			},
			{
				type: "normal",
				answers: [
					{
						text: "answer 2234"
					},
					{
						text: "234234234 2"
					},
					{
						text: "answer 3",
						correct: true
					}
				],
				question: "Pick the fiction",
				number: 2,
				active: true,
				answered: false
			},
			{
				type: "normal",
				answers: [
					{
						text: "answer 1"
					},
					{
						text: "answer 2"
					},
					{
						text: "answer 3",
						correct: true
					}
				],
				question: "Pick the fiction",
				number: 3,
				active: false,
				answered: false
			}
		]
	};
	return fakeData;
}