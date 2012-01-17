REM @ECHO OFF

SET ENYO=..\..\..\..\enyo
SET NODE=%ENYO%\tools\node.exe
SET MINIFY=%ENYO%\tools\minifier\minify.js

%NODE% %MINIFY% .\package.js -enyo %ENYO% -output canvas

move /Y canvas.js ./build

PAUSE
