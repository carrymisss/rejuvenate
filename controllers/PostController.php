<?php
require_once 'models/User.php';
class PostController
{
    public $model;
    public $view;
    public $user;

    function __construct()
    {
        $this->model = new Post();
        $this->user = new User();
    }

    function actionIndex()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $articles = $this->model->getAllArticles();
            if ($articles) {
                $data = [
                    'statusCode' => 200,
                    'articles'=>$articles,
                ];
            } else {
                $data = [
                    'statusCode' => 200
                ];
            }
            js_encodeN($data);
        }
    }

    function actionCreate()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $user_id = $this->user->isLogin()['id'];
            $user_data = [
              'id'=>$user_id,
              'title'=>$responce['title'],
              'text'=>$responce['text'],
              'type'=>$responce['type'],
              'slug'=>$responce['slug'],

            ];
            $create = $this->model->createArticle($user_data);
            if ($create) {
                $data = [
                    'create' => true,
                    'articleID'=>$create,
                ];
            } else {
                $data = ['create' => false];
            }
            js_encodeN($data);
        }
    }

    function actionFakerArticle()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $faker = Faker\Factory::create();

            for ($i = 0; $i < $responce['num']; $i++) {
                $user_id =
                $user_data = [
                    'id'=>$i,
                    'title'=>$faker->realText(12),
                    'text'=>$faker->realText(50),
                    'type'=>'public',
                    'slug'=>$faker->slug(20),

                ];
                $create = $this->model->createArticle($user_data);
            }
        }
    }

    function actionEditArticle()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $article_update_date = [
                'id'=>$responce["id"],
              'title'=>$responce['title'],
               'text'=>$responce['text'],
               'type'=>$responce['type'],
               'slug'=>$responce['slug'],
            ];

            $update = $this->model->Update($article_update_date);
            $article = $this->model->findArticle($responce["id"]);

            if ($update && $article){
                $data = [
                    'statusCode' => 200,
                    'title'=>$article['title'],
                    'slug'=>$article['slug'],
                    'text'=>$article['content'],
                    'state'=>$article['state'],
                        ];
            }else{
                $data = ['statusCode' => 404];
            }
            js_encodeN($data);
        }
    }


    function actionView()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $article = $this->model->findArticle($responce['id']);
            $user_data = $this->user->getUserById($article['creator_id']);
            if ($article){
                $data = [
                    'statusCode' => 200,
                    'user_id'=>$article['creator_id'],
                    'autor_fullname' =>$user_data['fullname'],
                    'username'=>$user_data['username'],
                    'article_id'=>$article['id'],
                    'title'=>$article['title'],
                    'slug'=>$article['slug'],
                    'text'=>$article['content'],
                    'state'=>$article['state'],
                    'date'=>$article['published_at'],
//                    'isMarked'=>true,
                ];
            }else{
                $data = ['statusCode' => 404];
            }
            js_encodeN($data);
        }
    }

    function actionChangeArticleType()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $article = $this->model->findArticle($responce["id"]);
            $article_type  = [
            'id'=> $responce['id'],
             'state'=>$responce['type'],
            ];
            $update_article = $this->model->UpdateArticleType($article_type);
            if ($article && $update_article){
                $data = ['statusCode' => 200];
            }else{
                $data = ['statusCode' => 404];
            }
            js_encodeN($data);
        }
    }

    function actionDelete()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $delete = $this->model->Delete($responce["id"]);
            if ($delete == 1){
                $data = ['statusCode' => 200];
            }else{
                $data = ['statusCode' => 404];
            }
            js_encodeN($data);
        }
    }

}

?>

