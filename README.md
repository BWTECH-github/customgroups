# Benutzerdefinierte Gruppen (customgroups)

Mit dieser App legen Benutzer von owncloud.online eigene Gruppen an, verwalten
deren Mitglieder und geben Dateien und Ordner an diese Gruppen frei.

## Funktionen

- Gruppen anlegen, umbenennen und löschen (persönliche Einstellungen, Abschnitt
  "Benutzerdefinierte Gruppen", oder die App-Seite `/apps/customgroups/`)
- Mitglieder hinzufügen (Vorschlagsliste öffnet beim Hineinklicken), entfernen,
  Rolle wechseln zwischen "Mitglied" und "Gruppenbesitzer"
- Gruppe verlassen; der letzte Gruppenbesitzer kann nicht gehen
- Mitglieder als CSV exportieren und importieren (`benutzer,rolle` je Zeile,
  Rolle `admin` oder `member`)
- Freigaben an die Gruppe über den normalen Freigabedialog; auch Desktop- und
  Mobil-Clients können an benutzerdefinierte Gruppen freigeben
- Benachrichtigungen bei Aufnahme, Rollenwechsel und Entfernen
- Einladen von Gästen, wenn die Gäste-App aktiv ist

## Voraussetzungen

- owncloud.online 11.x und PHP 8.4 (siehe `appinfo/info.xml`)

## Installation

```bash
cd apps-external
git clone https://github.com/BWTECH-github/customgroups.git
cd customgroups && composer install --no-dev
chown -R www-data:www-data .
sudo -u www-data php occ app:enable customgroups
```

## Einstellungen

In der Verwaltung unter "Teilen":

| Schalter | App-Wert | Wirkung |
| --- | --- | --- |
| Nur Gruppen-Administratoren dürfen benutzerdefinierte Gruppen erstellen | `only_subadmin_can_create` | Anlegen nur für Administratoren und Gruppen-Administratoren |
| Mehrere Gruppen mit demselben Namen erlauben | `allow_duplicate_names` | gleiche Anzeigenamen für verschiedene Gruppen zulassen |

In `config.php`:

```php
// Administratoren sehen und bearbeiten nur Gruppen, in denen sie Mitglied sind
'customgroups.disallow-admin-access-all' => true,
// Mitglieder dieser Gruppen sehen den Abschnitt in den persönlichen Einstellungen nicht
'customgroups.disallowed-groups' => ['extern'],
```

## Schnittstellen

- WebDAV: `remote.php/dav/customgroups/groups/<gruppe>/` (Mitglieder,
  `?export` für CSV, POST mit `text/csv` für den Import) und
  `remote.php/dav/customgroups/users/<benutzer>/` (Mitgliedschaften)
- Gruppen-IDs im Kern: `customgroup_<gruppe>`

## Tests

- Unit: `phpunit --testsuite unit` gegen einen Kern mit `tests/`
- Browserprobe gegen eine Testinstanz:
  `bash tests/visual/customgroups-testdaten.sh einrichten`, dann
  `OC_PASSWORD=... node tests/visual/pruefe-customgroups.js`, danach
  `customgroups-testdaten.sh entfernen`

## Herkunft

Fork der Upstream-App customgroups (Vincent Petry u. a.), Lizenz AGPL-3.0; die
Urheberrechtsvermerke in den Quelldateien bleiben unverändert. Angepasst von der
BW-Tech GmbH für owncloud.online und PHP 8.4.

- Quelltext und Fehlermeldungen: https://github.com/BWTECH-github/customgroups
- Produktseite: https://owncloud.online
