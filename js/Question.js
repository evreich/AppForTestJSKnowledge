const scores = new WeakMap();
const answers = new WeakMap();
const timeOut = new WeakMap();

class Question{
    constructor(_answers, _options, _text, _timeOut){
        answers.set(this, _answers);
        scores.set(this, 0);
        timeOut.set(this, _timeOut);
        this.text = _text;
        this.options = new Array(..._options);        
    }

    get getScore(){
        return scores.get(this);
    }

    handleNext(result) {
        let counter = 0;
        const ans = answers.get(this);
        result.forEach(function(elem) {
            if (ans.includes(elem))
                counter++;             
        });
        scores.set(this,counter);
    };

    init(contentElem, questionInfo, nextQuestionButton) {
        function getCorrectTimeFromSeconds(time) {
            const minutes = Math.floor(time / 60);
            const seconds = time - minutes * 60;
    
            return minutes + ":" + seconds;
        };

        //генерируем новые элементы страницы
        const questionHeaderContainer = document.createElement("div");
        questionHeaderContainer.className = "question-container";

        const questionTitle = document.createElement("h3");
        questionTitle.className = "d-block";
        questionTitle.innerText = "Вопрос " + questionInfo.questionIndex;
        questionHeaderContainer.appendChild(questionTitle);

        //добавляем таймер на страницу, если имеем соотв значение
        const _timeOut = timeOut.get(this);
        if (_timeOut) {
            const questionTimer = document.createElement("h4");
            questionTimer.id = "timer";
            questionTimer.className = "ml-2";
            questionTimer.style = "color: red; display:inline-block";
            questionTimer.innerText = getCorrectTimeFromSeconds(_timeOut);

            let currTimeout = _timeOut;
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
                function() {
                    clearTimeout(timerId);
                },
                false);
            const container = document.createElement("div");
            container.className = "d-block mr-5";
            container.appendChild(questionTimer);

            questionHeaderContainer.appendChild(container);
        }

        const questionSequence = document.createElement("h4");
        questionSequence.className = "d-block";
        questionSequence.innerText = questionInfo.questionIndex + " из " + questionInfo.questionCount;
       
        questionHeaderContainer.appendChild(questionSequence);
        contentElem.appendChild(questionHeaderContainer);

        const questionContainer = document.createElement("div");
        questionContainer.className = "d-flex justify-content-sm-center mt-3";

        const questionText = document.createElement("pre");
        questionText.className = "d-block mb-2 font-weight-bold";
        questionText.innerText = this.text;

        questionContainer.appendChild(questionText);
        contentElem.appendChild(questionContainer);
    }
}

export default Question;