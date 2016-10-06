$(document).ready(function() {
  $(".download-button").click(function() {
    var downloadButton = $(this);
    var buttonGroup = downloadButton.parent();
    downloadButton.addClass("download-button__activated");
    
    var progress = $(".download-button__progress", this);
    progress.show();
    progress.animate({
      width: '100px'
    }, 2000, function() {   
      var text = $(".download-button__text", buttonGroup);
      text.animate({
        opacity: 1
      }, 200);
      
      setTimeout(function() {
        progress.hide();
        progress.css('width', '0px');
        text.css('opacity', 0);
        downloadButton.removeClass("download-button__activated");
      }, 3000);
    });
  });
});