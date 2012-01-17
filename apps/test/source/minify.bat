REM @ECHO OFF

SET ENYO=..\..\..\..\enyo
SET NODE=%ENYO%\tools\node.exe
SET MINIFY=%ENYO%\tools\minifier\minify.js

%NODE% %MINIFY% .\package.js -enyo %ENYO%

mkdir build
move /Y build.js ./build
move /Y build.css ./build


PAUSE
