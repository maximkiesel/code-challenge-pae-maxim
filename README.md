# Automation Runs API – Frontend Code Challenge

Dieses Projekt stellt das lokale Express.js-Backend für die Frontend-Code-Challenge bereit. Es benötigt keine Datenbank und keine Zugangsdaten. Das Frontend verwendet die API wie einen echten REST-Service unter `http://127.0.0.1:8080`.

Die Daten liegen ausschließlich im Speicher und werden beim Neustart zurückgesetzt.

## Voraussetzungen und Start

Benötigt wird [Node.js](https://nodejs.org/) in Version 22 oder neuer; npm wird mit Node.js installiert.

```sh
npm ci
npm start
```

Der Server ist anschließend erreichbar unter:

```text
http://127.0.0.1:8080
```

Ein erfolgreicher Start lässt sich über diesen Endpunkt prüfen:

```text
http://127.0.0.1:8080/health
```

Die Standardkonfiguration startet mit dem Szenario `normal` und einer Verzögerung von 500 ms. Die Verzögerung macht einen Loading-State im Frontend sichtbar. Der Server wird mit `Ctrl+C` beendet.

## Konfiguration und Szenarien

Die Konfiguration erfolgt über Umgebungsvariablen.

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `PORT` | `8080` | Lokaler Port des Servers. |
| `SCENARIO` | `normal` | API-Szenario: `normal`, `empty`, `runs-error` oder `retry-error`. |
| `DELAY_MS` | `500` | Künstliche API-Verzögerung in Millisekunden. |

### macOS und Linux

```sh
SCENARIO=retry-error npm start
PORT=8081 DELAY_MS=0 npm start
```

### Windows PowerShell

```powershell
$env:SCENARIO = "retry-error"
npm start
```

Für eine andere Konfiguration in derselben PowerShell-Sitzung setzt du die jeweilige Variable erneut, etwa `$env:DELAY_MS = "0"`.

| Szenario | Verhalten |
| --- | --- |
| `normal` | Liste und Retry funktionieren. |
| `empty` | Die Liste antwortet erfolgreich mit `[]`. |
| `runs-error` | `GET /api/automation-runs` antwortet mit `500`. |
| `retry-error` | Die Liste funktioniert; jeder Retry antwortet mit `500`. |

## Interaktive API-Dokumentation

Nach dem Start ist die interaktive ReDoc-Dokumentation verfügbar unter:

```text
http://127.0.0.1:8080/docs
```

Die zugrunde liegende OpenAPI-3.0-Beschreibung liegt unter:

```text
http://127.0.0.1:8080/openapi.json
```

Die API und die OpenAPI-Datei werden lokal ausgeliefert. Die ReDoc-Oberfläche lädt ihr Renderer-Skript vom offiziellen ReDoc-CE-CDN.

## API-Vertrag

Der Server erlaubt CORS für lokale Frontend-Entwicklungsserver. Filter, Suche und Sortierung sind bewusst nicht Teil der API und gehören zur Frontend-Aufgabe.

### Serverzustand prüfen

```text
GET /health
```

Antwort (`200 OK`):

```json
{
  "status": "ok"
}
```

### Runs laden

```text
GET /api/automation-runs
```

Erfolgreiche Antwort (`200 OK`):

```json
[
  {
    "id": 101,
    "name": "Customer Data Synchronization",
    "application": "Salesforce",
    "status": "success",
    "created_at": "2026-08-20T08:15:00Z",
    "duration_ms": 4280
  },
  {
    "id": 103,
    "name": "User Provisioning",
    "application": "Microsoft 365",
    "status": "running",
    "created_at": "2026-08-20T10:05:00Z",
    "duration_ms": null
  }
]
```

Mögliche Statuswerte sind `success`, `failed` und `running`. Das vollständige Dataset enthält mehrere Einträge und mindestens zwei fehlgeschlagene Runs.

### Fehlgeschlagenen Run erneut starten

```text
POST /api/automation-runs/{id}/retry
```

Nur ein Run mit `status: "failed"` kann erneut gestartet werden. Bei Erfolg antwortet die API mit `202 Accepted`:

```json
{
  "id": 102,
  "status": "running"
}
```

Der Status bleibt nach dem Retry für die restliche Serverlaufzeit `running`. Ein zweiter Retry desselben Runs liefert `409 Conflict`. Eine unbekannte ID liefert `404 Not Found`.

Fehlerantworten haben immer dieses Format:

```json
{
  "error": "human-readable message"
}
```

