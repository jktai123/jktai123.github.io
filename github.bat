
REM git config --global --unset user.name
REM git config --global --unset user.email
Rem 進入專案資料夾，單獨設定每個repo 使用者名稱/郵箱
Rem git config user.email "jktai123@gmail.com"
Rem git config user.name "jktai123"

git add -A .
git commit -m %1
git push origin master

