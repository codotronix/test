$(function(){
    $('.carousel').carousel('cycle');
    
    //Add anim classes
    $('.subsection .subcontent').addClass('animated slideInRight');
    //Show 1st subcontent of all subsection
    $('.subsection .subcontent:first-child').show();
    
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
    
    
    //hide header on scroll down, show on scroll up
    var prevScrollTop = $('body').scrollTop();
    var currScrollTop = 0;
    $(window).on('scroll', function(){
        currScrollTop = $('body').scrollTop();
        
        if (currScrollTop < 100) {
            return;
        }
        else if (currScrollTop > prevScrollTop) {
            $('.main-header').slideUp(200);
        } else {
            $('.main-header').slideDown(200);
        }
        
        prevScrollTop = currScrollTop;
    })
    
})