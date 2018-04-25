import RadioQuestion from "./RadioQuestion";
import CheckboxQuestion from "./CheckboxQuestion";

let instance = null;
let questionList = Array();
const serviceUrl = WeakMap();

const loadQuestionData = (index) => {
    return ajaxToService(serviceUrl+"GetNext/"+index);
};

function createNewQuestionObject(questionIndex, questionCount){
    return new Promise(function(resolve, reject){
        loadQuestionData(questionIndex).then((question) => {
            const data = JSON.parse(question);
            const newQuestion = questionFactory(parsedQuestion);
            //инициируем генерацию страницы вопроса и передаем данные для question
            function returnQuestion(){
                resolve(newQuestion);
            }
            questionInfo = {
                questionIndex,
                questionCount,
                returnQuestion
            };

            newQuestion.init(pageContent, questionInfo);
        })
        .catch((errorMessage)=>{
            reject(errorMessage);
        });       
    })
};

function questionFactory(inputQuestion){
    const separator = "#;";

    function decodeArray(encodedArray) {
        let decodeRes = new Array();
        let i = 1;
        encodedArray.split(separator).forEach(function(elem) {
            decodeRes.push({ key: i++, value: b64DecodeUnicode(elem) });
        });
        return decodeRes;
    }

    function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    //декодируем вопрос путем раскодирования из base 64 в ANSI, а затем кодирования/раскодирования в UTF-8
    const decodeTest = b64DecodeUnicode(inputQuestion.text);
    const decodeOptions = decodeArray(inputQuestion.options);
    const decodeAnswers = decodeArray(inputQuestion.answers);

    //генерация объекта вопроса и связывание с родительским классом
    let question;

    decodeAnswers.length === 1 
    ? question = new RadioQuestion(decodeAnswers, decodeOptions, decodeTest, inputQuestion.timeOut) 
    : question = new CheckboxQuestion(decodeAnswers, decodeOptions, decodeTest, inputQuestion.timeOut);

    return question;
};

function clearContainer() {
    while (pageContent.firstChild) {
        pageContent.removeChild(pageContent.firstChild);
    }
}

function showResult(){
    //вычисление суммы баллов
    const commonScore = questionList.reduce(function (sum, nextElem) {
        return sum + nextElem.getScore();
    }, 0);
    //очистка контейнера
    clearContainer();
    //отрисовка итоговой страницы
    var titleDiv = document.createElement("div");
    titleDiv.className = "d-flex justify-content-sm-center mt-3";
    var titleOfEndTest = document.createElement("h2");
    titleOfEndTest.innerText = "Тест окончен!";
    titleDiv.appendChild(titleOfEndTest);

    var resultDiv = document.createElement("div");
    resultDiv.className = "d-flex justify-content-sm-center mt-3";
    var result = document.createElement("h4");
    result.innerText = "Ваши баллы: " + commonScore;
    resultDiv.appendChild(result);

    var restartTestButton = document.createElement("button");
    restartTestButton.id = "restartTest";
    restartTestButton.className = "d-block btn btn-success btn-block";
    restartTestButton.innerText = "Пройти тест еще раз";
    restartTestButton.addEventListener(
        "click",
        function () {
            ajaxToService("TestInit", function (countQuestions) {
                questionCount = countQuestions;
                questionIndex = 0;
                createNextQuestionObject();
                self.questionList = [];
            });
        }, 
        false
    );

    var contentDiv = document.createElement("div");
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(resultDiv);
    contentDiv.appendChild(document.createElement("br"));
    contentDiv.appendChild(restartTestButton);

    pageContent.appendChild(contentDiv);
};

function addQuestionToList(question){
    questionList.push(question)
};

function ajaxToService(serviceMethodName){
    return fetch(serviceMethodName, {
        credentials: 'same-origin',
        cors: 'cors'
    })
    .catch((response)=>{
        const errorMessage = 'Ошибка: ' + (response.status ? response.statusText : ', запрос не удался');
        throw errorMessage;
    });
};

async function* questionGenerator() {
    ajaxToService(serviceUrl+"TestInit").then(function(countQuestion){
        for(let i=1; i<=countQuestion; i++){
            yield await createNewQuestionObject(i, countQuestion);
        }
    })
    .catch((errorMessage) => {
        alert(errorMessage);
    })
}

class TestController{
    constructor() {
        if (!instance) {
          instance = this;
        }
        serviceUrl.set(this, "api/");

        return instance;
    }

    async init(){
        (function drawPage(){
            //отрисовка страницы
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
                    startTestAction();
                    startTestButton.removeEventListener("click", startTest, false);
                    clearContainer();
                },
                false
            );

            const contentDiv = document.createElement("div");
            contentDiv.appendChild(testTitle);
            contentDiv.appendChild(document.createElement("br"));
            contentDiv.appendChild(startTestButton);

            pageContent.appendChild(contentDiv);
            pageContent.classList.add("main-content");
        })();

        await (async function startTestAction(){
            const iteratorQuestions = questionGenerator();
            for await(const question of iteratorQuestions){
                clearContainer();
                addQuestionToList(question);
            }
        })();
    }
}

export default TestController;