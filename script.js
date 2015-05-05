/**
 * Reddit Guesser
 *
 * @author  Nat Zimmermann <nat@natzim.me>
 * @version 1.2.2
 */

var app = {
  from: false,

  /**
   * Set the message
   *
   * @param {String} text - Message to show
   */
  setMessage: function (text) {
    $('#message').html(text);
  },

  /**
   * Process response from reddit API
   *
   * @param {Array} data - Array of objects returned by reddit API
   */
  processResponse: function (data) {
    var i;
    var posts = shuffleArray(data.data.children);
    this.posts = posts;

    var subButtons = '';

    i = this.subs.length;
    while (i--) {
      var sub = this.subs[i];

      subButtons += '<button class="btn btn-default btn-choice">' + sub + '</button>';
    }

    i = posts.length;
    while (i--) {
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
   * @param {String} answer          - Subreddit name
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
   * Attempt to submit the form
   *
   * @param {Array}  subs  - Array of subreddit names
   * @param {Number} limit - Maximum number of results to retrieve
   * @param {String} order - Order of results
   * @param {String} from  - When the results should be from
   */
  submitForm: function(subs, limit, order, from) {
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
          $('#subreddit-container > .input-group').addClass('has-error');
          break;
        case 503: // Service unavailable
          app.setMessage('Reddit is down. Please try again later.');
          break;
        default:
          app.setMessage('Something went wrong and we\'re not quite sure what. Error: ' + jqXHR.status + ' ' + jqXHR.statusText);
      }
    });
  }
};

/*
 * Events
 */

// When the main form is submitted
$("#form-main").submit(function(e) {
  $('#subreddit-container > .input-group').removeClass('has-error');

  var validated = true;

  var subs = $(this).serializeArray().map(function(object) {
    return object.value;
  });

  for (var i = 0; i < subs.length; i++) {
    var sub = subs[i];

    if (sub.trim() === "") {
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
    $('#subreddit-container > .input-group').addClass('has-error');
  }
});

// When a button choice is clicked
$(document).on('click', '.btn-choice', function() {
  var $element        = $(this),
      $titleContainer = $element.closest('.title-wrap');

  app.processAnswer(
    $titleContainer,
    $element.html()
  );
});

// Scroll to the top of the page
$(document).on('click', '.scroll-top', function() {
  scrollTo('top');
});

// Prevent any form from reloading the page
$('form').submit(function(e) {
  e.preventDefault();
});

// Only enable 'from' dropdown on appropriate orders
$('#order').change(function() {
  var order = $(this).val();

  if (order === 'top' || order === 'controversial') {
    $('#from').prop('disabled', false);
    app.from = true;
  } else {
    $('#from').prop('disabled', true);
    app.from = false;
  }
});

$('#btn-add-subreddit').click(function(e) {
  e.preventDefault();
  $('#subreddit-container').append(
    '<div class="input-group form-group">' +
      '<div class="input-group-addon">/r/</div>' +
      '<input type="text" class="form-control" name="subs[]" autocorrect="off" autocapitalize="off" maxlength="20">' +
      '<span class="input-group-btn">' +
        '<a tabindex="-1" class="btn btn-danger btn-remove-subreddit">&times;</a>' +
      '</span>' +
    '</div>'
  );
});

$(document).on('click', '.btn-remove-subreddit', function(e) {
  e.preventDefault();
  $(this).closest('.form-group').remove();
});

/*
 * Helper functions
 */

/**
 * Randomly shuffle an array
 *
 * @param  {Array} array - Un-shuffled array
 * @return {Array}       - Shuffled array
 */
function shuffleArray(array) {
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
 * @param {String|Object} target       - jQuery object or 'top' or 'bottom'
 * @param {Number}        [speed=1000] - Time in milliseconds for the scroll to take
 */
function scrollTo(target, speed) {
  speed = speed || 1000;

  switch (target) {
    case 'top':
      target = 0;
      break;

    case 'bottom':
      target = $('body').height();
      break;

    default:
      target = target.offset().top;
  }

  $('body').animate({
    scrollTop: target
  }, speed);
}
