REM @ECHO OFF

SET ENYO=..\..\..\..\enyo
SET NODE=%ENYO%\tools\node.exe
SET MINIFY=%ENYO%\tools\minifier\minify.js

%NODE% %MINIFY% .\package.js -enyo %ENYO% -output api 

move /Y api.js ./build
move /Y api.css ./build

PAUSE
