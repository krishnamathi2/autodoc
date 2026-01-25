@echo off
echo Creating directory structure...

REM Create directories
mkdir src\components 2>nul
mkdir src\components\common 2>nul
mkdir src\utils 2>nul
mkdir src\types 2>nul
mkdir src\services 2>nul

echo Creating empty component files...

REM Create component files
type nul > src\components\HomePage.tsx
type nul > src\components\ImpulseTutorPage.tsx
type nul > src\components\WhyAutoDocPage.tsx
type nul > src\components\InteractiveDemoPage.tsx
type nul > src\components\FreeTrialPage.tsx
type nul > src\components\SignInPage.tsx
type nul > src\components\DashboardPage.tsx
type nul > src\components\common\ThemeToggle.tsx

REM Create utility files
echo // Validation utilities > src\utils\validation.ts
echo // Types > src\types\index.ts
echo // Demo helpers > src\utils\demoHelpers.ts

echo Done! Directory structure created.
pause