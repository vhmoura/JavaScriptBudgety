var budgeController = (function() {
   var Expense = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
    };

   var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    };

   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals: {
           exp: 0,
           inc: 0
       }
   }
})();

var UIController = (function() {
    var DOMstrings = {
          inputType: '.add__type',
          addDescription: '.add__description',
          addValue: '.add__value',
          inputAddButton: '.add__btn'
    }

  return {
      getinput: function() {
          return {
             type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
             description: document.querySelector(DOMstrings.addDescription).value,
             value: document.querySelector(DOMstrings.addValue).value
            }
      },

      getDOMstrings: function() {
          return DOMstrings;
      }
  }
})();

var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListners = function() {        
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputAddButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });    
    };

    var ctrlAddItem = function() {
        var input = UICtrl.getinput();
       
    };

    return {
        init: function() {
            console.log('application has started');
            setupEventListners();
        }
    };

})(budgeController, UIController);

controller.init();