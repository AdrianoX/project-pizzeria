/* eslint-disable linebreak-style */

import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    //console.log('new Product:', thisProduct);
  }

  renderInMenu(){
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    //console.log('generatedHTML:', generatedHTML);

    /* create element using utils.createElementFromHTML*/
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    //console.log('Menu Container:', menuContainer);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);

  }

  getElements(){
    const thisProduct = this;
    
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    //console.log('THIS PRODUCT:', thisProduct.accordionTrigger);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    //console.log('THIS PRODUCT:', thisProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    //console.log('THIS PRODUCT:', thisProduct.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    //console.log('THIS PRODUCT:', thisProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    //console.log('THIS PRODUCT:', thisProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }


  initAccordion(){
    const thisProduct = this;
    //console.log('thisProduct:', thisProduct);

    //thisProduct.clickableElement = thisProduct.accordionTrigger;   <---  unnecessary ? 

    /* find the clickable trigger (the element that should react to clicking) */
    const clickableTrigger = thisProduct.element;
    //console.log('clickableTrigger:', clickableTrigger);

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function(){
      //console.log('clicked');

      /* prevent default action for event */
      event.preventDefault();

      const activeProduct = document.querySelector('.product.active');
      if(activeProduct && activeProduct != clickableTrigger) activeProduct.classList.remove('active');
      clickableTrigger.classList.toggle('active');

      /* END: click event listener to trigger */
    });
  }
  

  initOrderForm(){
    const thisProduct = this;
    //console.log('thisProduct:', thisProduct);

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
      
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
      
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;
    //console.log('thisProduct:', thisProduct);
    
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('form-data:', formData);

    thisProduct.params = {};

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    //console.log('price:', price);
    /* START LOOP: for each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params){
      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId];
      /* START LOOP: for each optionId in param.options */
      for(let optionId in param.options){
        /* save the element in param.options with key optionId as const option */
        const option = param.options[optionId];  
        //console.log('option:', option);
        /* START IF: if option is selected and option is not default */
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        //console.log('optionSelected::', optionSelected);
        if(optionSelected && !option.default) {
          /* add price of option to variable price */
          //price += option.price;    ==    price = price + option.price;  (code line below)
          price = price + option.price;
            
          /* END IF: if option is selected and option is not default */
        }
        /* START ELSE IF: if option is not selected and option is default */
        else if(!optionSelected && option.default){
          /* deduct price of option from price */
          //price = price - option.price;  ==  price -= option.price; (code line below)
          price -= option.price;
    
          /* END ELSE IF: if option is not selected and option is default */
        }

        // [DONE] Create const with products images that have parameter key (paramId) and option key (optionId)
        const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
        //console.log('images:', images);
        // [DONE] Start "if" product have image and is currently selected
        if (optionSelected){
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          // [DONE] Add class active image (if selected) 
          for(let image of images){
            image.classList.add(classNames.menuProduct.imageVisible);
          }
          // [DONE] Else remove class active when product isn't selected
        } else {
          for (let image of images){
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
        
        /* END LOOP: for each optionId in param.options */
      } 
      /* END LOOP: for each paramId in thisProduct.data.params */
    } 
    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log('params', thisProduct.params);
    
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;


    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    // app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}
export default Product;