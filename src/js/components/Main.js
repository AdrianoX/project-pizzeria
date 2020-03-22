/* eslint-disable linebreak-style */

import {select, templates} from '../settings.js';
import utils from '../utils.js';

class Main {
  constructor(data, id){
    const thisMain = this;

    thisMain.data = data;
    thisMain.id = id;

    thisMain.displayMainPage();
  }


  displayMainPage(){
    const thisMain = this;

    const generatedHTML = templates.mainPage(thisMain.data);

    thisMain.element = utils.createDOMFromHTML(generatedHTML);

    const mainContainer = document.querySelector(select.containerOf.main);

    mainContainer.appendChild(thisMain.element);
  }
}
export default Main;