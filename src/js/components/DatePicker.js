/* eslint-disable linebreak-style */
import utils from '../utils.js';
import {select, settings} from '../settings.js';
import BaseWidget from './BaseWidget.js';


class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    let numberOfDays = settings.datePicker.maxDaysInFuture;
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, numberOfDays);
    

  }
}

export default DatePicker;