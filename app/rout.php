<?php
class Route
{
    static function start()
    {
//        $controller_name = 'Post';
//        $action_name = 'Index';
        $action_data = null;
        $routes = explode('/', $_SERVER['REQUEST_URI']);
//        var_dump($routes);

        if ($routes[1] === "api"){


        if ( !empty($routes[2])){
            $controller_name = $routes[2];
        }
        if ( !empty($routes[3])){
            $action_name = $routes[3];
        }
        if ( !empty($routes[4])){
            $action_data = $routes[4];
        }

        $model_name = $controller_name;
        $controller_name = ucfirst($controller_name).'Controller';
        $action_name = 'action'.ucfirst($action_name);

        $model_file = ucfirst($model_name).'.php';
        $model_path = "models/".$model_file;
        if(file_exists($model_path)){
            include "models/".$model_file;
        }

        $controller_file = $controller_name.'.php';
        $controller_path = "controllers/".$controller_file;
        if(file_exists($controller_path)){
            include "controllers/".$controller_file;
        } else {
            Route::ErrorPage404();
        }
        $controller = new $controller_name;
        $action = $action_name;
        if(method_exists($controller, $action)){
            $controller->$action($action_data);
        } else {
            Route::ErrorPage404();
        }
        }
        else{
            require "build/index.html";
        }
    }

    static function ErrorPage404()
    {
        header("Location: /site/404");
    }

    static function ErrorPage403()
    {
        header("Location: /site/403");
    }
}