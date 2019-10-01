var totalNumberOfQuestions = 0;
function beginQuiz() {
	setupQuizUI();
	getQuestions(true).then(function (data) {
		console.log(data);
		populateQuizHtml(data);
		totalNumberOfQuestions = data.questions.length;
		goToQuestionNumber(data.activeQuestionNumber);
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
	var quizSection = $(sectionTemplate).clone();

	var quizQuestion = populateQuizQuestion($(sectionTemplate).find("[data-quiz-question-container]"), questionData.question);
	$(quizSection).find("[data-quiz-question-container]").replaceWith($(quizQuestion));	

	var quizAnswers = populateQuizQuestionAnswers($(sectionTemplate).find("[data-quiz-answers]"), questionData.answers);
	$(quizSection).find("[data-quiz-answers]").replaceWith($(quizAnswers));	

	var quizNumber = populateQuizQuestionNumber($(sectionTemplate).find("[data-quiz-question-number-text]"), questionData.number);
	$(quizSection).find("[data-quiz-question-number-text]").replaceWith($(quizNumber));	

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

function populateQuizQuestionNumber(numberTemplate, questionNumber) {
	var numberHtml = $(numberTemplate).clone().html("");

	$(numberHtml).text(questionNumber);
	return numberHtml;
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

	$("[data-quiz-current-question-number]").text(questionNumber);

	enableAndDisableNavigationButtons();

	setProgressBar(questionNumber);

	console.log(questionNumber);
}

function setProgressBar(questionNumber) {
	var percentageProgress = getPercentageProgress(questionNumber);
	$("[data-quiz-percentage-progress]").css("left", "calc(" + percentageProgress * 100 + "% - 21px)");
}

function getPercentageProgress(questionNumber) {
	return (questionNumber - 1) / (totalNumberOfQuestions - 1);
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
						text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet tortor eu justo sodales vehicula. Nulla auctor tempus arcu, a ultricies nulla commodo non. Phasellus ac lacus ut diam finibus interdum."
					},
					{
						text: "Vestibulum vitae hendrerit massa. Nam pretium nibh ac ex tempor, eu posuere ex mattis. Cras libero diam, congue quis venenatis vel, gravida nec purus."
					},
					{
						text: "Morbi eget tincidunt dolor. Nam egestas, leo id posuere laoreet, leo lectus auctor massa, vel convallis turpis enim at lectus.",
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
						text: "Donec varius diam dignissim, placerat nisl at, imperdiet turpis. Cras eu pellentesque dolor, ut fermentum nunc."
					},
					{
						text: "Nunc ex metus, lacinia facilisis lacinia nec, finibus id ante."
					},
					{
						text: "Curabitur vitae velit quis dolor tempor lobortis in eu nunc. Nullam aliquam, libero rutrum convallis lacinia, elit tortor tincidunt dolor, venenatis cursus elit elit ut neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse potenti. ",
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
						text: "Donec elementum nibh ac pharetra fermentum. Nunc sollicitudin, arcu nec accumsan pellentesque, tellus nisl pharetra nunc, id pharetra leo nulla nec lorem."
					},
					{
						text: "Donec elementum nibh ac pharetra fermentum. Nunc sollicitudin, arcu nec accumsan pellentesque, tellus nisl pharetra nunc, id pharetra leo nulla nec lorem."
					},
					{
						text: "In varius tellus sed ullamcorper sagittis. Ut a eleifend diam. In eget commodo neque. Donec ac turpis sit amet sapien rhoncus cursus et finibus urna.",
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