<?php
require_once 'models/User.php';
class Post
{
    public $model;

    function __construct()
    {
        $this->db = new DB;
    }

    function createArticle($user_data)
    {
        return $this->db->add("INSERT INTO `articles` SET `title` = ?,`slug` = ?, `content` = ?,`creator_id` = ?, `state` = ?", array($user_data['title'],$user_data['slug'],$user_data['text'],$user_data['id'],$user_data['type']));
    }

    function findArticle($article_id)
    {
      $article = $this->db->getAll("SELECT * FROM `articles` WHERE `id` = ?",$article_id);
      if (empty($article))
      {
          return false;
      }else{
          return $article[0];
      }
    }

    function getAllArticles()
    {
        return $this->db->getAll("SELECT users.fullname,users.username,articles.title,articles.content,articles.slug,articles.id,articles.published_at as date  FROM `articles`,`users` WHERE articles.creator_id = users.id AND `state` = 'public' ORDER BY users.id DESC");
    }

    function getUserArticles($user_id)
    {
            return $this->db->getAll("SELECT * FROM `articles` WHERE `creator_id` = ? AND `state` = 'public' ORDER BY id DESC",$user_id);
    }

    function getPublicUserArticles($user_id)
    {
            return $this->db->getAll("SELECT id, slug FROM `articles` WHERE `creator_id` = ? AND `state` = 'public' ORDER BY id DESC",$user_id);
    }


    function Update($article_update_date)
    {
        return $this->db->set("UPDATE `articles` SET `title` = ? ,`slug` = ?, `content` = ?,`state` = ? WHERE `id` = ?",array($article_update_date['title'],$article_update_date['slug'],$article_update_date['text'],$article_update_date['type'],$article_update_date['id']));
    }

    function UpdateArticleType($article_type)
    {
        return $this->db->set("UPDATE `articles` SET `state` = ? WHERE `id` = ?",array($article_type['state'],$article_type['id']));
    }

    function Delete($article_id)
    {
        return $this->db->del("DELETE FROM `articles` WHERE `id` = ?",$article_id);

    }


}