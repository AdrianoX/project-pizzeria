/* eslint-disable linebreak-style */

import {select, settings} from './settings.js';
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';

class HourPicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, settings.hours.open);
    
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.dataPicker.output);
    
    thisWidget.initPlugin();
  }
    
  initPlugin(){
    const thisWidget = this;
    
  }

  parseValue(value){
    return utils.numberToHour(value);
  }

  isValid(){
    return true;
  }

  renderValue(){
    const thisWidget = this;    

    thisWidget.dom.output.innerHTML = thisWidget.value;
  }

}

export default HourPicker;