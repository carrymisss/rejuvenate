<?php
require_once 'models/Post.php';
class UserController
{
    public $model;
    public $post;

    function __construct()
    {
        $this->model = new User();
        $this->post = new Post();
    }

    public static function transport()
    {
        return $transport = (new Swift_SmtpTransport('smtp.gmail.com', 587, 'tls'))
            ->setUsername('leafletverify@gmail.com')
            ->setPassword('leaflet2020');
    }

    function actionInitial()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $user = $this->model->isLogin();
            if ($user !== false) {
                $userImg = $this->model->getImg();
                $userImg = stripslashes($userImg["avatar"]);
                $data = [
                    'isUserLogin' => true,
                    'currentUserName' => $user['username'],
                    'currentUserFullname' => $user['fullname'],
                    'currentUserEmail' => $user['email'],
                    'currentUserAvatar' => $userImg,
                    'currentAccountID' => $user["id"],
                    'isVerify' => $this->verify_bool($user['verify']),
                ];
            } else {
                $data = [
                    "isUserLogin" => false,
                ];
            }
            js_encodeN($data);

        }
    }

    function verify_bool($data)
    {
        $arr = [false,true];
        return $arr[$data];
    }

    function actionLogout()
    {
        if ($this->model->logOut()) {
            js_encodeN([
                'isUserLogin' => false,
            ]);
        }
    }

    function actionLogin()
    {

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $username = $responce['username'];
            $userpass = $responce['password'];
//            $remember = $responce['rememberMe'];
            $query = $this->model->getUser($username);
            if ($query !== false) {

                if (password_verify($userpass, $query['password'])) {

                    $this->model->getLogin($username);

                    $data = ['loginStatus' => 200];
                } else {
                    $data =['loginStatus' => 404];
                }

            } else {
                $data = ['loginStatus' => 404];
            }
            js_encodeN($data);
        }
    }

    function actionRegistration()
    {

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();

            $email = $responce['email'];
            $password = $responce['password'];
            $username = $responce['username'];
            $fullname = $responce['fullname'];
            $db_check = $this->model->getUser($username);
            $user_img = file_get_contents(__DIR__.'/../public/images/user_avatar.bin');

            if (!empty($db_check)) {
                $data = ['registerStatus' => 404,
                    'errors' => array('username' => 'exist')];
            } else {
                $userData = [
                    'username' => $username,
                    'password' => password_hash($password, PASSWORD_DEFAULT),
                    'email' => $email,
                    'fullname' => $fullname,
                    'token' => bin2hex(random_bytes(50)),
                ];

                $user_create = $this->model->addUser($userData);
                if ($user_create) {
                    $this->model->addImg($user_img,$user_create);
                    $this->model->getLogin($username);
                    $data = ['registerStatus' => 200];
                } else {
                    $data = ['registerStatus' => 404];
                }
            }

            js_encodeN($data);
        }
    }

    function actionFakerAcc()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $faker = Faker\Factory::create();

            for ($i = 0; $i < $responce['num']; $i++) {
                $user_img = file_get_contents(__DIR__ . '/../public/images/user_avatar.bin');
                $pass = $faker->password;
                $userData = [
                    'username' => $faker->userName,
                    'password' => password_hash($pass, PASSWORD_DEFAULT),
                    'email' => $faker->freeEmail(),
                    'fullname' => $pass,
                    'token' => bin2hex(random_bytes(50)),
                ];

                $user_create = $this->model->addUser($userData);
                if ($user_create) {
                    $this->model->addImg($user_img, $user_create);
                }
            }
        }
    }

    function actionSearch()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $search = $this->model->searchUser($responce['search']);
            if ($search) {
                $data = [
                    'statusCode' => 200,
                    'result'=>$search,
                    ];
            } else {
                $data = ['statusCode' => 404];
            }
            js_encodeN($data);
        }
    }

    function actionUserpage()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();

            $user = $this->model->getUser($responce['user_name']);
            if ($user !== null) {
                $user_articles = $this->post->getUserArticles($user['id']);
                $userImg = $this->model->getImg($user['id']);
                $userImg = stripslashes($userImg['avatar']);
                $is_user_following = $this->model->followChose($user['id']);
                $user_followers = $this->Followers($user['id']);
                $user_following = $this->Following($user['id']);
//                $user_pins = $this->UserPins($user['id']);

//                $user_marks = $this->model->getUserMarks();

                $data = [
                    'statusCode' => 200,
                    'userUsername' => $user['username'],
                    'userFullname' => $user['fullname'],
                    'userAvatar' => $userImg,
                    'accountID' => $user['id'],
                    'isUserFollowing' => $is_user_following,
//                    'isUserMarked' => true,

//                    'userPins' => $user_pins,

                    'userArticles' => $user_articles,

                    'userFollowers' => $user_followers,
                    'userFollowing' => $user_following,
                ];
            } else {
                $data = [
                    'statusCode' => 404
                ];
            }
            js_encodeN($data);
        }
    }

    function actionUpdateImg()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $img = $this->model->addImg(addslashes($responce['newAvatar']));
            if ($img !== null && $img !== false) {
                $data = [
                    'statusCode' => 200
                ];
            } else {
                $data = [
                    'statusCode' => 404
                ];
            }
            js_encodeN($data);
        }
    }

    function actionDeleteAccount()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $user_id = $responce['id'];

            if ($this->model->isLogin()["id"] === $user_id) {

                $del = $this->model->deleteAccount($user_id);
                if ($del > 0) {

                    $this->model->logOut();
                    $data = ['statusCode' => 200];
                } else {
                    $data = ['statusCode' => 404];
                }

            } else {
                $data = ['statusCode' => 404];
            }

            js_encodeN($data);
        }
    }

    function actionSettingsInfo()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $curent_data = $this->model->isLogin();
            $errors = [];
            $new_user_data['id'] = $curent_data['id'];

            if ($responce['username'] === $curent_data['username']){
                $new_user_data['username'] = $curent_data['username'];

            }
            else{
                if($this->model->getUser($responce['username']) === null){
                    $new_user_data['username'] = $responce['username'];
                }
                else{
                    $new_user_data['username'] = $curent_data['username'];
                    $errors['username'] = false;
                }
            }

            if ($responce['fullname'] === $curent_data['fullname']){
                $new_user_data['fullname'] = $curent_data['fullname'];
            }else{
                $new_user_data['fullname'] = $responce['fullname'];
            }

            $status = $this->model->updateUserInfo($new_user_data);
            if (count($errors) === 0){
                $this->model->getLogin($new_user_data['username']);
                $data = [
                    'statusCode' => 200,
                ];
            }else{
                $data = [
                    'statusCode' => 404,
                ];
            }

            js_encodeN($data);
        }
    }

    function actionSettingsEmail()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $curent_data = $this->model->isLogin();

            $new_user_data['id'] = $curent_data['id'];

            if ($responce['email'] === $curent_data['email'] || empty($responce['email'])){
                $new_user_data['email'] = $curent_data['email'];
            }else{
                $update_token = $this->model->updateUserToken(bin2hex(random_bytes(50)), $new_user_data['id'],'0');
                $new_user_data['email'] = $responce['email'];
            }

            $status = $this->model->updateUserEmail($new_user_data);

            if ($status){
                $data = [
                    'statusCode' => 200,
                ];
            }else{
                $data = [
                    'statusCode' => 404,
                ];
            }

            js_encodeN($data);
        }
    }

    function actionSettingsPassword()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            $curent_data = $this->model->isLogin();
            $errors = null;
            $new_user_data['id'] = $curent_data['id'];

            if (!password_verify($responce['oldPassword'], $curent_data['password']) || empty($responce['oldPassword']) || empty($responce['newPassword']) ){
                $new_user_data['new_password'] = $curent_data['password'];
                $errors = false;
            }else{
                $new_user_data['new_password'] = password_hash($responce['newPassword'], PASSWORD_DEFAULT);
            }

            $status = $this->model->updateUserPassword($new_user_data);

            if ($errors === null){
                $data = [
                    'statusCode' => 200,
                ];
            }else{
                $data = [
                    'statusCode' => 404,
                ];
            }

            js_encodeN($data);
        }
    }

    function actionEmailSend()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();

            $mailer = new Swift_Mailer(self::transport());

            $user_data = $this->model->isLogin();

            $email = file_get_contents(__DIR__.'/../emails/verify.html');
            $email = str_replace(['user_nickname','email_to_verify','link_to_verify'], [$user_data['username'], $user_data['email'], $_SERVER['HTTP_HOST']."/api/user/emailverify/".$user_data['token']], $email) ;


            $message = (new Swift_Message('Будь-ласка підтвердіть свій E-mail 📧'))
                ->setFrom(['leafletverify@gmail.com' => 'Leaflet Support'])
                ->setTo([$user_data['email']])
                ->setBody($email)
                ->setContentType('text/html')

            ;

            $result = $mailer->send($message);

            if ($result){
                $data = [
                    'statusCode' => 200,
                ];
            }else{
                $data = [
                    'statusCode' => 404,
                ];
            }
            js_encodeN($data);
        }
    }

    function actionEmailVerify($data)
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {


            if ($data !== null) {
                $user_current = $this->model->tokenVerify($data);
                if (array_key_exists('token',$user_current)) {
                    $update_token = $this->model->updateUserToken(bin2hex(random_bytes(50)), $user_current['id'],'1');
                }
                $this->closeTab();
            }
        }
    }

    function closeTab()
    {
        echo  "<script type='text/javascript'>";
        echo "window.close();";
        echo "</script>";
        die();
    }

    function actionUserFollowing()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $responce = js_responce();
            if ($this->model->followChose($responce['user_id'])) {
                if ($this->model->getUnfollow($responce['user_id'])) {
                    $data = [
                        'unFollowed' => 200,
                    ];
                } else {
                    $data = [
                        'unFollowed' => 404,
                    ];
                }

            } else {
                if ($this->model->getFollow($responce['user_id'])) {
                    $data = [
                        'followed' => 200,
                    ];
                } else {
                    $data = [
                        'followed' => 404,
                    ];
                }
            }
            js_encodeN($data);
        }
    }


    function Followers($user_id = null)
    {
        $users = $this->model->getFollowers($user_id);
        foreach ($users as $key => $user) {
            $users[$key]['isUserFollowing'] = $this->model->followChose($user['id']);
        }
        return $users;

    }

    function Following($user_id = null)
    {
        $users = $this->model->getFollowings($user_id);
        foreach ($users as $key => $user) {
            $users[$key]['isUserFollowing'] = $this->model->followChose($user['id']);
        }
        return $users;
    }

//    function actionArticleToBooksmarks()
//    {
//        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//            $responce = js_responce();
//
//            js_encodeN($data);
//        }
//    }
//
//    function actionAddArticleToBooksmarks()
//    {
//        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//            $responce = js_responce();
//            var_dump($responce);
//            js_encodeN($data);
//        }
//    }
//
//    function actionAddUserToBookmarks()
//    {
//        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//            $responce = js_responce();
//            if ($this->model->getUserMarksState($responce['user_id'])) {
//                if ($this->model->getUnMarksUser($responce['user_id'])) {
//                    $data = array(
//                        "unFollowed" => 200,
//                    );
//                } else {
//                    $data = array(
//                        "unFollowed" => 404,
//                    );
//                }
//
//            } else {
//                if ($this->model->getMarksUser($responce['user_id'])) {
//                    $data = array(
//                        "followed" => 200,
//                    );
//                } else {
//                    $data = array(
//                        "followed" => 404,
//                    );
//                }
//            }
//            js_encodeN($data);
//        }
//    }
//
//    function actionBookmarks()
//    {
//        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//            $user_id = $this->isLogin()['id'];
//                $article_marks = $this->model->getArticleMarks($user_id);
//            $user_marks = $this->model->getUserMarks($user_id);
//            var_dump($user_marks);
//                if ($delete == 1){
//            $data = array(
//                'statusCode' => 200,
//                'bookmarksUsers' => [
//
//                ]
//            );
//                }else{
//                    $data = array("statusCode" => 404);
//                }
//                echo js_encode($data);
//        }
//    }
//
//    function actionSqltest()
//    {
//        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//            $user_id = $this->user->isLogin()['id'];
//            $article_marks = $this->model->getArticleMarks($user_id);
//                $user_marks = $this->model->getUserMarks($user_id);
//            var_dump($article_marks[0]);
//                if ($delete == 1){
//                    $data = array("statusCode" => 200);
//                }else{
//                    $data = array("statusCode" => 404);
//                }
//                echo js_encode($data);
//        }
//    }
//    function UserPins($user_id)
//    {
//            return $user_pins = $this->model->getUserPins($user_id);
//    }
//
//    function actionEditPins()
//    {
//        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//            $responce = js_responce();
//            $user = $this->model->isLogin();
//            if ($user){
//                $user_articles = $this->post->getPublicUserArticles($user['id']);
//                foreach ($user_articles as $key => $user_article) {
//                    $user_articles[$key]['isPined'] = $this->model->isPined($user_article['id'],$user['id']);
//                }
//                $data = array(
//                    'statusCode' => 200,
//                    'pins'=>$user_articles,
//                );
//            }else{
//                $data = array(
//                    'statusCode' => 404
//                );
//            }
//
//            js_encodeN($data);
//        }
//    }
//
//        function actionAddUserPin()
//    {
//        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//            $responce = js_responce();
//            var_dump($this->model->getAddUserPins(3,1));
//            js_encodeN($data);
//        }
//    }
}
?>
