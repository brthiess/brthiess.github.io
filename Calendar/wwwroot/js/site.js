var totalNumberOfQuestions = 0;
var quizResultsData = {};

function beginQuiz() {
	setupQuizUI();
	getQuestions(true).then(function (data) {
		populateQuizHtml(data);
		totalNumberOfQuestions = data.sections.length;
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
	var quizTemplate = new Vue({
		el: '#quiz-template',
		data: data
	});
}

function goToNextQuestion() {
	nextQuestionNumber = getCurrentQuestionNumber() + 1;
	goToQuestionNumber(nextQuestionNumber);
}

function goToPreviousQuestion() {
	previousQuestionNumber = getCurrentQuestionNumber() + -1;
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
		$(".navigation-button.next-button").addClass("disabled");
	}
	if (questionNumberExists(currentQuestionNumber + 1)) {
		$(".navigation-button.next-button").removeClass("disabled");
	}
	if (!questionNumberExists(currentQuestionNumber - 1)) {
		$(".navigation-button.previous-button").addClass("disabled");
	}
	if (questionNumberExists(currentQuestionNumber - 1)) {
		$(".navigation-button.previous-button").removeClass("disabled");
	}
}

function questionNumberExists(questionNumber) {
	return $("[data-quiz-question-number=" + questionNumber + "]").length > 0;
}

$("body").on("click", "[data-quiz-answer]", function () {
	updateUIAfterAnswering(this);
	updateQuizResults(this);
});

function updateUIAfterAnswering(element) {
	var quizSection = $(element).closest("[data-quiz-section]");
	if ($(quizSection).hasClass("answered")) {
		return;
	}
	$(quizSection).find("[data-change-when-answered]").addClass("answered");
	$(quizSection).addClass("answered");
	if ($(element).attr("data-answer-correct") === "false") {
		$(element).addClass("incorrect");
	}
}

function updateQuizResults(element) {
	
}





function getFakeData() {
	var fakeData = {
		activeQuestionNumber: 1,
		sections: [
			{
				type: "normal",
				answers: [
					{
						text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet tortor eu justo sodales vehicula. Nulla auctor tempus arcu, a ultricies nulla commodo non. Phasellus ac lacus ut diam finibus interdum.",
						number: 1,
						correct: false,
						rogues: [
							{
								name: "Bob Novella",
								image: "test3.jpeg"
							},
							{
								name: "Steve Novella",
								image: "test4.jpeg"
							},
							{
								name: "Jay Novella",
								image: "test5.jpeg"
							}
						]
					},
					{
						text: "Vestibulum vitae hendrerit massa. Nam pretium nibh ac ex tempor, eu posuere ex mattis. Cras libero diam, congue quis venenatis vel, gravida nec purus.",
						number: 2,
						correct: false
					},
					{
						text: "Morbi eget tincidunt dolor. Nam egestas, leo id posuere laoreet, leo lectus auctor massa, vel convallis turpis enim at lectus.",
						number: 3,
						correct: true,
						rogues: [
							{
								name: "Evan Bernstein",
								image: "test3.jpeg"
							},
							{
								name: "Cara Santa Maria",
								image: "test3.jpeg"
							}
						]
					}
				],
				question: "Pick the fiction",
				number: 1,
				active: true,
				answered: false
			},
			{
				type: "normal",
				answers: [
					{
						text: "Donec varius diam dignissim, placerat nisl at, imperdiet turpis. Cras eu pellentesque dolor, ut fermentum nunc.",
						number: 1,
						correct: false
					},
					{
						text: "Nunc ex metus, lacinia facilisis lacinia nec, finibus id ante.",
						number: 2,
						correct: false,
						rogues: [
							{
								name: "Bob Novella",
								image: "test3.jpeg"
							},
							{
								name: "Steve Novella",
								image: "test4.jpeg"
							},
							{
								name: "Jay Novella",
								image: "test5.jpeg"
							},
							{
								name: "Evan Bernstein",
								image: "test3.jpeg"
							},
							{
								name: "Cara Santa Maria",
								image: "test3.jpeg"
							}
						]
					},
					{
						text: "Curabitur vitae velit quis dolor tempor lobortis in eu nunc. Nullam aliquam, libero rutrum convallis lacinia, elit tortor tincidunt dolor, venenatis cursus elit elit ut neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse potenti. ",
						correct: true,
						number: 3
					}
				],
				question: "Pick the fiction",
				number: 2,
				active: false,
				answered: false
			},
			{
				type: "normal",
				answers: [
					{
						text: "Donec elementum nibh ac pharetra fermentum. Nunc sollicitudin, arcu nec accumsan pellentesque, tellus nisl pharetra nunc, id pharetra leo nulla nec lorem.",
						number: 1,
						correct: false,
						rogues: [
							{
								name: "Bob Novella",
								image: "test3.jpeg"
							}
						]
					},
					{
						text: "Donec elementum nibh ac pharetra fermentum. Nunc sollicitudin, arcu nec accumsan pellentesque, tellus nisl pharetra nunc, id pharetra leo nulla nec lorem.",
						correct: true,
						number: 2,
						rogues: [
							{
								name: "Evan Bernstein",
								image: "test3.jpeg"
							},
							{
								name: "Cara Santa Maria",
								image: "test3.jpeg"
							}
						]
					},
					{
						text: "In varius tellus sed ullamcorper sagittis. Ut a eleifend diam. In eget commodo neque. Donec ac turpis sit amet sapien rhoncus cursus et finibus urna.",
						number: 3,
						correct: false,
						rogues: [
							{
								name: "Jay Novella",
								image: "test5.jpeg"
							}
						]
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