﻿function beginQuiz() {
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
		var quizSection = populateQuizSection($(template).find("[data-quiz-section]"), data.questions[i]);
		$(quizSection).appendTo($(quizHtml));
	}
	return quizHtml;
}

function populateQuizSection(sectionTemplate, questionData) {
	var quizSection = $(sectionTemplate).clone().html("");

	var quizQuestion = populateQuizQuestion($(sectionTemplate).find("[data-quiz-question-container]"), questionData.question);
	$(quizQuestion).appendTo($(quizSection));	

	var quizAnswers = populateQuizQuestionAnswers($(sectionTemplate).find("[data-quiz-answers]"), questionData.answers);
	$(quizAnswers).appendTo($(quizSection));	

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
				question: "Pick the fiction"
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
				question: "Pick the fiction"
			}
		]
	};
	return fakeData;
}