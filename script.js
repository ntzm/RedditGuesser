/**
 * Reddit Guesser
 *
 * @author  Nat Zimmermann <nat@natzim.me>
 * @version 1.1.0
 */

var app = {
  from: false,

  /**
   * Set the message
   *
   * @param {string} text - Message to show
   */
  setMessage: function (text) {
    $('#message').html(text);
  },

  /**
   * Process response from reddit API
   *
   * @param {array} data - Array of objects returned by reddit API
   */
  processResponse: function (data) {
    var posts = shuffleArray(data.data.children);
    this.posts = posts;

    var subButtons = '';

    for (var i = 0; i < this.subs.length; i++) {
      var sub = this.subs[i];

      subButtons += '<button class="btn btn-default btn-choice">' + sub + '</button>';
    }

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i].data;

      $('#title-container').append(
        '<div class="title-wrap panel panel-default" data-index="' + i + '">' +
          '<div class="panel-heading">' +
            '<h3 class="title">' + post.title + '</h3>' +
          '</div>' +
          '<div class="panel-body">' +
            '<div class="btn-group btn-group-lg">' +
              subButtons +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    scrollTo($('#title-container'));

    $('#btn-submit').button('reset');
  },

  /**
   * Test if answer is correct
   *
   * @param {Object} $titleContainer - jQuery Object of the title container
   * @param {string} answer          - Subreddit name
   */
  processAnswer: function ($titleContainer, answer) {
    var index = $titleContainer.data('index');

    if (this.posts[index].data.subreddit.toLowerCase() === answer.toLowerCase()) {

      // Correct
      this.score++;
      $titleContainer.addClass('panel-success');
    } else {

      // Incorrect
      $titleContainer.addClass('panel-danger');
    }

    this.answered++;
    $titleContainer.find('.btn-choice').prop('disabled', true);

    if (this.answered >= this.posts.length) {

      // Complete
      $('#title-container').append(
        '<div class="panel panel-success">' +
          '<div class="panel-body">' +
            '<p class="lead">Congratulations! You got ' + this.score + '/' + this.answered + '!</p>' +
            '<a class="btn btn-success scroll-top">Try again</a>' +
          '</div>' +
        '</div>'
      );

      scrollTo('bottom');
    }
  },

  /**
   * Attempts to submit the form
   *
   * @param {array}  subs  - Array of subreddit names
   * @param {number} limit - Maximum number of results to retrieve
   * @param {string} order - Order of results
   * @param {string} from  - When the results should be from
   */
  submitForm: function (subs, limit, order, from) {
    // Set variables
    this.score    = 0;
    this.answered = 0;

    this.subs = subs;

    // Clear HTML containers
    this.setMessage('');
    $('#title-container').html('');

    var request = $.ajax({
      url: 'http://www.reddit.com/r/' + subs.join('+') + '/' + order + '.json?jsonp=app.processResponse' + (this.from ? '&t=' + from : '') + '&limit=' + limit,
      type: 'get'
    });

    request.fail(function(jqXHR) {

      $('#btn-submit').button('reset');

      // TODO: Add more status cases
      switch (jqXHR.status) {
        case 404: // Not found
          app.setMessage('These subreddits do not exist.');
          break;
        default:
          app.setMessage('Something went wrong and we\'re not quite sure what. Error: ' + jqXHR.status + ' ' + jqXHR.statusText);
      }
    });
  }
};

/**
 * Events
 */

// When the main form is submitted
$("#form-main").submit(function (e) {
  var validated = true;

  var subs = $(this).serializeArray().map(function (object) {
    return object.value;
  });

  for (var i = 0; i < subs.length; i++) {
    var sub = subs[i];

    if (sub === "") {
      validated = false;
    }
  }

  if (validated) {
    $('#btn-submit').button('loading');

    app.submitForm(
      subs,
      $('#limit').val(),
      $('#order').val(),
      $('#from').val()
    );
  } else {
    app.setMessage('Please fill in all of the inputs!');
    return false;
  }
});

// When a button choice is clicked
$(document).on('click', '.btn-choice', function () {
  var $element        = $(this),
      $titleContainer = $element.closest('.title-wrap');

  app.processAnswer(
    $titleContainer,
    $element.html()
  );
});

// Scroll to the top of the page
$(document).on('click', '.scroll-top', function () {
  scrollTo('top');
});

// Prevent any form from reloading the page
$('form').submit(function (e) {
  e.preventDefault();
});

// Only enable 'from' dropdown on appropriate orders
$('#order').change(function () {
  if ($(this).val() === 'top' || $(this).val() === 'controversial') {
    $('#from').prop('disabled', false);
    app.from = true;
  } else {
    $('#from').prop('disabled', true);
    app.from = false;
  }
});

/**
 * Helper functions
 */

/**
 * Randomly shuffle an array
 *
 * @param  {array} array - Un-shuffled array
 * @return {array}       - Shuffled array
 */
function shuffleArray (array) {
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Scrolls the page to a given element
 *
 * @param {string|Object} target       - jQuery object or 'top' or 'bottom'
 * @param {int}           [speed=1000] - Time in milliseconds for the scroll to take
 */
function scrollTo (target, speed) {
  speed = speed || 1000;

  switch (target) {
    case 'top':
      target = 0;
      break;

    case 'bottom':
      target = $('body').height();
      break;

    default:
      target = target.offset().top
  }

  $('body').animate({
    scrollTop: target
  }, speed);
}
