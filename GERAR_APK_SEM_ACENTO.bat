@echo off
echo ========================================
echo GERANDO APK DO AGROISYNC
echo ========================================
echo.

echo [1/4] Copiando projeto para C:\agroisync-temp...
xcopy /E /I /Y "C:\Users\luisp\OneDrive\Área de Trabalho\agroisync" "C:\agroisync-temp" > nul
echo FEITO!

echo [2/4] Configurando Java 17...
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
java -version
echo FEITO!

echo [3/4] Gerando AAB/APK...
cd C:\agroisync-temp\frontend\android
gradlew.bat assembleRelease
echo FEITO!

echo [4/4] Copiando APK de volta...
xcopy /Y "C:\agroisync-temp\frontend\android\app\build\outputs\apk\release\*.apk" "C:\Users\luisp\OneDrive\Área de Trabalho\" > nul
echo FEITO!

echo.
echo ========================================
echo APK GERADO COM SUCESSO!
echo Local: C:\Users\luisp\OneDrive\Área de Trabalho\app-release-unsigned.apk
echo ========================================
echo.
echo Proximo passo: Assinar o APK ou fazer upload na Play Store
pause

