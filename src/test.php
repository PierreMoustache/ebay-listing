<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>title</title>
  </head>
  <body>
    <h1>PHP test</h1>
    <?php
    // $ip = $_SERVER['REMOTE_ADDR'];
    $browser = $_SERVER['HTTP_USER_AGENT'];
    $language = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    // $referingURL = $_SERVER['HTTP_REFERER'];
    // $currentPage = $_SERVER['REQUEST_URI'];

    // echo "$ip </br";
    echo "$browser </br";
    echo "$language </br";
    // echo "$referingURL </br";
    // echo "$currentPage </br";
    ?>
  </body>
</html>
