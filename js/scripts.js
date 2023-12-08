$(document).ready(function() {
    // When a tab is clicked
    $('.tab').click(function() {
        // Get the value of the data-tab attribute of the clicked tab
        var tabId = $(this).data('tab');
        console.log("Tab clicked:", tabId);
        
        // Remove the 'active' class from all tabs
        $(".tab").removeClass('active');
        // Add the 'active' class to the clicked tab
        $(this).addClass('active');
        
        // Hide all tab panes
        $('.tab-pane').removeClass('active');
        // Show the tab pane corresponding to the clicked tab
        $('[data-tab-content="' + tabId + '"]').addClass('active');
    });
});
