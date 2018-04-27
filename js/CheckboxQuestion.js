"use strict";

import Question from "./Question.js";
import * as htmlHelper from "../utils/htmlHelpers.js";

class CheckboxQuestion extends Question {
    constructor(_answers, _options, _text, _timeOut) {
        super(_answers, _options, _text, _timeOut);
    }

    handleNext(returnQuestion) {
        const checkBoxInputs = document.getElementsByName("questionCheckbox");
        //сбор результатов с формы
        const textChoosenOptions = [...checkBoxInputs].filter(el => el.checked).map(el => el.value);

        //вызов функции родителя для подсчета очков
        super.handleNext(textChoosenOptions);
        returnQuestion(this);
    }

    init(contentElem, questionInfo) {
        //обработка кнопки
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

        //вызов функции отрисовки родителя
        super.init(contentElem, questionInfo, nextQuestionButton);

        let countCheckedOptions = 0,  key = 0;    

        this.options.forEach(function (elem) {
            contentElem.appendChild(htmlHelper.createCheckbox(elem, ++key, nextQuestionButton, countCheckedOptions));
            contentElem.appendChild(document.createElement("br"));
        });

        contentElem.appendChild(nextQuestionButton);
    }
}

export default CheckboxQuestion;