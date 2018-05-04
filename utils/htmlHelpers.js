"use strict";

export function drawStartPage(startTestAction, pageContent) {
	const testTitle = document.createElement("h3");
	testTitle.className = "d-block mb-2";
	testTitle.innerText = "Тестирование знаний JavaScript";

	const startTestButton = document.createElement("button");
	startTestButton.id = "startTest";
	startTestButton.className = "d-block btn btn-success btn-lg center-elem w-50";
	startTestButton.innerText = "Начать";
	startTestButton.addEventListener(
		"click",
		function startTest() {
			pageContent.classList.remove("main-content");
			pageContent.classList.add("question-content");
			startTestAction();
			startTestButton.removeEventListener("click", startTest, false);
			clearContainer(pageContent);
		},
		false
	);

	const contentDiv = document.createElement("div");
	contentDiv.appendChild(testTitle);
	contentDiv.appendChild(document.createElement("br"));
	contentDiv.appendChild(startTestButton);

	pageContent.appendChild(contentDiv);
	pageContent.classList.add("main-content");
}

export function drawResultPage(commonScore, initTestFunction,pageContent) {
	const titleDiv = document.createElement("div");
	titleDiv.className = "d-flex justify-content-sm-center mt-3";
	const titleOfEndTest = document.createElement("h2");
	titleOfEndTest.innerText = "Тест окончен!";
	titleDiv.appendChild(titleOfEndTest);

	const resultDiv = document.createElement("div");
	resultDiv.className = "d-flex justify-content-sm-center mt-3";
	const result = document.createElement("h4");
	result.innerText = `Ваши баллы: ${commonScore}`;
	resultDiv.appendChild(result);

	const restartTestButton = document.createElement("button");
	restartTestButton.id = "restartTest";
	restartTestButton.className = "d-block btn btn-success btn-block";
	restartTestButton.innerText = "Пройти тест еще раз";
	restartTestButton.addEventListener(
		"click",
		() => {
			clearContainer(pageContent);
			initTestFunction();
		},
		false
	);

	const contentDiv = document.createElement("div");
	contentDiv.appendChild(titleDiv);
	contentDiv.appendChild(resultDiv);
	contentDiv.appendChild(document.createElement("br"));
	contentDiv.appendChild(restartTestButton);

	return contentDiv;
}

export function clearContainer(pageContent) {
	while (pageContent.firstChild) {
		pageContent.removeChild(pageContent.firstChild);
	}
}

function getCorrectTimeFromSeconds(time) {
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;

	return `${minutes}:${seconds}`;
}

function drawTimerPartOfQuestion(nextQuestionButton, timeOut, questionContainer) {
	const questionTimer = document.createElement("h4");
	questionTimer.id = "timer";
	questionTimer.className = "ml-2";
	questionTimer.style.color = "red";
	questionTimer.style.display = "inline-block";
	questionTimer.innerText = getCorrectTimeFromSeconds(timeOut);

	let currTimeout = timeOut;
	let timerId = setTimeout(function tick() {
		if (currTimeout === 0) {
			nextQuestionButton.disabled = false;
			nextQuestionButton.click();
		}
		else {
			questionTimer.innerText = getCorrectTimeFromSeconds(--currTimeout);
			timerId = setTimeout(tick, 1000);
		}
	}, 1000);

	nextQuestionButton.addEventListener(
		"click",
		() => clearTimeout(timerId),
		false);
	const container = document.createElement("div");
	container.className = "d-block mr-5";
	container.appendChild(questionTimer);

	questionContainer.appendChild(container);
}

export function drawQuestion(nextQuestionButton, questionInfo, textQuestion, timeOut, contentElem) {
	//генерируем новые элементы страницы
	const questionHeaderContainer = document.createElement("div");
	questionHeaderContainer.className = "question-container";

	const questionTitle = document.createElement("h3");
	questionTitle.className = "d-block";
	questionTitle.innerText = `Вопрос ${questionInfo.questionIndex}`;
	questionHeaderContainer.appendChild(questionTitle);

	//добавляем таймер на страницу, если имеем соотв значение

	if (timeOut) 
		drawTimerPartOfQuestion(nextQuestionButton, timeOut, questionHeaderContainer);

	const questionSequence = document.createElement("h4");
	questionSequence.className = "d-block";
	questionSequence.innerText = `${questionInfo.questionIndex} из ${questionInfo.questionCount}`;

	questionHeaderContainer.appendChild(questionSequence);
	contentElem.appendChild(questionHeaderContainer);

	const questionContainer = document.createElement("div");
	questionContainer.className = "d-flex justify-content-sm-center mt-3";

	const questionText = document.createElement("pre");
	questionText.className = "d-block mb-2 font-weight-bold";
	questionText.innerText = textQuestion;

	questionContainer.appendChild(questionText);
	return questionContainer;
}

export function createCheckbox(text, key, nextQuestionButton, countCheckedOptions) {
	const questionOptionContainer = document.createElement("div");
	questionOptionContainer.className = "custom-control custom-checkbox";

	const questionOption = document.createElement("input");
	questionOption.id = key;
	//questionOption.value = text;
	questionOption.setAttribute("value", text);
	questionOption.name = "questionCheckbox";
	questionOption.type = "checkbox";
	questionOption.className = "custom-control-input";

	questionOption.addEventListener(
		"change",
		function() {
			if (this.checked) {
				countCheckedOptions++;
				nextQuestionButton.disabled = false;
			}
			else {
				countCheckedOptions--;
				if (countCheckedOptions === 0) {
					nextQuestionButton.disabled = true;
				}
			}
		},
		false
	);

	const questionLabel = document.createElement("label");
	questionLabel.htmlFor = key;
	questionLabel.className = "custom-control-label";
	questionLabel.innerText = text;

	questionOptionContainer.appendChild(questionOption);
	questionOptionContainer.appendChild(questionLabel);

	return questionOptionContainer;
}

export function createOption(text, key, nextQuestionButton) {
	const questionOptionContainer = document.createElement("div");
	questionOptionContainer.className = "custom-control custom-radio";

	const questionOption = document.createElement("input");
	questionOption.id = key;
	questionOption.name = "questionRadio";
	//questionOption.value = text;
	questionOption.setAttribute("value", text);
	questionOption.type = "radio";
	questionOption.className = "custom-control-input";

	questionOption.addEventListener(
		"click",
		() => nextQuestionButton.disabled = false,
		false
	);

	const questionLabel = document.createElement("label");
	questionLabel.htmlFor = key;
	questionLabel.className = "custom-control-label";
	questionLabel.innerText = text;

	questionOptionContainer.appendChild(questionOption);
	questionOptionContainer.appendChild(questionLabel);

	return questionOptionContainer;
}