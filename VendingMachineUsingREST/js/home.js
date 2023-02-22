$(document).ready(function () {
    loadMenu();
    purchase();
});

function loadMenu() {
    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function (itemArray) {
            var count = 1;
            var row = '';
            $.each(itemArray, function (index, item) {
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;
                //Start a new row
                //If it is new row, then count%3 will be 1
                if (count % 3 == 1) {
                    row += '<div class="row">';
                }
                //add the menu item for display
                row += '<div class="col-sm-3 offset-sm-1 item" id="'+id+'" onclick="selectItem('+id+','+count+')">';
                row += '<div id="count' + id + '">' + count + '</div>';
                row += '<div class="text-center" id="name' + id + '">' + name + '</div><br/>';
                row += '<div class="text-center" id="price' + id + '">$' + price + '</div><br/>';
                row += '<div class="text-center" id="quantity' + id + '">Quantity Left: ' + quantity + '</div>';
                row += '</div>';
                //If it is last column of a row, then close the row's div
                if (count % 3 == 0 || count == itemArray.length) {
                    row += '</div>';
                }
                count++;
            });
            $('#menuColumnDiv').html(row);
        },
        error: function () {
            alert('Error calling web service. Please try again later.');
        }
    });
}

function add(buttonDenomination) {
    //parse the string value first to convert to float
    var currentValue = parseFloat($('#total').val());
    //change value according to the button clicked
    if (buttonDenomination === 'dollar') {
        currentValue += 1.0;
    }
    else if (buttonDenomination === 'quarter') {
        currentValue += 0.25;
    }
    else if (buttonDenomination === 'dime') {
        currentValue += 0.10;
    }
    else {
        currentValue += 0.05;
    }
    //display to 2-decimal digits
    $('#total').val(currentValue.toFixed(2));
    //When money is added, clear message and change if set
    $('#message').val('');
    $('#change').val('');
}

function selectItem(id, count) {
    // to display item number to user
    $('#itemNumber').val(count);

    //to change css when clicked, we keep prevId so that it can be cleared when next item is selected
    let prevId = $('#itemId').val(); // it is initially empty
    if(prevId.length && prevId != id) {
        $('#'+prevId).removeClass('blackandwhite'); //remove class of previous item selected
    }
    $('#'+id).addClass('blackandwhite'); // toggle class of new item selected

    //assign actual id value of the item
    $('#itemId').val(id);

    //selecting an item clears value of change and message which is computed after purchase
    $('#change').val('');
    $('#message').val('');
}

function purchase() {
    $('#purchaseButton').click(function (event) {
        var amount = $('#total').val();
        var id = $('#itemId').val();
        $.ajax({
            type: 'POST',
            url: 'http://vending.us-east-1.elasticbeanstalk.com/money/'+amount+'/item/'+id,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            success: function(response) {
                    var quarters = response.quarters;
                    var dimes = response.dimes;
                    var nickels = response.nickels;
                    var pennies = response.pennies;
                    //Update leftover total after purchase
                    var moneyToReturn = parseInt(quarters)*0.25 + parseInt(dimes)*0.10 + parseInt(nickels)*0.05 + parseInt(pennies)*0.01;
                    var changeString = '';
                    if(quarters > 0) changeString += quarters + ' Quarter ';
                    if(dimes > 0) changeString += dimes + ' Dime ';
                    if(nickels > 0) changeString += nickels + ' Nickel ';
                    if(pennies > 0) changeString += pennies + ' Penny';
                    $('#total').val(moneyToReturn.toFixed(2));
                    $('#message').val('Thank You!!!');
                    $('#change').val(changeString);                
                    loadMenu();
            },
            error: function (errorResponse) {
                $('#message').val(errorResponse.responseJSON.message);
                $('#change').val('');
            }
         })
    });
}

function changeReturn() {   
    $('#total').val('0.00');
    $('#message').val('');
    $('#itemNumber').val('');
    $('#itemId').val('');
    $('#change').val('');
}