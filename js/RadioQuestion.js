import Question from "./Question.js";

class RadioQuestion extends Question{
    constructor(_answers, _options, _text, _timeOut){
        super(_answers, _options, _text, _timeOut);
    }

    handleNext(returnQuestion){
        let textChoosenOption = new Array();
        //сбор результатов с формы
        const radioInputs = document.getElementsByName("questionRadio");
        for(let radioOption of radioInputs) {
            if (radioOption.checked) {
                textChoosenOption.push(radioOption.value);
                break;
            }
        }
    
        //вызов функции родителя для подсчета очков
        super.handleNext(textChoosenOption);
        returnQuestion(this);
    }

    init(contentElem, questionInfo){
        const nextQuestionButton = document.createElement("button");
        nextQuestionButton.className = "d-block btn btn-success btn-block";
        nextQuestionButton.id = "nextQuestion";
        nextQuestionButton.innerText = "Далее";
        nextQuestionButton.disabled = true;
        nextQuestionButton.addEventListener(
            "click",
            function () {
                this.handleNext(questionInfo.returnQuestion);
            }.bind(this),
            false
        );
    
        //вызов функции родителя
        super.init(contentElem, questionInfo, nextQuestionButton);
    
        function createOption(text, key) {
            const questionOptionContainer = document.createElement("div");
            questionOptionContainer.className = "custom-control custom-radio";
    
            const questionOption = document.createElement("input");
            questionOption.id = key;
            questionOption.name = "questionRadio";
            questionOption.value = text;
            questionOption.type = "radio";
            questionOption.className = "custom-control-input";
    
            questionOption.addEventListener(
                "click",
                function() {
                    nextQuestionButton.disabled = false;
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
    
        let key = 0;
        this.options.forEach(function(elem) {
            contentElem.appendChild(createOption(elem, ++key));
            contentElem.appendChild(document.createElement("br"));
        });
    
        //добавление кнопки на форму
        contentElem.appendChild(nextQuestionButton);
    }
}

export default RadioQuestion;