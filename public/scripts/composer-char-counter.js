$(document).ready(function() {
  $("#tweet-text").on("keyup", function() {
    
    const maxTweetLength = 140;
    const counterDomMarker = $(this).siblings("#tweet-submit").children(".counter");
    let currentTweetLength = $(this).val().length;
    let charsAvailable = maxTweetLength - currentTweetLength;
    
    counterDomMarker.text(charsAvailable);

    charsAvailable <= 0? counterDomMarker.addClass("counter-negative"): counterDomMarker.removeClass("counter-negative"); 
  });
});