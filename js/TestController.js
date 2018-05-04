"use strict";

import RadioQuestion from "./RadioQuestion.js";
import CheckboxQuestion from "./CheckboxQuestion.js";
import * as decodeHelper from "../utils/decodeBase64Helpers.js";
import * as htmlHelper from "../utils/htmlHelpers.js";

let instance = null;
let questionList = [];
const serviceUrl = "api/";
let pageContent;

const loadQuestionData = (index) => {
	return ajaxToService(`${serviceUrl}GetNext/${index}`);
};

function createNewQuestionObject(questionIndex, questionCount) {
	return loadQuestionData(questionIndex)
		.then(question => questionFactory(question))
		.then(newQuestion => new Promise(
			resolve => {
				const questionInfo = {
					questionIndex,
					questionCount,
					returnQuestion : resolve
				};
				newQuestion.init(pageContent, questionInfo);
			}
		));
}

function questionFactory(inputQuestion) {
	//декодируем вопрос путем раскодирования из base 64 в ANSI, а затем кодирования/раскодирования в UTF-8
	const decodeTest = decodeHelper.b64DecodeUnicode(inputQuestion.text);
	const decodeOptions = decodeHelper.decodeArray(inputQuestion.options);
	const decodeAnswers = decodeHelper.decodeArray(inputQuestion.answers);

	//генерация объекта вопроса и связывание с родительским классом
	let question;

	decodeAnswers.length === 1
		? question = new RadioQuestion(decodeAnswers, decodeOptions, decodeTest, inputQuestion.timeOut)
		: question = new CheckboxQuestion(decodeAnswers, decodeOptions, decodeTest, inputQuestion.timeOut);

	return question;
}

function showResult() {
	//вычисление суммы баллов
	const commonScore = questionList.reduce((sum, nextElem) => sum + nextElem.getScore, 0);
	console.log(commonScore);
	//очистка контейнера
	htmlHelper.clearContainer(pageContent);
	//отрисовка итоговой страницы
	const contentDiv = htmlHelper.drawResultPage(commonScore, instance.init, pageContent);
	pageContent.appendChild(contentDiv);
}

function addQuestionToList(question) {
	questionList.push(question);
}

function ajaxToService(serviceMethodName) {
	return fetch(serviceMethodName, {
		credentials: "include",
		mode: "cors",
		method: "GET"
	})
		.then(response => response.json());
}

async function* questionGenerator() {
	try {
		const countQuestion = await ajaxToService(`${serviceUrl}TestInit`);
		for (let i = 1; i <= countQuestion; i++) {
			yield await createNewQuestionObject(i, countQuestion);
		}
	}
	catch (err) {
		console.log(err.stack);
		alert(`Возникла ошибка приложения:${err.message}`);
	}
}

class TestController {
	constructor(templateDiv) {
		if (!instance) {
			instance = this;
		}
		pageContent = templateDiv;
		return instance;
	}

	async init() {
		questionList = [];
		htmlHelper.drawStartPage(startTestAction, pageContent);
		async function startTestAction() {
			const iteratorQuestions = questionGenerator();
			for await (const question of iteratorQuestions) {
				htmlHelper.clearContainer(pageContent);
				addQuestionToList(question);
			}
			showResult();
		}
	}
}

export default TestController;