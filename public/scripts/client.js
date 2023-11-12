/**
 * cross site scripting escape function definition
 * @param {String} str 
 * @returns 
 */
const safeHTML = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

/**
 * Document Dot Ready function
 */
$(document).ready(function () {

  /**
   * createTweetElement function definition
   * @param {Object} tweetObj 
   * @returns 
   */
  const createTweetElement = function (tweetObj) {
    const $tweet = $(`
  <article class="tweet">
          <header>
            <ul>
              <div class="user-info">
                <li class="user-picture"><img src="${tweetObj.user.avatars}" alt="beautiful face avatar" /></li>
                <li class="user-name">${tweetObj.user.name}</li>
              </div>
              <li class="tweeter-handle">${tweetObj.user.handle}</li>
            </ul>
          </header>
          <textarea name="text" readonly id="tweet-text">${safeHTML(tweetObj.content.text)}</textarea>
          <footer>
            <ul>
              <li>${timeago.format(tweetObj.created_at)}</li>
              <div class="icons">
                <li><i class="fa-solid fa-flag"></i></li>
                <li><i class="fa-solid fa-retweet"></i></li>
                <li><i class="fa-sharp fa-solid fa-heart"></i></li>
              </div>
            </ul>
          </footer>
  </article>
  `);
    return $tweet;
  }
  /**
   * renderTweets function definition
   * @param {Array} tweets 
   */
  const renderTweets = function (tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container

    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $(".tweet-container").prepend($tweet);
    }
  };

  /**
   * loadTweets function definition
   */
  const loadTweets = function () {
    const url = "/tweets";
    $.get(url, function (data) {
      renderTweets(data);
    });
  }
  
  // Hide error message if no error and/or tweeth length within limit.
  $("#tweet-text").on("focus", function (event) {
    const textValue = $(this).val();
    const tweetLength = textValue.length;
    const errorMessage = $(".error-message").css("display");

    if (tweetLength <= 140) {
      if (errorMessage !== "none") {
        $(".error-message").slideUp("slow");
        return;
      }
    }
  });

  ///////////////////////////////////
  // tweet form submission using AJAX
  ///////////////////////////////////
  $("form").on("submit", function (event) {
    event.preventDefault();
    const url = "/tweets/";
    const postData = $(this).serialize();
    const textValue = $(this).find("#tweet-text").val();
    const tweetLength = textValue.length;

    // at the start no error message
    $errorMessage = $(".error-message").css("display", "none");

    if (!textValue) {
      $errorMessage.text("You cannot post an empty tweet!");
      $(".new-tweet").prepend($errorMessage);
      $errorMessage.slideDown("slow");
      return;
    }
    if (tweetLength > 140) {
      $errorMessage.text("Your tweet is exceeding the max charac limit!");
      $(".new-tweet").prepend($errorMessage);
      $errorMessage.slideDown("slow");
      return;
    }
    $.post(url, postData)
      .then(function () {
        //empty out the previous hardcoded starting tweets
        $(".tweet-container").empty();
        loadTweets();
        //clear textbox and counter
        $("form").find("#tweet-text").val("");
        $(".counter").val(140);
      });
  });
  loadTweets();

});