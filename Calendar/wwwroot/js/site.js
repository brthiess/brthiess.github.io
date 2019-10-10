var totalNumberOfQuestions = 0;
var quizTemplate;
var quizDataContainer = {
	quizData: {
		activeQuestionNumber: 1,
		active: false,
		onFirstQuestion: true,
		onLastQuestion: false,
		sections: {}
	}
};

function beginQuiz() {
	setupQuizUI();
	initializeQuiz();
	getQuestions(true).then(function (data) {
		quizDataContainer.quizData = data;
		quizTemplate.quizData = quizDataContainer.quizData;
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

function initializeQuiz() {
	quizTemplate = new Vue({
		el: '#quiz-template',
		data: quizDataContainer,
		methods: {
			answerQuestion: function (questionNumber, answerNumber) {
				if (quizDataContainer.quizData.sections[questionNumber].answered === true) {
					return;
				}
				quizDataContainer.quizData.sections[questionNumber].answered = true;
				quizDataContainer.quizData.sections[questionNumber].answers[answerNumber].picked = true;
				if (quizDataContainer.quizData.sections[questionNumber].answers[answerNumber].correct) {
					quizDataContainer.quizData.sections[questionNumber].answeredCorrectly = true;
				}
				else {
					quizDataContainer.quizData.sections[questionNumber].answeredCorrectly = false;
				}

				console.log(questionNumber);
				console.log(answerNumber);
			}
		},
		computed: {
			nextQuestionIsAvailable: function () {
				return !onLastQuestion() &&
					Object.keys(quizDataContainer.quizData.sections).length > 0 &&
					typeof quizDataContainer.quizData.sections[quizDataContainer.quizData.activeQuestionNumber] !== 'undefined' &&
					quizDataContainer.quizData.sections[quizDataContainer.quizData.activeQuestionNumber].answered;
			}
		}
	});
}

function onLastQuestion() {
	if (Object.keys(quizDataContainer.quizData.sections).length === quizDataContainer.quizData.activeQuestionNumber) {
		return true;
	}
	return false;
	
}

function goToNextQuestion() {
	nextQuestionNumber = quizDataContainer.quizData.activeQuestionNumber + 1;
	goToQuestionNumber(nextQuestionNumber);
}

function goToPreviousQuestion() {
	previousQuestionNumber = quizDataContainer.quizData.activeQuestionNumber - 1;
	goToQuestionNumber(previousQuestionNumber);
}

function goToQuestionNumber(questionNumber) {
	quizDataContainer.quizData.activeQuestionNumber = questionNumber;

	Object.keys(quizDataContainer.quizData.sections).forEach(function (dataQuestionNumber) {
		quizDataContainer.quizData.sections[dataQuestionNumber].isPreceding = (questionNumber > quizDataContainer.quizData.sections[dataQuestionNumber].number ? true : false);
		quizDataContainer.quizData.sections[dataQuestionNumber].isUpcoming = (questionNumber < quizDataContainer.quizData.sections[dataQuestionNumber].number ? true : false);
		quizDataContainer.quizData.sections[dataQuestionNumber].active = (questionNumber === quizDataContainer.quizData.sections[dataQuestionNumber].number ? true : false);
	});
	
	enableAndDisableNavigationButtons();
	quizDataContainer.quizData.quizProgressPercentage = getQuizProgressPercentage();

	console.log(questionNumber);
}

function getQuizProgressPercentage() {
	var numberOfQuestions = Object.keys(quizDataContainer.quizData.sections).length;
	if (numberOfQuestions > 0) {
		return (quizDataContainer.quizData.activeQuestionNumber - 1) / (numberOfQuestions) * 100;
	}
	else {
		return 0;
	}
}

function setProgressBar(questionNumber) {
	var percentageProgress = getPercentageProgress(questionNumber);
	$("[data-quiz-percentage-progress]").css("left", "calc(" + percentageProgress * 100 + "% - 21px)");
}

function getPercentageProgress(questionNumber) {
	return (questionNumber - 1) / (totalNumberOfQuestions - 1);
}


function enableAndDisableNavigationButtons() {
	if (quizDataContainer.quizData.activeQuestionNumber === quizDataContainer.quizData.sections.length) {
		quizDataContainer.quizData.onLastQuestion = true;
		quizDataContainer.quizData.onFirstQuestion = false;
	}
	else if (quizDataContainer.quizData.activeQuestionNumber === 1) {
		quizDataContainer.quizData.onLastQuestion = false;
		quizDataContainer.quizData.onFirstQuestion = true;
	}
	else {
		quizDataContainer.quizData.onLastQuestion = false;
		quizDataContainer.quizData.onFirstQuestion = false;
	}
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
		active: true,
		onFirstQuestion: true,
		onLastQuestion: false,
		quizProgressPercentage: 0,
		sections: {
			1: {
				type: "normal",
				sectionType: "question",
				date: "August 24, 2019",
				episodeNumber: 737,
				answers: {
					1: {
						text: "Jose Delgato, a Yale physiologist, invented a 'stimoceiver', a readio controlled implant he placed in the brains of animals and ultimately people to remotely control their emotions and physical movements.",
						number: 1,
						correct: false,
						picked: false,
						rogueAnswers: [
							{
								name: "Bob Novella",
								image: "/images/test3.jpeg"
							},
							{
								name: "Steve Novella",
								image: "/images/test4.jpeg"
							},
							{
								name: "Jay Novella",
								image: "/images/test5.jpeg"
							}
						]
					},
					2: {
						text: "Soviet biologist, Ilya Ivanov, sucessfully created a human chimp hybrid, although the infant only lived 3 weeks.",
						number: 2,
						correct: true,
						picked: false
					},
					3: {
						text: "Russian physician Sergei Bugenenko, kept a decapitated dogs head alive and awake with extra corporeal blood perfusion.",
						number: 3,
						correct: false,
						picked: false,
						rogueAnswers: [
							{
								name: "Evan Bernstein",
								image: "/images/test3.jpeg"
							},
							{
								name: "Cara Santa Maria",
								image: "/images/test3.jpeg"
							}
						]
					}
				},
				question: "Pick the fiction",
				number: 1,
				active: true,
				answered: false,
				answeredCorrectly: false
			},
			2: {
				type: "normal",
				sectionType: "question",
				date: "September 14, 2019",
				episodeNumber: 740,
				answers: {
					1: {
						text: "Donec varius diam dignissim, placerat nisl at, imperdiet turpis. Cras eu pellentesque dolor, ut fermentum nunc.",
						number: 1,
						correct: false
					},
					2: {
						text: "Nunc ex metus, lacinia facilisis lacinia nec, finibus id ante.",
						number: 2,
						correct: false,
						rogueAnswers: [
							{
								name: "Bob Novella",
								image: "/images/test3.jpeg"
							},
							{
								name: "Steve Novella",
								image: "/images/test4.jpeg"
							},
							{
								name: "Jay Novella",
								image: "/images/test5.jpeg"
							},
							{
								name: "Evan Bernstein",
								image: "/images/test3.jpeg"
							},
							{
								name: "Cara Santa Maria",
								image: "/images/test3.jpeg"
							}
						]
					},
					3: {
						text: "Curabitur vitae velit quis dolor tempor lobortis in eu nunc. Nullam aliquam, libero rutrum convallis lacinia, elit tortor tincidunt dolor, venenatis cursus elit elit ut neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse potenti. ",
						correct: true,
						number: 3
					}
				},
				question: "Pick the fiction",
				number: 2,
				active: false,
				answered: false,
				isUpcoming: true,
				answeredCorrectly: false
			},
			3: {
				type: "normal",
				sectionType: "question",
				date: "September 21, 2019",
				episodeNumber: 741,
				answers: {
					1: {
						text: "Donec elementum nibh ac pharetra fermentum. Nunc sollicitudin, arcu nec accumsan pellentesque, tellus nisl pharetra nunc, id pharetra leo nulla nec lorem.",
						number: 1,
						correct: false,
						rogueAnswers: [
							{
								name: "Bob Novella",
								image: "/images/test3.jpeg"
							}
						]
					},
					2: {
						text: "Curabitur vitae velit quis dolor tempor lobortis in eu nunc. Nullam aliquam, libero rutrum convallis lacinia, elit tortor tincidunt dolor, venenatis cursus elit elit ut neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse potenti.",
						correct: true,
						number: 2,
						rogueAnswers: [
							{
								name: "Evan Bernstein",
								image: "test3.jpeg"
							},
							{
								name: "Cara Santa Maria",
								image: "/images/test3.jpeg"
							}
						]
					},
					3: {
						text: "In varius tellus sed ullamcorper sagittis. Ut a eleifend diam. In eget commodo neque. Donec ac turpis sit amet sapien rhoncus cursus et finibus urna.",
						number: 3,
						correct: false,
						rogueAnswers: [
							{
								name: "Jay Novella",
								image: "/images/test5.jpeg"
							}
						]
					},
					4: {
						text: "Curabitur vitae velit quis dolor tempor lobortis in eu nunc. Nullam aliquam, libero rutrum convallis lacinia, elit tortor tincidunt dolor, venenatis cursus elit elit ut neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse potenti. ",
						number: 4,
						correct: false
					}
				},
				question: "Pick the fiction",
				number: 3,
				active: false,
				answered: false,
				isUpcoming: true,
				answeredCorrectly: false
			},
			'results': {
				sectionType: 'results'
			}
		}
	};
	return fakeData;
}