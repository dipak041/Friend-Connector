@echo off
cd /d "%~dp0"
if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
if defined JAVA_HOME set "PATH=%JAVA_HOME%\bin;%PATH%"
set "FIREBASE_EMULATORS_PATH=%CD%\.emulator-cache"
echo Starting local Firebase database and authentication.
echo Java 21+ and Node 22 or 24 are required.
echo After startup, run START-SOCIALAPP.cmd and open:
echo http://127.0.0.1:5173/?backend=emulator
echo Emulator dashboard: http://127.0.0.1:4000
echo Keep this window open. Press Ctrl+C for a clean export of test data.
npx --yes firebase-tools@15.34.0 emulators:start --project demo-socialapp --only auth,firestore --import=.firebase-data --export-on-exit=.firebase-data
pause
