/*global titles:true, sr1:true, sr2:true, i:true, score:true, solutions:true, limit:true, order:true, id:true, row:true, answer:true, answered:true */
function checkScore() {
  if (answered === solutions.length) {
    $("#titlecontainer").append("<div class='titlewrap'><h2>Congratulations!<h2><h3>Score: " + score + "/" + answered + "</h3></div>");
  }
}
$(document).ready(function () {
  $(".progress").hide();
  $("form").submit(function (e) {
    e.preventDefault();
    sr1 = $("#sr1").val().toLowerCase();
    sr2 = $("#sr2").val().toLowerCase();
    if (sr1 === "" || sr2 === "") {
      $("#message").html("You do realise you have to actually type something in, right?");
    } else if (sr1 === sr2) {
      $("#message").html("Stop trying to break me, you can't use the same two subreddits");
    } else {
      $("#message").html("");
      $("#titlecontainer").html("");
      score = 0;
      answered = 0;
      titles = [];
      solutions = [];
      limit = $("#limit").val();
      if (parseInt(limit, 10) < 1 || limit === "") {
        limit = "10";
      }
      order = $("#order").val();
      $.getJSON("http://www.reddit.com/r/" + sr1 + "+" + sr2 + "/" + order + ".json?jsonp=?&limit=" + limit, function (combined) {
        $.each(combined.data.children, function (i, data) {
          titles.push(data.data.title);
          lastsolution = data.data.subreddit;
          solutions.push(lastsolution.toLowerCase());
        });
      }).done(function () {
        for (i = 0; i < titles.length; i++) {
          $("#titlecontainer").append("<div class='titlewrap' id='titlewrap" + i + "'><h3 class='title' id='title" + i + "'>" + titles[i] + "</h3><p><button class='btn btn-success btn-choice' id='" + sr1 + i + "'>" + sr1 + "</button><button class='btn btn-warning btn-choice' id='" + sr2 + i + "'>" + sr2 + "</button></p></div>");
        }
      });
    }
  });
  $("#settings").click(function () {
    $(".settings").slideToggle(600);
  });
  $(document).on("click", ".btn-choice", function () {
    id = $(this).attr("id");
    row = id.replace(/\D/g, '');
    answer = id.replace(/\d+/g, '');
    $("#" + sr1 + row + ",#" + sr2 + row).attr("disabled", true);
    if (solutions[row] === answer) {
      $("#titlewrap" + row).css("background", "#47a447").slideUp(600);
      answered++;
      score++;
      checkScore();
    } else {
      $("#titlewrap" + row).css("background", "#d2322d").slideUp(600);
      answered++;
      checkScore();
    }
  });
});