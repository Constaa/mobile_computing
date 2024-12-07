# Calendar Application für Mobile Computing (DHBW CAS)

Diese Anwendung bietet eine Kalenderlösung mit umfangreichen Backend- und Frontend-Funktionalitäten. Diese README führt durch die Voraussetzungen, Installation, lokale Entwicklung, Testing, Deployment und Anpassungsmöglichkeiten.

## Voraussetzungen

Stellen Sie sicher, dass die folgende Software installiert ist, bevor Sie mit der Anwendung arbeiten:

- **Betriebssystem**: Windows 10/11 (andere Systeme erfordern zusätzliche Konfiguration, die hier nicht unterstützt wird).
- **.NET 8 SDK**: [Download .NET SDK](https://dotnet.microsoft.com/en-us/download)
- **Node.js** (LTS v22): [Download Node.js](https://nodejs.org/en/download/prebuilt-installer)
- **Angular CLI**: [Install Angular CLI](https://angular.dev/tools/cli/setup-local)
- **IDEs**: 
  - **Visual Studio** (für Backend-Entwicklung): [Download Visual Studio](https://visualstudio.microsoft.com/de/downloads/). Während der Installation müssen folgende Pakete ausgewählt werden:
    - ASP.NET und Webentwicklung
    - .NET-Desktopentwicklung
  - **Visual Studio Code** (für Frontend-Entwicklung): [Download Visual Studio Code](https://code.visualstudio.com/). Optional: *Angular Language Service*-Erweiterung.
- **MariaDB**: [Download MariaDB](https://mariadb.com/downloads/). Installieren Sie optional **HeidiSQL** für eine grafische Oberfläche.

## Installation

1. Stellen Sie sicher, dass alle oben genannten Softwarevoraussetzungen erfüllt sind.
2. Laden Sie den Sourcecode aus dem entsprechenden GitHub-Repository herunter. Die Hauptbestandteile sind:
   - `calendar-backend`
   - `calendar-frontend`
   - `mariadb.sql`

## Lokale Entwicklung / Testing

### 1. MariaDB konfigurieren

1. Öffnen Sie **HeidiSQL** und erstellen Sie eine neue Verbindung. Lassen Sie alle Einstellungen unverändert, außer dem Passwort.
2. Öffnen Sie die Verbindung und kopieren Sie den Inhalt von `mariadb.sql` in das Abfragefenster.
3. Führen Sie die Abfrage aus und aktualisieren Sie die Verbindungsansicht (Rechtsklick > *Aktualisieren*).
4. Die Datenbank sollte nun in der Liste sichtbar sein.

### 2. Backend konfigurieren

1. Öffnen Sie den Ordner `calendar-backend` in **Visual Studio** durch einen Doppelklick auf die `.sln`-Datei.
2. Ändern Sie das Startprofil in der Menüleiste von `http`/`https` auf `IIS Express`.
3. Starten Sie das Backend mit `F5` oder dem Startprofil-Button.
4. Beim ersten Start akzeptieren Sie das lokale Zertifikat von IIS Express.
5. Die Swagger-Oberfläche öffnet sich automatisch und zeigt die verfügbaren Backend-Funktionen (basierend auf OpenAPI-Spezifikation).

### 3. Frontend konfigurieren

1. Öffnen Sie den Ordner `calendar-frontend` in **Visual Studio Code**.
2. Öffnen Sie ein Terminal (Menüleiste > Terminal).
3. Führen Sie den Befehl aus: `npm install --force`.
4. Starten Sie den Entwicklungsserver mit: `ng serve`.
5. Rufen Sie die Anwendung über die in der Konsole angezeigte Adresse im Webbrowser auf.
6. Logindaten für den Adminbereich:  
   - Benutzername: `admin`  
   - Passwort: `password`

**Hinweis**: Wenn die Kommunikation zwischen Frontend und Backend nicht funktioniert:
- Überprüfen Sie den Backend-Port und gleichen Sie ihn mit dem Port in `environment.ts` des Frontends ab.  
- Ändern Sie ggf. den Port in `environment.ts`, speichern Sie die Änderungen, und lassen Sie den `ng serve`-Befehl weiterlaufen, um die Änderungen automatisch zu übernehmen.

Die Anwendung ist nun lokal vollständig nutzbar.

## Deployment

Für ein Produktivdeployment folgen Sie den gleichen Schritten wie für die Testkonfiguration. Kompilieren Sie Frontend und Backend und berücksichtigen Sie die Vorgaben des verwendeten Webservers. Gegebenenfalls muss der Parameter `--base-href` beim Erstellen des Frontends verwendet werden.

## Anpassungsmöglichkeiten

Die Kalender-Anwendung bietet folgende Anpassungsmöglichkeiten:

### Farbliche Anpassungen

- Änderungen am Design können in der Datei `styles.scss` vorgenommen werden (`calendar-frontend -> src`).
- Hier können Farbverläufe und -schemata entsprechend der **Best Practices von Angular** geändert werden. Achten Sie darauf, die Änderungen konsistent zu gestalten.

### Website-Titel und Favicon

- Passen Sie die Datei `index.html` an (`calendar-frontend -> src`), um:
  - Den **Website-Titel** (Standard: `CalendarFrontend`) zu ändern.
  - Das **Favicon** durch ein eigenes Symbol zu ersetzen.

