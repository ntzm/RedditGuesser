/*global titles:true, sr1:true, sr2:true, i:true*/
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
function choiceClick(id) {
  console.log(id);
  wrapid = id.replace(/\D/g,'');
  solution = id.replace(/\d+/g, '');
  $("#titlewrap" + wrapid).css("background", "#000");
  if (solution === "left") {
    solution = "1";
  } else {
    solution = "2";
  }
  if (solutions[wrapid] === solution) {
    $("#titlewrap" + wrapid).css("background", "#47a447");
  } else {
    $("#titlewrap" + wrapid).css("background", "#d2322d");
  }
}
$(document).ready(function () {
  $(".progress").hide();
  $("form").submit(function (e) {
    e.preventDefault();
    sr1 = $("#sr1").val();
    sr2 = $("#sr2").val();
    if (sr1 === "" || sr2 === "") {
      $(".message").html("You do realise you have to actually type something in, right?");
    } else if (sr1 === sr2) {
      $(".message").html("Stop trying to break me, you can't use the same two subreddits");
    } else {
      $(".progress").show();
      $(".progress-bar").css("width", "0");
      $(".progress-bar").attr("aria-valuenow", "0");
      $(".progress-bar>span").html("0%");
      $(".message").html("");
      $(".titlecontainer").html("");
      titles = [];
      solutions = [];
      $.getJSON("http://www.reddit.com/r/" + sr1 + ".json?jsonp=?&limit=5", function (sr1) {
        $.each(sr1.data.children, function (i, sr1data) {
          titles.push(sr1data.data.title + "1");
        });
      }).done(function () {
        $(".progress-bar").css("width", "100%");
        $(".progress-bar").attr("aria-valuenow", "100");
        $(".progress-bar>span").html("100%");
        $.getJSON("http://www.reddit.com/r/" + sr2 + ".json?jsonp=?&limit=5", function (sr2) {
          $.each(sr2.data.children, function (i, sr2data) {
            titles.push(sr2data.data.title + "2");
          });
        }).done(function () {
          $(".progress").hide();
          titles = shuffleArray(titles);
          for (i = 0; i < titles.length; i++) {
            solutions[i] = titles[i].substr(titles[i].length - 1);
          }
          for (i = 0; i < titles.length; i++) {
            titles[i] = titles[i].slice(0, -1);
          }
          for (i = 0; i < titles.length; i++) {
            $(".titlecontainer").append("<div class='titlewrap' id='titlewrap" + i + "'><h3 class='title' id='title" + i + "'>" + titles[i] + "</h3><p><button onclick='choiceClick(\"left" + i + "\")' class='btn btn-success btn-choice' id='buttonleft" + i + "'>" + sr1 + "</button><button onclick='choiceClick(\"right" + i + "\")' class='btn btn-warning btn-choice' id='buttonright" + i + "'>" + sr2 + "</button></p></div>");
          }
        });
      });
    }
  });
  $("#about").click(function () {
    $(".about").slideToggle(600);
  });
});