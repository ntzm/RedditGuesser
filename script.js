/*global j:true, temp:true, answered:true, score:true, answered:true, subs:true, limit:true, intlimit:true, tisol:true, i:true, order:true, id:true, row:true, answer:true, usephp:true */
function checkScore() {
  if (answered === tisol.length) {
    $("#titlecontainer").append("<div class='titlewrap'><h2>Congratulations!<h2><h3>Score: " + score + "/" + answered + "</h3></div>");
  }
}
function shuffleArray(array) {
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
$(document).ready(function () {
  console.log('“I would prefer even to fail with honor than to win by cheating” - Spohocles');
  $("#message").html("");
  $("#form-main").submit(function (e) {
    e.preventDefault();
    subs = [];
    subs.push($("#sr1").val().toLowerCase());
    subs.push($("#sr2").val().toLowerCase());
    if (subs[0] === "" || subs[1] === "") {
      $("#message").html("You do realise you have to actually type something in, right?");
    } else if (subs[0] === subs[1]) {
      $("#message").html("Stop trying to break me, you can't use the same two subreddits");
    } else {
      $("#message").html("");
      $("#titlecontainer").html("");
      score = 0;
      answered = 0;
      limit = $("#limit").val();
      intlimit = parseInt(limit, 10);
      if (intlimit < 1 || limit === "" || !/[0-9]/.test(limit)) {
        limit = "5";
      }
      tisol = [];
      for (i = 0; i < intlimit * subs.length; i++) {
        tisol[i] = [];
      }
      if ($("#usephp").is(":checked")) {
        usephp = 1;
      } else {
        usephp = 0;
      }
      order = $("#order").val();
      if (usephp === 1) {
        $.post("call.php", {limit: limit, order: order, sr: subs[0]}, function (result) {
          $.each(result.data.children, function (i, data) {
            tisol[i][0] = (data.data.title);
            tisol[i][1] = (data.data.subreddit).toLowerCase();
          });
        }, "json")
          .done(function () {
            $.post("call.php", {limit: limit, order: order, sr: subs[1]}, function (result) {
              $.each(result.data.children, function (i, data) {
                i = i + intlimit;
                tisol[i][0] = (data.data.title);
                tisol[i][1] = (data.data.subreddit).toLowerCase();
              });
            }, "json")
              .done(function () {
                tisol = shuffleArray(tisol);
                for (i = 0; i < tisol.length; i++) {
                  $("#titlecontainer").append("<div class='titlewrap' id='titlewrap" + i + "'><h3 class='title' id='title" + i + "'>" + tisol[i][0] + "</h3><p><button class='btn btn-default btn-choice' id='" + subs[0] + i + "'>" + subs[0] + "</button><button class='btn btn-default btn-choice' id='" + subs[1] + i + "'>" + subs[1] + "</button></p></div>");
                }
              })
              .fail(function () {
                $("#message").html("Subreddit does not exist or access to reddit is denied");
              });
          })
          .fail(function () {
            $("#message").html("Subreddit does not exist or access to reddit is denied");
          });
      } else {
        $.getJSON("http://www.reddit.com/r/" + subs[0] + "/" + order + ".json?jsonp=?&limit=" + limit, function (result0) {
          $.each(result0.data.children, function (i, data) {
            tisol[i][0] = (data.data.title);
            tisol[i][1] = (data.data.subreddit).toLowerCase();
          });
        })
          .done(function () {
            $.getJSON("http://www.reddit.com/r/" + subs[1] + "/" + order + ".json?jsonp=?&limit=" + limit, function (result1) {
              $.each(result1.data.children, function (i, data) {
                i = i + intlimit;
                tisol[i][0] = (data.data.title);
                tisol[i][1] = (data.data.subreddit).toLowerCase();
              });
            })
              .done(function () {
                tisol = shuffleArray(tisol);
                for (i = 0; i < tisol.length; i++) {
                  $("#titlecontainer").append("<div class='titlewrap' id='titlewrap" + i + "'><h3 class='title' id='title" + i + "'>" + tisol[i][0] + "</h3><p><button class='btn btn-default btn-choice' id='" + subs[0] + i + "'>" + subs[0] + "</button><button class='btn btn-default btn-choice' id='" + subs[1] + i + "'>" + subs[1] + "</button></p></div>");
                }
              })
              .fail(function () {
                $("#message").html("Subreddit does not exist or access to reddit is denied");
              });
          })
          .fail(function () {
            $("#message").html("Subreddit does not exist or access to reddit is denied");
          });
      }
    }
  });
  $(document).on("click", ".btn-choice", function () {
    id = $(this).attr("id");
    row = id.replace(/\D/g, '');
    answer = id.replace(/\d+/g, '');
    $("#" + subs[0] + row + ",#" + subs[1] + row).attr("disabled", true);
    if (tisol[row][1] === answer) {
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
  $("#settings").click(function () {
    $(".settings").slideToggle(600);
  });
  $("#settingsform").submit(function (e) {
    e.preventDefault();
  });
});