<?php
session_start();

error_reporting(E_ALL);

require_once 'app/db.php';
require 'vendor/autoload.php';
$whoops = new \Whoops\Run;
$whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
$whoops->register();






function e($data)
{
    return htmlspecialchars($data);
}

function js_responce()
{
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    return json_decode($rest_json, true);
}

function js_encode($data,$param=null)
{
    return json_encode($data,$param);
}

function js_encodeN($data,$param=null)
{
    // header('Content-Type: application/json');
    echo json_encode($data,$param);
    die();
}

require_once 'app/rout.php';
Route::start();


?>
