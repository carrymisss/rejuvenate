<?php
class User
{
    public $db;

    function __construct()
    {
        $this->db = new DB;
    }

    function getLogin($name)
    {
        if(!is_null($name))
        {
            $_SESSION['login_user'] = $name;
            return true;
        }else
        {
            return false;
        }
    }

    function logOut()
    {
        return session_destroy();

    }

    function isLogin()
    {
        return isset($_SESSION['login_user']) ? $this->getUser($_SESSION['login_user']) : false;
    }

    function getUser($user)
    {
        $user = $this->db->getAll("SELECT * FROM `users`  WHERE `username` = ?", $user );
        if (empty($user))
        {
            return null;
        }else{
            return $user[0];
        }
    }

    function tokenVerify($token)
    {
        $user = $this->db->getAll("SELECT id, token FROM `users`  WHERE `token` = ?", $token );
        if (empty($user))
        {
            return $user;
        }else{
            return $user[0];
        }
    }

    function getUserById($id)
    {
        $user = $this->db->getAll("SELECT * FROM `users`  WHERE `id` = ?", $id );

        if (empty($user))
        {
            return false;
        }else{
            return $user[0];
        }
    }

    function searchUser($search=null)
    {
        if (empty($search) || $search===null)
        {
            return null;
        }else{
            return $user = $this->db->getAll("SELECT users.id,users.username,users.fullname,user_avatar.avatar
FROM users         ,user_avatar
WHERE user_avatar.user_id = users.id
    AND users.username 
LIKE CONCAT('%',?,'%')",$search);
        }
    }

    function getImg($user=null)
    {
        if ($user===null)
        {
            $user = $this->isLogin()['id'];
        }
            return $this->db->getRow("SELECT * FROM `user_avatar` WHERE `user_id`= ?",$user);
    }

    function addImg($img,$user=null)
    {
        if ($user===null){
            $user = $this->isLogin()['id'];
        }

        $img_data = $this->db->getRow("SELECT * FROM `user_avatar` WHERE `user_id`= ?",$user);
        if (empty($img_data))
        {
            return $this->db->add("INSERT INTO `user_avatar` (`user_id`,`avatar`) VALUE (?,?)",array($user,$img));
        }else
        {
            return $this->db->set("UPDATE `user_avatar` SET `avatar`= ? WHERE `user_id`= ?", array($img,$user));
        }
    }

    function addUser($user_data)
    {
        return $this->db->add("INSERT INTO `users` (`username`,`password`,`fullname`,`email`,`token`) VALUE (?,?,?,?,?)",array($user_data['username'],$user_data['password'],$user_data['fullname'],$user_data['email'],$user_data['token']));
    }

    function updateUserToken($token,$user_id,$state)
    {
        return $this->db->set("UPDATE `users` SET token = ?, verify = ? WHERE id =?",array($token, $state, $user_id));
    }

    function updateUserInfo($user_data)
    {
        return $this->db->set("UPDATE `users` SET username = ?, fullname = ?WHERE id =?",array($user_data['username'],$user_data['fullname'],$user_data['id']));
    }

    function updateUserEmail($user_data)
    {
        return $this->db->set("UPDATE `users` SET email = ? WHERE id =?",array($user_data['email'],$user_data['id']));
    }

    function updateUserPassword($user_data)
    {
        return $this->db->set("UPDATE `users` SET password = ? WHERE id =?",array($user_data['new_password'],$user_data['id']));
    }

    function deleteAccount($user_id)
    {
       return $this->db->del("DELETE articles, follow, users, user_avatar
        FROM users
        LEFT JOIN articles ON (articles.creator_id = users.id)
        LEFT JOIN follow ON (follow.user_id = users.id)
        LEFT JOIN user_avatar ON (user_avatar.user_id = users.id)
        WHERE users.id = ?",array($user_id));
    }

    function getFollow($followed_id)
    {
        $user_id = $this->isLogin()['id'];

        return $this->db->add("INSERT INTO `follow` set `user_id` = ?, `followed_id` = ?",array($user_id,$followed_id));

    }

    function getUnfollow($unfollowed_id)
    {
        $user_id = $this->isLogin()['id'];

        return $this->db->set("DELETE FROM `follow` WHERE `user_id` = ? AND `followed_id` = ?",array($user_id, $unfollowed_id));
    }

    function followChose($page_id,$user_id = null)
    {
        if($user_id === null) {
            $user_id = $this->isLogin()['id'];
        }

        $search = $this->db->getAll("SELECT * FROM `follow` WHERE `user_id` = ? AND `followed_id` = ?",array($user_id,$page_id));
        if (!empty($search))
        {
            return true;
        }else
        {
            return false;
        }
    }

    function getFollowers($user_id = null)
    {
        if($user_id === null){
            $user_id = $this->isLogin()['id'];
        }
//
        return $this->db->getAll("SELECT users.id,users.username, u.id, u.fullname, u.username, a.avatar
                FROM users 
                INNER JOIN follow f 
                on (f.followed_id = users.id 
                AND users.id = ?) 
                INNER JOIN users u 
                on (u.id = f.user_id)
                INNER JOIN user_avatar a 
                on (a.user_id = f.user_id)",$user_id);

    }

    function getFollowings($user_id = null)
    {
        if($user_id === null) {
            $user_id = $this->isLogin()['id'];
        }
        return $this->db->getAll("SELECT users.id,users.username, u.id, u.fullname, u.username, a.avatar
                FROM users 
                INNER JOIN follow f 
                on (f.user_id = users.id 
                AND users.id = ?) 
                INNER JOIN users u 
                on (u.id = f.followed_id) 
                INNER JOIN user_avatar a 
                on (a.user_id = f.followed_id)",$user_id);
    }

//    function getUserPins($user_id = null)
//    {
//        if($user_id === null) {
//            $user_id = $this->isLogin()['id'];
//        }
//        return $this->db->getAll("SELECT articles.id,articles.title,articles.slug,articles.content,articles.published_at as date
//FROM articles
//INNER JOIN user_pins
//on (articles.id = user_pins.article_id AND user_pins.user_id = ?)
//",$user_id);
//    }
//
//    function getAddUserPins($pin_id=null,$user_id = null)
//    {
//        if($user_id === null) {
//            $user_id = $this->isLogin()['id'];
//        }
//
//        $delete = $this->db->del("DELETE FROM `user_pins` WHERE `user_id` = ?",($user_id));
//
//            return $this->db->add("INSERT INTO `user_pins` (`user_id`,`article_id`) VALUE (?,?)",array($user_id,$pin_id));
//
//
//    }
//
//    function isPined($pin_id,$user_id=null)
//    {
//        if($user_id === null) {
//            $user_id = $this->isLogin()['id'];
//        }
//
//        $search = $this->db->getAll("SELECT * FROM `user_pins` WHERE `user_id` = ? AND `article_id` = ?",array($user_id,$pin_id));
//        if (!empty($search))
//        {
//            return true;
//        }else
//        {
//            return false;
//        }
//    }
//
//    function getUserMarks($user_id=null)
//    {
//        if ($user_id===null)
//        {
//            $user_id = $this->isLogin()['id'];
//        }
//        return $this->db->getAll("SELECT users.id, users.username, users.username, u.fullname, u.id, u.username
//FROM users
//INNER JOIN user_marks m
//on (m.user_id = users.id
//AND users.id = ?)
//INNER JOIN users u
//on (u.id = m.marked_user_id)",$user_id);
//        return $article = $this->db->getAll("SELECT * FROM `user_marks` WHERE `user_id` = ?",$user_id);
//    }
//
//    function getUserMarksState($page_id,$user_id=null)
//    {
//        if($user_id === null) {
//            $user_id = $this->isLogin()['id'];
//        }
//
//        $search = $this->db->getAll("SELECT * FROM `user_marks` WHERE `user_id` = ? AND `marked_user_id` = ?",array($user_id,$page_id));
//        if (!empty($search))
//        {
//            return true;
//        }else
//        {
//            return false;
//        }
//    }
//
//    function getMarksUser($market_id)
//    {
//        $user_id = $this->isLogin()['id'];
//
//        return $this->db->add("INSERT INTO `user_marks` set `user_id` = ?, `marked_user_id` = ?",array($user_id,$market_id));
//    }
//
//    function getUnMarksUser($unmarket_id)
//    {
//        $user_id = $this->isLogin()['id'];
//
//        $this->db->set("DELETE FROM `user_marks` WHERE `user_id` = ? AND `marked_user_id` = ?",array($user_id, $unmarket_id));
//    }
//
//    function getArticleMarks($user_id=null)
//    {
////        if ($user_id===null)
////        {
////            $user = $this->isLogin()['id'];
////        }
//        return $this->db->getAll("
//SELECT articles.id, articles.title, articles.content, articles.state, articles.published_at
//FROM articles
//INNER JOIN article_marks f
//on (f.user_id = ?)
//",$user_id);
//    }
}
