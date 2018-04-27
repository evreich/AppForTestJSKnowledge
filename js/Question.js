"use strict";

import * as htmlHelper from "../utils/htmlHelpers.js";

const _scores = new WeakMap();
const _answers = new WeakMap();
const _timeOut = new WeakMap();

class Question {
    constructor(answers, options, text, timeOut) {
        _answers.set(this, answers);
        _scores.set(this, 0);
        _timeOut.set(this, timeOut);
        this.text = text;
        this.options = options;
    }

    get getScore() {
        return _scores.get(this);
    }

    handleNext(result) {
        const ans = _answers.get(this);
        if (ans.length === result.length && ans.every(el => result.indexOf(el) >= 0))
            _scores.set(this, 1);
        console.log(ans.every(el => result.indexOf(el) >= 0));
    };

    init(contentElem, questionInfo, nextQuestionButton) {
        const questionContainer = htmlHelper.drawQuestion(nextQuestionButton, questionInfo, this.text, _timeOut.get(this), contentElem);
        contentElem.appendChild(questionContainer)
    }
}

export default Question;