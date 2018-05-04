import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Page.css";

import TestController from "./TestController.js";

window.onload = () => {
	const templateDiv = document.createElement("div");
	templateDiv.id = "content";
	templateDiv.className = "container shadow";
	document.body.appendChild(templateDiv);

	const controller = new TestController(templateDiv);
	controller.init();    
};