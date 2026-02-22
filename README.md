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

## Nutzer-Tracking (optional)
- Tracking ist standardmaessig deaktiviert.
- In `index.html` den Block `window.__ONESTEP_ANALYTICS__` anpassen:
  - `enabled: true`
  - `provider: "plausible"`
  - `domain: "deine-domain.tld"`
  - optional `apiHost` fuer Self-Hosted Plausible
- Erfasste Events:
  - `app_open`
  - `language_changed`
  - `goal_added`
  - `goal_task_added`
  - `main_task_completed`
  - `quick_task_today_added`
  - `quick_task_tomorrow_added`
  - `side_task_added`
  - `side_task_completed`

## Version
- Aktuell: `1.7.36`

## Aenderungsprotokoll
- `1.7.36` (2026-02-22): Mobile-Update-Fix fuer den neuen Tracker: harte Cache-Buster fuer `css/style.css` und `js/app.js` eingefuehrt (`?v=1736`) und Service-Worker-App-Shell erweitert; zusaetzlich Today-Tracker-Switch auf kleinen Screens vollbreit und besser tappbar gemacht.
- `1.7.35` (2026-02-21): Gewichts-Tracker v1 umgesetzt: taegliche Gewichtseingabe im Today-Tracker (`Gewicht`) inklusive Speicherung pro Datum und Verlaufsdiagramm im Panel.
- `1.7.34` (2026-02-21): Today-Tracker-Wechsel sichtbar gemacht: neuer Umschalter im Today-Header fuer `Checkliste`/`Gewicht`, persistente Auswahl im State (`todayTracker`) und eigene Gewicht-Panel-Ansicht als erste Basis.
- `1.7.33` (2026-02-19): Zeit-Update fuer bestehende Goals weiter gehaertet: Ziel-ID wird beim Oeffnen am Picker mitgefuehrt und beim Speichern als Fallback verwendet. Dadurch funktioniert „Übernehmen“ auch dann, wenn der temporaere Edit-State verloren geht.
- `1.7.32` (2026-02-19): Zeit-Update beim schnellen Tippen auf „Übernehmen“ gefixt: Picker liest jetzt vor dem Speichern immer direkt die aktuelle Wheel-Position aus (Hour/Minute), auch wenn Scroll-Debounce noch nicht ausgelaufen ist.
- `1.7.31` (2026-02-19): Zeit-Edit-Fix: Time-Picker schließt nicht mehr sofort beim Klick auf Zeit-Badges in `Today`/`Goals`. Ursache war ein globaler Outside-Click-Handler; Badge-Klicks werden jetzt von diesem Handler ausgeschlossen und stoppen Event-Bubbling.
- `1.7.30` (2026-02-19): Zeit-Badge als echter Button in `Today` und `Goals` umgesetzt: Klick auf Uhrzeit oeffnet immer den Time-Wheel-Picker mit aktueller Zielzeit; bei Klick aus `Today` wird direkt in `Goals` mit offenem Picker fokussiert. Speichern aktualisiert Goal-Zeit und sortiert die Today-Liste automatisch neu.
- `1.7.29` (2026-02-19): Bestehende Goal-Zeiten direkt bearbeitbar gemacht: klickbares Zeit-Badge pro Goal oeffnet den bestehenden Time-Wheel-Picker, Speichern uebernimmt die neue Zeit ins Goal und in heutige Hauptaufgaben; neues Toast-Feedback nach erfolgreicher Aktualisierung.
- `1.7.28` (2026-02-19): Zeitpicker-Effekt vereinfacht fuer maximale Stabilitaet: 3D-Anwinkeln entfernt, Darstellung jetzt nur ueber Verkleinerung + Verblassung (inkl. leichter Unschaerfe) je nach Abstand zur Mitte.
- `1.7.27` (2026-02-19): Zeitpicker-Wheel gegen Springen stabilisiert: konkurrierende Custom-Drag-Logik entfernt, Scroll-Ende-Debounce entschärft, aktive Markierung auf exakt zentriertes Item umgestellt und Touch-Handling auf nativen vertikalen Scroll (`pan-y`) korrigiert.
- `1.7.26` (2026-02-19): Zeitpicker-Wheel stabilisiert: Endlos-Nachregeln beim Oeffnen/Stoppen entfernt, exaktes Einrasten auf Mittelposition erzwungen und Re-Sync-Loops zwischen Scroll-Ende und Value-Update unterbunden.
- `1.7.25` (2026-02-19): 3D-Zylinder-Effekt im Zeitpicker visuell verstaerkt und browser-robuster gemacht: perspektivische Rotation pro Item, staerkere Tiefenstaffelung, zusaetzliche Fokusunschärfe/Opacity-Abstufung und Performance-Hinweise via `will-change`.
- `1.7.24` (2026-02-19): Zeitpicker-Wheel um 3D-Zylinder-Optik erweitert: Zahlen kippen beim Scrollen nach vorne/hinten (Perspektive, Tiefe, Rotation), sodass ein rotierender breiter Zylinder-Eindruck entsteht.
- `1.7.23` (2026-02-19): Zeitpicker-Layout kompakter gemacht: Stunde bleibt links und Minute rechts (auch auf kleinen Screens), Wheel-Breiten reduziert und vertikale Hoehe leicht gesenkt fuer bessere Platznutzung.
- `1.7.22` (2026-02-19): Wheel-Swipe-Bedienung fuer Uhrzeitpicker stabilisiert: direkte Pointer-Drag-Steuerung (hoch/runter), Touch-Scroll-Capture im Wheel, robustes Snap+Finalize nach Gesture-Ende und zyklisches Recenter fuer verlässliche unendliche Wiederholung.
- `1.7.21` (2026-02-19): Goal-Zeitpicker von Kreis-UI auf vertikales Wheel (Apple-Wecker-Stil) umgestellt: smooth Swipe nach oben/unten mit Scroll-Snap, stufenloser Stunden-/Minutenwahl und unendlicher Wiederholung der Zahlen per zyklischem Recenter.
- `1.7.20` (2026-02-19): Goal-Zeitwahl auf echte Uhrzeit umgestellt: statt Morgens/Mittags/Abends jetzt radialer Time-Picker mit zwei Kreisen (Stunde + Minute) und Radius-Linie, Speicherung als `HH:MM`, Anzeige/Sortierung der Aufgaben nach Uhrzeit.
- `1.7.19` (2026-02-18): Wochenplan auf reine Texteingabe umgestellt (Checkbox entfernt). Ein Tag gilt jetzt als aktiv, sobald Text eingetragen ist; leere Tage gelten als Rest Day. Hinweistext im Wochenplan entsprechend ergaenzt.
- `1.7.18` (2026-02-18): Wochenplaner kompakter gestaltet: reduzierte Abstaende, kleinere Zeilenhoehen, schmalere Spalten und kompaktere Select/Input-Controls fuer bessere Platznutzung.
- `1.7.17` (2026-02-18): Design-Polish-Paket umgesetzt: verfeinerte Typografie-Hierarchie, erweitertes Design-Token-System, vereinheitlichte Card/Input/Button-Styles und staerkere visuelle Prioritaet fuer den Today-Bereich.
- `1.7.16` (2026-02-18): Einstellungen in der Bottom-Navigation mit Zahnrad-Symbol (`⚙`) statt Info-Symbol gekennzeichnet.
- `1.7.15` (2026-02-18): Header kompakter gemacht und Sticky-Verhalten entfernt: OneStep-Header scrollt jetzt normal nach oben aus dem Sichtbereich und nutzt deutlich weniger vertikalen Platz.
- `1.7.14` (2026-02-18): Plausible-Setup auf personalisiertes Script umgestellt: offizielles `pa-...` Snippet eingebunden und Analytics-Init so erweitert, dass entweder globales Plausible-Snippet oder konfigurierter Script-Loader genutzt wird.
- `1.7.13` (2026-02-18): Plausible-Tracking-Konfiguration aktiviert und Domain auf `jirotubert-star.github.io` gesetzt, damit Besucher- und Event-Daten direkt im Dashboard sichtbar werden.
- `1.7.12` (2026-02-18): Optionales Nutzer-Tracking integriert (Plausible): konfigurierbarer Bootstrap in `index.html`, Besucherzaehlung ueber Plausible-Script und zentrale App-Events (Goal/Task/Language) fuer Nutzungsanalyse.
- `1.7.11` (2026-02-18): Vorlagen-UX verbessert: zusaetzlich zum bestehenden Vorlagen-Aufklapper hat jetzt jede Vorlage-Kategorie einen eigenen Auf-/Zuklapp-Bereich (Details/Summary), damit die Liste kompakter bleibt.
- `1.7.10` (2026-02-18): Checkbox-Design angepasst: Innenflaeche der Aufgaben-Checkboxen ist jetzt hell/weiß statt schwarz, inkl. hellem Checked-Hintergrund fuer konsistenteres UI.
- `1.7.9` (2026-02-18): i18n-Vervollstaendigung: Side-Quest-Begriffe in allen Sprachen lokalisiert, Navigation/Tab-Titel komplett sprachabhaengig, Kalender-Wochentage + Tooltip-Text lokalisiert, Monatsname nach aktiver Sprache formatiert, fehlendes Side-Quest-Label in der UI angebunden.
- `1.7.8` (2026-02-18): iPad/Chrome-Devtools-Layoutfix: aktiver Content-Tab nutzt auf Tablet/Desktop nun volle Grid-Breite, dadurch kein leerer rechter Bereich mehr bei einzelner Tab-Ansicht.
- `1.7.7` (2026-02-18): Responsive-Optimierung fuer iPad und Desktop: breiteres Grid-Layout, angepasste Karten-/Abstandssysteme, optimierte Statistik-/Progress-Raster sowie Navigation als Side-Rail auf grossen Screens fuer bessere Bedienung in Quer- und Hochformat.
- `1.7.6` (2026-02-17): Kalender-Datumsfix (Zeitzone): ISO-Tage werden jetzt lokal statt UTC berechnet. Dadurch werden erledigte Aufgaben am korrekten Kalendertag gespeichert und angezeigt (kein +1-Tag-Versatz mehr).
- `1.7.5` (2026-02-17): Daily-Unlock-Fix fuer Fast-Onboarding: automatische Seed-Aufgabe wird jetzt strikt nur einmal beim allerersten Start erstellt und nicht mehr an Folgetagen. Taegliche Freischaltung bleibt manuell (selbst auswaehlen oder zufaellig).
- `1.7.4` (2026-02-17): Fast-Onboarding korrigiert fuer Tester: keine automatische Ziel-Hinzufuegung mehr; stattdessen taeglich manuelle Freischaltung von genau einer neuen Aufgabe (wie beim 3-Tage-Flow, nur im Testmodus taeglich).
- `1.7.3` (2026-02-17): Fast-Onboarding-Testversion fuer externe Tester: waehrend Onboarding taegliche Ziel-Freischaltung (statt alle 3 Tage), automatische taegliche Aufgabe aus dem Zielpool und fruehere Feature-Unlocks (Wochenplan Tag 2, Einmalige Aufgaben Tag 3, Side Quest Tag 4).
- `1.7.2` (2026-02-17): Native-UI-Polish fuer besseren First Impression auf Mobile: Bottom-Navigation im App-Stil verstaerkt, Buttons/Inputs modernisiert, klare Focus-Rings ergaenzt, Karten-/Header-Tiefe verbessert und Touch-Feedback verfeinert.
- `1.7.1` (2026-02-17): Versionsanzeige im Footer gehaertet: App liest zusaetzlich die Version des aktiven Service Workers und synchronisiert die angezeigte Version, damit nach Mobile-Updates keine veraltete Anzeige bleibt.
- `1.7.0` (2026-02-17): Versionssprung auf `1.7.0`; Manifest-Cache-Buster auf `v=1700`.
- `1.6.40` (2026-02-17): Kalender-UX verbessert: der heutige Tag ist jetzt immer anklickbar und oeffnet die Tagesdetailansicht, auch wenn fuer heute noch keine Summary-Werte vorhanden sind.
- `1.6.39` (2026-02-17): Kalender-Detailansicht ergaenzt: Klick auf vergangene Kalendertage zeigt gespeicherte Aufgabenliste mit Status `Erledigt/Offen`; Tageshistorie (`dayTaskHistory`) wird lokal mitgefuehrt.
- `1.6.38` (2026-02-17): Vorschlags-/Autopilot-Funktion entfernt. Fokus wieder auf dem einfachen Kernfluss: alle 3 Tage manuell ein neues Ziel auswaehlen oder zufaellig hinzufuegen.
- `1.6.37` (2026-02-17): Lean-Mode: zusaetzliche Jahresvorsatz-Komplexitaet im Goals-Tab wieder entfernt (kein extra Editor, kein Goal-Linking/Unlinking); Jahresvorsatz bleibt als Nordstern in Intro + Progress erhalten, Autopilot wieder vereinfacht.
- `1.6.36` (2026-02-17): Goals-Tab erweitert: Jahresvorsatz kann jetzt direkt unter `Goals` bearbeitet/neu gesetzt werden. Zudem koennen einzelne Goals per einfachem Toggle mit dem Jahresvorsatz verknuepft oder geloest werden; verknuepfte Goals sind sichtbar markiert und werden vom Autopilot bevorzugt.
- `1.6.35` (2026-02-17): Signature-Mechanismen erweitert: neuer `Identity Score` (0-100, Konsistenz der letzten 14 Tage) im Progress-Bereich und `Goal-to-Day Autopilot` im Today-Bereich mit Vorschlag auf Basis des Jahresvorsatzes plus Direkt-Button zum Hinzufuegen als heutige Aufgabe.
- `1.6.34` (2026-02-17): Intro Schritt `3/3` aufgeraeumt: die drei Beispiel-Chips (z. B. Schlafen/Laufen/Essen) werden nicht mehr angezeigt.
- `1.6.33` (2026-02-17): Jahresvorsatz entwickelt: optionales Eingabefeld in der Intro-Einleitung (letzter Schritt), Speicherung im State und neue Anzeige im Progress-Bereich inkl. "Seit"-Datum sowie Jahreszahlen (erledigte Aufgaben/aktive Tage).
- `1.6.32` (2026-02-17): In den Einstellungen einen neuen System-Button „Auf Updates pruefen“ hinzugefuegt; manuelle Service-Worker-Update-Pruefung mit lokalisierten Status-Toastmeldungen integriert.
- `1.6.31` (2026-02-17): Update-Banner korrigiert: zeigt nun die Version des wartenden (neuen) Service Workers statt der aktuell laufenden Version; technische SW-Message `GET_SW_VERSION` ergänzt.
- `1.6.30` (2026-02-17): Intro fuer Erstnutzer verbessert: kuerzere, klarere Botschaften pro Seite, neuer Fortschrittsbalken (1/3-3/3), Beispielkarten auf Schritt 3, staerkerer CTA „Los geht's: erstes Ziel erstellen ->“, sanfte Reveal-Animationen und direkter Start auf `Goals` nach Abschluss.
- `1.6.29` (2026-02-17): Deutsche Intro-Texte sprachlich korrigiert (Umlaute wie Öffnen/Nächste/gewöhnlich/täglicher) und Schritt 3 inhaltlich präzisiert: schwere Aufgaben werden zum normalen Tagesablauf wie Schlafen, Essen und Laufen.
- `1.6.28` (2026-02-17): Sprachauswahl auf Vollbild umgestellt (Full-Screen-Overlay statt kompakter Karte), visuell an Intro-Look angepasst.
- `1.6.27` (2026-02-17): Intro-Einleitung auf echten Vollbildmodus umgestellt (keine kleine Karte mehr) und Navigationstaste als gruener, abgerundeter Rechteck-Button gestaltet.
- `1.6.26` (2026-02-17): Erststart-Einleitung (3 Schritte) nach Sprachauswahl eingebaut, inklusive lokalisierter Texte in 5 Sprachen, auffaelligem Weiter-Pfeil und Abschluss-Button „Los geht's ->“; Einleitung wird als einmaliger Flow gespeichert und nach Reset erneut angezeigt; Manifest-Cache-Buster auf `v=1626`.
- `1.6.25` (2026-02-15): Reines Versionsupdate auf `1.6.25`; Manifest-Cache-Buster auf `v=1625`.
- `1.6.24` (2026-02-15): Side-Quest-Unlock auf Tag 9 vorgezogen und Hinweistext praezisiert: Side Quests sind verfuegbar, aber erst nach vollstaendig erledigten Hauptaufgaben nutzbar; Manifest-Cache-Buster auf `v=1624`.
- `1.6.23` (2026-02-15): Onboarding-Text fuer Tag 9-12 angepasst: Hinweis auf Extra-Aufgaben bei vollstaendig erledigten Aufgaben; Versionen konsistent auf `1.6.23` gesetzt und Manifest-Cache-Buster auf `v=1623`.
- `1.6.22` (2026-02-15): Onboarding-Hinweis fuer Tag 4-6 praezisiert: Wochenplan-Text vereinheitlicht und in allen 5 Sprachen lokalisiert; neue Day-Range-Logik fuer `onboardingTextWeekPlan` an Tag 5-6 (Tag 4 weiterhin Unlock); Manifest-Cache-Buster auf `v=1622`.
- `1.6.21` (2026-02-15): Onboarding-Checkliste ab Tag 4 ausgeblendet; an Tag 4 erscheint stattdessen ein klarer Wochenplan-Hinweis („Schau dir jetzt den Wochenplan an.“); Manifest-Cache-Buster auf `v=1621`.
- `1.6.20` (2026-02-15): Onboarding-Text tageabhaengig gemacht: innerhalb von Tag `1-12` erscheinen jetzt unterschiedliche Hinweise je nach Phase (frueh/mittel/spaet), statt eines statischen Standardtexts; Manifest-Cache-Buster auf `v=1620`.
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
