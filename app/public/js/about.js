$(document).ready(function() {
    const $content = $("#team-content");
    $.getJSON("assets/team.json", function(data) {
        $.each(data, function(index, item) {
            $content.append("<div class=\"col-sm-4\">\
                <div class=\"card shadow-sm mb-3\">\
                  <img src=\""+item.image+"\" class=\"card-img-top\" alt=\""+item.name+"profile image\">\
                  <div class=\"card-body\">\
                    <h3 class=\"title\">"+item.name+"</h3>\
                    <span class=\"post\">"+item.title+"</span><br>\
                    <a href=\"https://www.linkedin.com/in/"+item.li_username+"\" target=\"_blank\" class=\"btn btn-sm btn-linkedin\">\
                    <i class=\"fab fa-linkedin-in\"></i></a>\
                  </div>\
                </div>\
            </div>");
        });
    })
    .done(function() {
        $("#loader").hide();
    })
    .fail(function(err) {
        console.log("Failure loading about:"+err);
        $("#loader").hide();
        $content.append("<div class=\"alert alert-danger\">Error loading team members</div>");
    });
});