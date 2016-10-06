$(".side-nav__expand-button").click(function() {
  $(".side-nav").removeClass("side-nav__collapsed");
});

$(".side-nav__collapse-button").click(function() {
  $(".side-nav").addClass("side-nav__collapsed");
});

$(".side-nav__link").click(function() {
  $(".side-nav__link").removeClass("side-nav__link--active");
  $(this).addClass("side-nav__link--active");
});