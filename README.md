# OneStep

OneStep ist eine minimalistische Web-App fuer taegliche kleine Schritte, Gewohnheiten und Fortschrittstracking.

## Projektstruktur
- `index.html`: App-Shell und UI-Bereiche (Today, Goals, Progress, Info)
- `js/app.js`: Zustand, LocalStorage, Render-Logik, Interaktionen
- `css/style.css`: Styling und Animationen
- `site.webmanifest`: PWA-Metadaten
- `service-worker.js`: Offline-Cache fuer Home-Screen/PWA-Nutzung
- `scripts/build.mjs`: erzeugt ein deploybares `dist/`-Verzeichnis
- `package.json`: Build-Skript fuer Web/Container-Pipeline

## Build
- `npm run build`: erstellt `dist/` mit `index.html`, `site.webmanifest`, `css/`, `js/`, `assets/`
- `npm run assets:generate`: generiert native Icon-/Splash-Assets aus `assets/logo.png`
- `npm run sync`: baut Web-Assets und synchronisiert sie in `android/` und `ios/`
- `npm run android:open`: oeffnet das Android-Projekt in Android Studio
- `npm run ios:open`: oeffnet das iOS-Projekt in Xcode

## Version
- Aktuell: `1.6.9`

## Aenderungsprotokoll
- `1.6.9` (2026-02-15): Fehlende Uebersetzungen nachgezogen: Life-Goals-Buttons (`Bearbeiten`, `Speichern`, `Entfernen`) sowie die kompletten Info-Texte in Einstellungen werden jetzt sprachabhaengig dargestellt; Manifest-Cache-Buster auf `v=1609`.
- `1.6.7` (2026-02-15): Erststart-Sprachauswahl hinzugefuegt (Deutsch, Englisch, Russisch, Spanisch, Franzoesisch) und zentrale UI-/Hinweistexte in kurze Sprachvarianten ueberfuehrt; Manifest-Cache-Buster auf `v=1607`.
- `1.6.6` (2026-02-15): Vollstaendige Offline-Nutzung als installierte Home-Screen-App aktiviert: `service-worker.js` hinzugefuegt, Registrierung in `js/app.js` integriert und Build-Output um Service-Worker-Datei erweitert; Manifest-Cache-Buster auf `v=1606`.
- `1.6.5` (2026-02-15): Naechste Native-Schritte umgesetzt: Ressourcenordner `resources/` angelegt, `@capacitor/assets` integriert und Workflow-Skripte fuer Asset-Generierung, Sync sowie Android/iOS-Open/Run hinzugefuegt.
- `1.6.4` (2026-02-15): Capacitor eingerichtet (`capacitor.config.json`, `@capacitor/core`, `@capacitor/cli`) und native Plattformen hinzugefuegt (`android/`, `ios/`) fuer Play-Store/App-Store-Workflow.
- `1.6.3` (2026-02-15): Repo-Aufraeumung fuer Release-Pipeline (`.gitignore`, `.DS_Store` aus Git), Build-Setup mit `package.json` + `scripts/build.mjs` und `dist/`-Output; Manifest-Cache-Buster auf `v=1603`.
- `1.6.2` (2026-02-15): Native-App-Feinschliff: sticky Header, floating Bottom-Navigation, Safe-Area-Abstaende, Touch-Feedback (active states), Toast-Bestaetigungen und leichtes Haptic-Feedback; Manifest-Cache-Buster auf `v=1602`.
- `1.6.1` (2026-02-15): Neues Logo aus `assets/onestep-logo-user.png` eingebunden (Branding, Favicon, Apple-Touch-Icon, Manifest), App-Version auf `1.6.1` angehoben.
- `1.6.0` (2026-02-15): Versionsupdate auf `1.6.0`; Manifest-Cache-Buster in `index.html` auf `v=1600` gesetzt; Dokumentation initialisiert.
