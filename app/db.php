<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'itstep');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHAR', 'utf8');

class DB
{
    protected static $instance = null;
    public static $sth = null;

    public function __construct() {}
    public function __clone() {}

    public static function instance()
    {
        if (self::$instance === null)
        {
            $opt  = array(
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => TRUE,
            );
            $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset='.DB_CHAR;
            try {
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, $opt);
            } catch (\PDOException $e) {
                throw new \PDOException($e->getMessage(), (int)$e->getCode());
            }
        }
        return self::$instance;
    }

    public static function __callStatic($method, $args)
    {
        return call_user_func_array(array(self::instance(), $method), $args);
    }

    public static function run($sql, $args = [])
    {
        $stmt = self::instance()->prepare($sql);
        $stmt->execute($args);
        return $stmt;
    }

    public static function getAll($query, $param = array())
    {
        self::$sth = self::instance()->prepare($query);
        self::$sth->execute((array) $param);
        return self::$sth->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function add($query, $param = array())
    {
        self::$sth = self::instance()->prepare($query);
        return (self::$sth->execute((array) $param)) ? self::instance()->lastInsertId() : 0;
    }

    /**
     * Выполнение запроса.
     */
    public static function set($query, $param = array())
    {
        self::$sth = self::instance()->prepare($query);
        return self::$sth->execute((array) $param);
    }

    public static function del($query, $param = array())
    {
        self::$sth = self::instance()->prepare($query);
        self::$sth->execute((array) $param);
        return self::$sth->rowCount();
    }

    /**
     * Получение строки из таблицы.
     */
    public static function getRow($query, $param = array())
    {
        self::$sth = self::instance()->prepare($query);
        self::$sth->execute((array) $param);
        return self::$sth->fetch(PDO::FETCH_ASSOC);
    }

    public static function getValue($query, $param = array(), $default = null)
    {
        $result = self::getRow($query, $param);
        if (!empty($result)) {
            $result = array_shift($result);
        }

        return (empty($result)) ? $default : $result;
    }

    /**
     * Получение столбца таблицы.
     */
    public static function getColumn($query, $param = array())
    {
        self::$sth = self::instance()->prepare($query);
        self::$sth->execute((array) $param);
        return self::$sth->fetchAll(PDO::FETCH_COLUMN);
    }

    public static function allBind($query,$state,$limit,$offset)
    {
        self::$sth = self::instance()->prepare($query);
        self::$sth->bindParam(':state', $state);
        self::$sth->bindParam(':limit', $limit, PDO::PARAM_INT);
        self::$sth->bindParam(':offset', $offset, PDO::PARAM_INT);
        self::$sth->execute();
        return self::$sth->fetchAll(PDO::FETCH_ASSOC);
    }

}
