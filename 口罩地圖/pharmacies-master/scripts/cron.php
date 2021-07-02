<?php
$cronLock = __DIR__ . '/cron_lock';
if(file_exists($cronLock)) {
    //previous cron is still executing, don't push it~~~
    exit();
}
file_put_contents($cronLock, date('Y-m-d H:i:s'));

$rootPath = dirname(__DIR__);

$now = date('Y-m-d H:i:s');

exec("cd {$rootPath} && /usr/bin/git pull");

exec("php -q {$rootPath}/scripts/02_fetch_maskdata.php");

exec("cd {$rootPath} && /usr/bin/git add -A");

exec("cd {$rootPath} && /usr/bin/git commit --author 'auto commit <noreply@localhost>' -m 'auto update @ {$now}'");

exec("cd {$rootPath} && /usr/bin/git push origin master");

unlink($cronLock);