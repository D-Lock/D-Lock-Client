$(document).ready(function() {
  $(".file-list__file").click(function() {
    $(".file-list__file").removeClass("file-list__file--active");
    $(this).addClass("file-list__file--active");
  });
});