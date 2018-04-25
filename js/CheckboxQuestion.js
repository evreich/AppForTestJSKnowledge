import Question from "./Question";

class CheckboxQuestion extends Question{
    constructor(_answers, _options, _text, _timeOut){
        super(_answers, _options, _text, _timeOut);
    }

    handleNext(createNewQuestion, addToListMethod){
        let textChoosenOptions = new Array();
        //сбор результатов с формы
        document.getElementsByName("questionCheckbox").forEach(function (elem) {
            if (elem.checked) {
                textChoosenOptions.push(elem.value);
            }
        });

        //вызов функции родителя
        super.handleNext(createNewQuestion, addToListMethod, textChoosenOptions);
    }

    init(contentElem, questionInfo){
        const nextQuestionButton = document.createElement("button");
        nextQuestionButton.className = "d-block btn btn-success btn-block";
        nextQuestionButton.id = "nextQuestion";
        nextQuestionButton.innerText = "Далее";
        nextQuestionButton.disabled = true;
        nextQuestionButton.addEventListener(
            "click",
            function (){
                handleNext(questionInfo.createNewQuestion, questionInfo.addToListMethod);
            },
            false
        );

        //вызов функции родителя
        super.init(contentElem, questionInfo, nextQuestionButton);

        let countCheckedOptions = 0;

        function createCheckbox(text, key) {
            const questionOptionContainer = document.createElement("div");
            questionOptionContainer.className = "custom-control custom-checkbox";

            const questionOption = document.createElement("input");
            questionOption.id = key;
            questionOption.value = text;
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
            questionLabel.id = "label" + key;
            questionLabel.htmlFor = key;
            questionLabel.className = "custom-control-label";
            questionLabel.innerText = text;

            questionOptionContainer.appendChild(questionOption);
            questionOptionContainer.appendChild(questionLabel);

            return questionOptionContainer;
        }

        this.options.forEach(function(elem) {
            contentElem.appendChild(createCheckbox(elem.value, elem.key));
            contentElem.appendChild(document.createElement("br"));
        });

        contentElem.appendChild(nextQuestionButton);
    }
}

export default CheckboxQuestion;