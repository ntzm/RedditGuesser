// Called every time the score increases
function checkScore() {
  // If number of guesses is equal to the number of solutions
  if (answered === solutions.length) {
    // Display score
    $("#titlecontainer").append("<div class='titlewrap'><h2>Congratulations!<h2><h3>Score: " + score + "/" + answered + "</h3></div>");
  }
}

$(document).ready(function () {
  // When the main form is submitted
  $("#form-main").submit(function (e) {
    // Stops the form from submitting
    e.preventDefault();
    // Defining subreddit array and validating inputs
    subs = [];
    subs.push($("#sr1").val().toLowerCase());
    subs.push($("#sr2").val().toLowerCase());
    if (subs[0] === "" || subs[1] === "") {
      // If the arrays items are blank, needs to be improved to check all the items in the array
      $("#message").html("You do realise you have to actually type something in, right?");
    } else if (subs[0] === subs[1]) {
      // If subreddits are the same, needs to be improved to check all the items in the array
      $("#message").html("Stop trying to break me, you can't use the same two subreddits");
    } else {
      // If everything is all good - reset all the variables and stuff to default
      $("#message").html("");
      $("#titlecontainer").html("");
      score = 0;
      answered = 0;
      titles = [];
      solutions = [];
      limit = $("#limit").val();
      // Limit validation, if limit is below 1, if limit is blank or if limit contains letters, set the limit to 5
      if (parseInt(limit, 10) < 1 || limit === "" || /[^0-9]/.test(limit)) {
        limit = "5";
      }
      order = $("#order").val();
      // Get reddit data for the selected subreddits, needs to be improved so each subreddit has its own call, to make the numbers of results equal
      $.getJSON("http://www.reddit.com/r/" + subs[0] + "+" + subs[1] + "/" + order + ".json?jsonp=?&limit=" + limit, function (combined) {
        // For each of the results push the title and solution to seperate arrays, needs to be improved to a 2d array so they can be scrambled
        $.each(combined.data.children, function (i, data) {
          titles.push(data.data.title);
          lastsolution = data.data.subreddit;
          // Turns the subreddits lower case so it validates with the user input
          solutions.push(lastsolution.toLowerCase());
        });
      })
        // If the call is successful
        .done(function () {
          // Displays a title and buttons for each result, needs to be improved to allow for infinite amount of subreddits
          for (i = 0; i < titles.length; i++) {
            $("#titlecontainer").append("<div class='titlewrap' id='titlewrap" + i + "'><h3 class='title' id='title" + i + "'>" + titles[i] + "</h3><p><button class='btn btn-choice' id='" + subs[0] + i + "'>" + subs[0] + "</button><button class='btn btn-choice' id='" + subs[1] + i + "'>" + subs[1] + "</button></p></div>");
          }
        })
        // If something bad happens, needs to be improved to explain to the user what is wrong
        .fail(function () {
          $("#message").html("Subreddit does not exist or access to reddit is denied");
        });
    }
  });

  // Open the settings
  $("#settings").click(function () {
    $(".settings").slideToggle(600);
  });

  // If the settings form is submitted, do nothing
  $("#settingsform").submit(function (e) {
    e.preventDefault();
  });

  // If a choice button is clicked
  $(document).on("click", ".btn-choice", function () {
    // Defining variables
    id = $(this).attr("id");
    // Splits the id into two parts
    row = id.replace(/\D/g, '');
    answer = id.replace(/\d+/g, '');
    // Disables the buttons
    $("#" + subs[0] + row + ",#" + subs[1] + row).attr("disabled", true);
    // If the answer is correct
    if (solutions[row] === answer) {
      // Make the background green and slide up
      $("#titlewrap" + row).css("background", "#47a447").slideUp(600);
      // Add to answered and score
      answered++;
      score++;
      checkScore();
    } else {
      // Make the background red and slide up
      $("#titlewrap" + row).css("background", "#d2322d").slideUp(600);
      // Add to answered
      answered++;
      checkScore();
    }
  });
});