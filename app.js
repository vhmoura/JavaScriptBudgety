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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curr) {
           sum += curr.value      
        });

        data.totals[type] = sum;
    };

   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals: {
           exp: 0,
           inc: 0
       },
       budget: 0,
       percentage: -1
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
       },

       calculateBudget: function() {
          // calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');
          // calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;  
          // calculate percentage of income that we spent
          if (data.totals.inc > 0)
          {
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
          }
          else 
          {
              data.percentage = -1;
          }
       },

       getBudget: function() {
           return {
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
               
           }
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
          expenseContainer: '.expenses__list',
          budgetLabel: '.budget__value',
          incomeLabel: '.budget__income--value',
          expensesLabel: '.budget__expenses--value',
          percentageLabel: '.budget__expenses--percentage',
          container: '.container'
    }

  return {
      getinput: function() {
          return {
             type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
      },

      addListItem: function(obj, type) {
          // create html string with placeholder text
          var html, newHtml, container;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            container = DOMstrings.incomeContainer;

            if (type==='exp')
            {
              html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

      displayBudget: function(obj){
         document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
         document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
         document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
         

         if (obj.percentage > 0)
         {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
         } else 
         {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){

        // calculate budget
        budgetCtrl.calculateBudget();

        // return budget
        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
        
        // display the budget on the ui
        console.log(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        input = UICtrl.getinput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);  
            UICtrl.addListItem(newItem, input.type);  
            
            UICtrl.clearFields();
    
            updateBudget();    
        }
    };

    var ctrlDeleteItem = function(event){
        var elementId, splitId, type, ID;
        console.log(event.target.parentNode);
        elementId = findUpTag(event.target.parentNode, "inc-").id;
        console.log(elementId);

        if (elementId){
            var elementId = findUpTag(event.target.parentNode, "exp-").id;
        }

        if (elementId){
            splitId = elementId.split('-');
            type = splitId[0];
            ID = splitId[1];
        }

    };

    function findUpTag(el, tag) {
        while (el.parentNode) {
            el = el.parentNode;
            if (el.id.includes(tag))
                return el;
        }
        return null;
    }

    return {
        init: function() {
            console.log('application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListners();
        }
    };

})(budgeController, UIController);

controller.init();