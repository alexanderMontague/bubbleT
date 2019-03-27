$(document).ready(function() {
    const $content = $("#faq-content");
    $.getJSON("assets/faq.json", function(data) {
        $.each(data, function(index, item) {
            $content.append("<hr><h4 class=\"text-info\">"+item.question+"</h4>"+
                "<p>"+item.answer+"</p>");
        });
    })
    .done(function() {
        $("#faq-loader").hide();
    })
    .fail(function(err) {
        console.log("Failure loading faq:"+err);
        $("#faq-loader").hide();
        $content.append("<div class=\"alert alert-danger\">Error loading FAQ</div>");
    });
});