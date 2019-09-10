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
	var quizHtml = buildQuizHtml($quiz, data);
	$("[data-quiz-container]").html(quizHtml);
}

function buildQuizHtml(template, data) {

}

function getFakeData() {
	var fakeData = {
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
				question: "Pick the fiction"
			}
		]
	};
	return fakeData;
}