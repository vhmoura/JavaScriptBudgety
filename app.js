var budgeController = (function() {
   
})();

var UIController = (function() {

})();

var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {

    };

   document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

   document.addEventListener('keypress', function(event) {
       if (event.keyCode === 13 || event.which === 13) {

       }
   });
})(budgeController, UIController);