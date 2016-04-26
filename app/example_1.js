$(function() {
    var persons;
    var responseStatus;

    $.get('/api/simpsons.json', function(data, responseText, response) {
        if (response.status == 200) {
        persons = data;
            activate();
        }
    });

    function activate() {
        var $body = $('body');
        
        for (var index = 0; index < persons.length; index++) {
            var $p = $("<p>");
            var $a = $("<a>");
            var person = persons[index];

            $a.attr("href", "#")
              .data("id", person.id)
              .text("Name: " + person.name + " age: " + calcAge(person.birthDate));

            $a.on("click", function() {
                var id = $(this).data('id');
                alert(id);
            });

            $p.append($a);
            $body.append($p);
        }
    }
    
    function calcAge(dateString) {
        var birthday = +new Date(dateString.substr(6, 4), dateString.substr(5, 2)-1, dateString.substr(0, 2));
        return ~~((Date.now() - birthday) / (31557600000));
    }
})