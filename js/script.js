$(function(){
    $('.carousel').carousel('cycle');
    
    //when user clicks on .subcat-links
    $('body').on('click', '.sublink', function(){
        var thisSubsection = $(this).closest('.subsection');
                       
        //mark only this sublink as active
        thisSubsection.find('.sublink').removeClass('active');
        $(this).addClass('active');
        
        //show only this subcontent
        thisSubsection.find(".content .subcontent").hide();
        var subcontentID = $(this).attr('data-content-id');
        $('#'+subcontentID).show();
    });
})