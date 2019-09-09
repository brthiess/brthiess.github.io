function beginQuiz() {
	setupQuizUI();
	getQuestions(true);
}

function setupQuizUI() {
	$("[data-change-when-quiz-active]").addClass("quiz-active");
}
function getQuestions(createNewQuiz) {

}