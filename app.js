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

   return {
       addItem: function(type, des, val) {
        var newItem, ID; 
        
        if (data.allItems[type].length === 0)
        { 
            ID = 0
        }
        else 
        {
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        }

        if (type === 'exp') {
            newItem = new Expense(ID, des, val); 
        }
        else if (type === 'inc'){
           newItem = new Income(ID, des, val);
        }

        data.allItems[type].push(newItem);
        return newItem;
       }
   }
})();

var UIController = (function() {
    var DOMstrings = {
          inputType: '.add__type',
          inputDescription: '.add__description',
          inputValue: '.add__value',
          inputAddButton: '.add__btn',
          incomeContainer: '.income__list',
          expenseContainer: '.expenses__list'
    }

  return {
      getinput: function() {
          return {
             type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: document.querySelector(DOMstrings.inputValue).value
            }
      },

      addListItem: function(obj, type) {
          // create html string with placeholder text
          var html, newHtml, container;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            container = DOMstrings.incomeContainer;

            if (type==='exp')
            {
              html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              container = DOMstrings.expenseContainer;
            }

          // replace the place holder with some actual data
            newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', obj.value);

          // insert html back into the dom

          var DomContainer = document.querySelector(container);
          DomContainer.insertAdjacentHTML('beforeend', newHtml);

      },

      clearFields: function() {
        var fields = document.querySelectorAll(DOMstrings.inputDescription+ ', ' + DOMstrings.inputValue);
        var fieldsArray = Array.prototype.slice.call(fields);
        fieldsArray.forEach(function(curr, index, array) {
            curr.value = "";
        });
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
        var input, newItem;

        input = UICtrl.getinput();
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);  
        UICtrl.addListItem(newItem, input.type);  
        
        UICtrl.clearFields();
    };

    return {
        init: function() {
            console.log('application has started');
            setupEventListners();
        }
    };

})(budgeController, UIController);

controller.init();