"use strict";

import Question from "./Question.js";
import * as htmlHelper from "../utils/htmlHelpers.js";

class RadioQuestion extends Question {
    constructor(_answers, _options, _text, _timeOut) {
        super(_answers, _options, _text, _timeOut);
    }

    handleNext(returnQuestion) {
        //сбор результатов с формы
        const radioInputs = document.getElementsByName("questionRadio");
        const textChoosenOption = [...radioInputs].filter(el => el.checked).map(el => el.value);

        //вызов функции родителя для подсчета очков
        super.handleNext(textChoosenOption);
        returnQuestion(this);
    }

    init(contentElem, questionInfo) {
        const nextQuestionButton = document.createElement("button");
        nextQuestionButton.className = "d-block btn btn-success btn-block";
        nextQuestionButton.id = "nextQuestion";
        nextQuestionButton.innerText = "Далее";
        nextQuestionButton.disabled = true;
        nextQuestionButton.addEventListener(
            "click",
            () => this.handleNext(questionInfo.returnQuestion),
            false
        );

        //вызов функции родителя
        super.init(contentElem, questionInfo, nextQuestionButton);

        let key = 0;
        this.options.forEach(function (elem) {
            contentElem.appendChild(htmlHelper.createOption(elem, ++key, nextQuestionButton));
            contentElem.appendChild(document.createElement("br"));
        });

        //добавление кнопки на форму
        contentElem.appendChild(nextQuestionButton);
    }
}

export default RadioQuestion;