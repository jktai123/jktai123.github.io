
REM git config --global --unset user.name
REM git config --global --unset user.email
Rem �i�J�M�׸�Ƨ��A��W�]�w�C��repo �ϥΪ̦W��/�l�c

git config user.email "jktai123@gmail.com"
git config user.name "jktai123"
git pull origin master

git add -A .
git commit -m %1
git push origin master

