/* eslint-disable linebreak-style */
import {templates, select,} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

class Booking{
  constructor(bookingWidget){
    const thisBooking = this;
  
    thisBooking.render(bookingWidget);
    thisBooking.initWidgets();
  }
  
  render(bookingWidget){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingWidget;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    //bookingWidget.innerHTML = generatedHTML; <-- w/o dom.wrapper examp.

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    // thisBooking.dom.peopleAmount = bookingWidget.querySelector(select.booking.peopleAmount);  <-- w/o dom.wrapper
    // thisBooking.dom.hoursAmount = bookingWidget.querySelector(select.booking.hoursAmount); <-- w/o dom.wrapper
    thisBooking.dom.datePicker = bookingWidget.querySelector(select.widgets.datePicker.wrapper);

    console.log(select.booking.peopleAmount);

  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

  }


}

export default Booking;