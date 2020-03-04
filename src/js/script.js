/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  //We started here //
  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      console.log('generatedHTML:', generatedHTML);

      /* create element using utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      console.log('Menu Container:', menuContainer);

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
    }


    initAccordion(){
      const thisProduct = this;
      console.log('thisProduct:', thisProduct);

      //thisProduct.clickableElement = thisProduct.accordionTrigger;   <---  unnecessary ? 

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element;
      console.log('clickableTrigger:', clickableTrigger);

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function(){
        console.log('clicked');

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
      console.log('thisProduct:', thisProduct);

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
      });
    }

    processOrder(){
      const thisProduct = this;
      console.log('thisProduct:', thisProduct);
    
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('form-data:', formData);
      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;
      console.log('price:', price);
      /* START LOOP: for each paramId in thisProduct.data.params */
      for(let paramId in thisProduct.data.params){
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        /* START LOOP: for each optionId in param.options */
        for(let optionId in param.options){
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];  
          console.log('option:', option);
          /* START IF: if option is selected and option is not default */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          console.log('optionSelected::', optionSelected);
          if(optionSelected && !option.default) {
            /* add price of option to variable price */
            price = price + option.price;

            
          /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          if(!optionSelected && option.default){
            /* deduct price of option from price */

            price = price + option.price;
    
          /* END ELSE IF: if option is not selected and option is default */
          }
        /* END LOOP: for each optionId in param.options */
        } 
      /* END LOOP: for each paramId in thisProduct.data.params */
      } 
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem= price;
    
    
    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;

    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);


      thisApp.initData();
      thisApp.initMenu();
    },
  };



  app.init();
}