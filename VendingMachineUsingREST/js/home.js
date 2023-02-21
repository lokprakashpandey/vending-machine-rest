$(document).ready(function () {
    initialize();
});

function initialize() {

    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function(itemArray) {
            var count = 1;
            var row = '';
            $.each(itemArray, function(index, item){
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;
                //Start a new row
                //If it is new row, then count%3 will be 1
                if(count%3 == 1) {
                    row += '<div class="row">';
                }
                //add the menu item for display
                row += '<div class="col-sm-3 offset-sm-1 item" id="'+id+'">';
                row += '<div id="count'+id+'">'+count+'</div>';
                row += '<div class="text-center" id="name'+id+'">'+name+'</div><br/>';
                row += '<div class="text-center" id="price'+id+'">$'+price+'</div><br/>';
                row += '<div class="text-center" id="quantity'+id+'">Quantity Left: '+quantity+'</div>';
                row += '</div>';
                //If it is last column of a row, then close the row's div
                if(count%3 == 0 || count == itemArray.length) {
                    row += '</div>';
                }
                count++;
            });
            $('#menuColumn').append(row);
        },
        error: function() {
            alert('Error calling web service. Please try again later.');
        }
    })


    // const totalMenuItems = 10;
    // var html='';
    // for(let i=0; i<totalMenuItems; i=i+3) {
    //     html += '<div class="row">';
    //     for(let j=0; j<3 && i+j<totalMenuItems; j++) {
    //         html += '<div class="col-sm-4 item" id="'+(i+j+1)+'">';
    //         html += (i+j+1);
    //         html += '</div>';
    //     }
    // html += '</div>';
    // }
    // $('#menuColumn').append(html);

}
