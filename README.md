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
- Aktuell: `1.6.19`

## Aenderungsprotokoll
- `1.6.19` (2026-02-15): Archivierungsfunktion entfernt: keine Archivieren/Wiederherstellen-Buttons mehr, keine getrennte Archivliste und keine Archiv-Filter in Today/Unlock/Weekly Plan/Onboarding; Manifest-Cache-Buster auf `v=1619`.
- `1.6.18` (2026-02-15): Hauptaufgaben-Checkbox gefixt: Today-Liste wird nach dem Abhaken leicht verzoegert neu gerendert, damit die Burst-Animation sichtbar bleibt; Manifest-Cache-Buster auf `v=1618`.
- `1.6.17` (2026-02-15): Gesamt-Upgrade umgesetzt: klareres Onboarding (Checkliste + CTA), Backup-Import mit Validierung und Overwrite/Merge-Entscheidung, neue Progress-Insights (Wochenquote/Monatsquote/starker Wochentag), Goals-Archiv + Drag-and-drop-Sortierung, robusteres Update-Banner (Retry + Release-Hinweis), Privacy/Impressum-Seiten und lokales Fehlerlog; Manifest-Cache-Buster auf `v=1617`.
- `1.6.16` (2026-02-15): Backup/Restore ergaenzt: Export als JSON-Datei, Import aus JSON inklusive Wiederherstellung von Sprache und App-State; Manifest-Cache-Buster auf `v=1616`.
- `1.6.15` (2026-02-15): PWA-Update-Flow verbessert: Update-Banner mit Aktion "Jetzt aktualisieren" eingebaut, Service Worker auf `SKIP_WAITING`-Message umgestellt und automatischer Reload nach Aktivierung neuer Version ergänzt; Manifest-Cache-Buster auf `v=1615`.
- `1.6.14` (2026-02-15): Reset als kompletter Neuanfang umgesetzt: beim Zuruecksetzen wird jetzt auch die gespeicherte Sprache geloescht, die laufende Sprache zurueckgesetzt und der Sprachdialog sofort wieder angezeigt; Manifest-Cache-Buster auf `v=1614`.
- `1.6.13` (2026-02-15): First-Impression-Polish im UI: Header/Branding visuell aufgewertet, Karten mit staerkerer Tiefe und Hover-Hierarchie, Welcome/Tutorial-Look modernisiert, aktive Bottom-Navigation klarer hervorgehoben; Manifest-Cache-Buster auf `v=1613`.
- `1.6.12` (2026-02-15): Kalender-Legende farblich feinjustiert: der innere Gruenton des Legenden-Kaestchens entspricht jetzt dem Volltreffer-Ton im Kalender; Manifest-Cache-Buster auf `v=1612`.
- `1.6.11` (2026-02-15): Kalender-Legende angepasst: das gruene Legenden-Kaestchen nutzt jetzt den gleichen visuellen Stil wie ein voll erfuellter Kalendertag; Manifest-Cache-Buster auf `v=1611`.
- `1.6.10` (2026-02-15): Vollstaendige i18n-Abdeckung: fehlende Life-Goals-/Settings-Texte, lokalisierte Vorlagen (Kategorien + Items), lokalisierte Wochenplan-Ueberschrift inkl. Wochentage und Labels; Manifest-Cache-Buster auf `v=1610`.
- `1.6.7` (2026-02-15): Erststart-Sprachauswahl hinzugefuegt (Deutsch, Englisch, Russisch, Spanisch, Franzoesisch) und zentrale UI-/Hinweistexte in kurze Sprachvarianten ueberfuehrt; Manifest-Cache-Buster auf `v=1607`.
- `1.6.6` (2026-02-15): Vollstaendige Offline-Nutzung als installierte Home-Screen-App aktiviert: `service-worker.js` hinzugefuegt, Registrierung in `js/app.js` integriert und Build-Output um Service-Worker-Datei erweitert; Manifest-Cache-Buster auf `v=1606`.
- `1.6.5` (2026-02-15): Naechste Native-Schritte umgesetzt: Ressourcenordner `resources/` angelegt, `@capacitor/assets` integriert und Workflow-Skripte fuer Asset-Generierung, Sync sowie Android/iOS-Open/Run hinzugefuegt.
- `1.6.4` (2026-02-15): Capacitor eingerichtet (`capacitor.config.json`, `@capacitor/core`, `@capacitor/cli`) und native Plattformen hinzugefuegt (`android/`, `ios/`) fuer Play-Store/App-Store-Workflow.
- `1.6.3` (2026-02-15): Repo-Aufraeumung fuer Release-Pipeline (`.gitignore`, `.DS_Store` aus Git), Build-Setup mit `package.json` + `scripts/build.mjs` und `dist/`-Output; Manifest-Cache-Buster auf `v=1603`.
- `1.6.2` (2026-02-15): Native-App-Feinschliff: sticky Header, floating Bottom-Navigation, Safe-Area-Abstaende, Touch-Feedback (active states), Toast-Bestaetigungen und leichtes Haptic-Feedback; Manifest-Cache-Buster auf `v=1602`.
- `1.6.1` (2026-02-15): Neues Logo aus `assets/onestep-logo-user.png` eingebunden (Branding, Favicon, Apple-Touch-Icon, Manifest), App-Version auf `1.6.1` angehoben.
- `1.6.0` (2026-02-15): Versionsupdate auf `1.6.0`; Manifest-Cache-Buster in `index.html` auf `v=1600` gesetzt; Dokumentation initialisiert.
