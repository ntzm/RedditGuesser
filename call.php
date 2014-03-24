<?php
echo file_get_contents("http://www.reddit.com/r/" . $_POST["sr"] . "/" . $_POST["order"] . ".json?limit=" . $_POST["limit"]);
?>