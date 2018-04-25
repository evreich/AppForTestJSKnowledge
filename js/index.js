import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Page.css';

import TestController from './TestController';

window.onload = () => {
    const controller = new TestController();
    controller.init();    
};