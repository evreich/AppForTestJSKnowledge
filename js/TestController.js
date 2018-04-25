import RadioQuestion from "./RadioQuestion";
import CheckboxQuestion from "./CheckboxQuestion";

let instance = null;
let questionList = Array();
const serviceUrl = WeakMap();

const addQuestionToList = (question) => {
    questionList.push(question)
};

const ajaxToService = (serviceMethodName) => {
    fetch(serviceMethodName, {
        credentials: 'same-origin',
        cors: 'cors'
    })
    .then((response)=>{
        return JSON.parse(response);
    })
    .catch((response)=>{
        alert('Ошибка: ' + (response.status ? response.statusText : ', запрос не удался'));
    });
};

const questionGenerator = async function*() {

}

class TestController{
    constructor() {
        if (!instance) {
          instance = this;
        }
        serviceUrl.set(this, "/api");

        return instance;
    }

    async init(){
        function drawPage(){
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
        function startTestAction(){
            const iteratorQuestions = questionGenerator();
            for await(const question of iteratorQuestions){
                addQuestionToList(question);
            }
        }
    }
}

export default TestController;