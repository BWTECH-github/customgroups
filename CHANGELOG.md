# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-09-22

Redesign-Linie (owncloud.online Redesign 11.1). Nur im Zweig `redesign`.
Im Redesign-Kern Ende zu Ende geprüft (tests/visual/pruefe-customgroups.js,
42/42; gegen den vorherigen Stand 32/42).

### Fixed

- Enter beim Umbenennen einer Gruppe legte eine zusätzliche Gruppe mit dem
  Text an, der noch (nicht abgeschickt) im Anlegefeld stand: der Handler
  "submit form" traf auch das Umbenennen-Formular.
- "Gruppe verlassen" brach mit "Cannot read properties of undefined (reading
  'destroy')" ab, wenn die Mitgliederliste beim Klick noch lud.
- Dialoge "Mitglied entfernen", "Gruppe verlassen" und "eigene Rolle ändern"
  zeigten Namen doppelt maskiert ("Probe &amp; Team").
- Nach dem Hinzufügen eines Mitglieds sprang die Vorschlagsliste ungefragt auf
  und verdeckte die Mitgliedertabelle (Rolle ändern, Entfernen nicht
  erreichbar, bis die Liste geschlossen wurde).
- Unit-Tests liefen gegen den Redesign-Kern nicht: PageControllerTest übergab
  8 statt 9 Konstruktorargumente, GroupsCollectionTest prüfte die
  Adminrolle über einen Mock ohne isAdmin(), dynamische Eigenschaften in 7
  Testklassen. Neu: Test für canCreateGroups der App-Seite und für die
  Gruppenliste von Nicht-Admins (205 Tests).

### Changed

- Keine Links mehr auf Upstream-Domains (CHANGELOG als "Upstream #N"),
  info.xml-Autor BW-Tech GmbH, README neu; tote Upstream-CI entfernt
  (sonar-project.properties, Transifex-Konfiguration l10n/.tx).

## [0.10.2] - 2026-08-13

### Changed

- Produktname, Beschreibung und uebersetzte Zeichenketten nennen owncloud.online;
  Verweise auf Fehlerbereich, Repository und Dokumentation zeigen auf das eigene
  Repository. Screenshots aus fremden Repositories entfernt.

## [0.9.1] - 2024-04-11

 - Upstream #626 - fix: implement hooks to properly cleanup users upon complete removal


## [0.9.0] - 2024-02-21

 - Upstream #610 - fix: drop JavaScript function tipsy() in favor of bootstrap tooltip
 - Core 10.15.0 will require this.


## [0.8.0] - 2023-10-25

### Added

 - Upstream #603 - Add Menu Icon

### Fixed

 - Upstream #605 - fix: prevent non-admins from retrieving all customgroups
 - Upstream #611 - fix: Fix missing where clause in inGroupByUri()


## [0.7.2] - 2023-08-11

### Changed

 - Upstream #578 - [full-ci] Adjust dispatch calls for Symfony 5
 - Minimum core version 10.11, minimum php version 7.4
 - Dependencies updated
 - Strings updated


## [0.7.1] - 2023-09-16

### Fixed

 - Upstream #536 - Fix 'Import as CSV'-button alignment on small screens
 - Translation updates


## [0.7.0] - 2022-08-19

### Added

 - Upstream #513 - Respect sharing autocompletion personal setting
 - Upstream #521 - feat: add guest invitation
 - Upstream #522 - Implement batch action for inviting users to groups


## [0.6.2] - 2021-06-23

### Added

- Implement UI and client handling for CSV import -  Upstream #415
- feat: export and import group members as csv - Upstream #409

### Fixed

- Fix wrong UI messages when changing your own group role as admin - Upstream #445
- Improve UI when trying the change the role of a group admin - Upstream #443
- Use group id for csv import - Upstream #442
- Change absolute notification URL to a relative one - Upstream #419

## [0.6.1] - 2021-03-05

### Changed

- [Security] Bump http-proxy from 1.16.2 to 1.18.1 -  Upstream #367
- [Security] Bump js-yaml from 3.10.0 to 3.14.1 - Upstream #380


## [0.6.0] - 2020-02-06

### Changed

- Update server min-version - Upstream #308

## [0.5.1] - 2020-01-28

### Fixed

- Validation for max allowed number of chars in custom groups name - Upstream #291
- Allow user to add to group even when enumeration to group is imposed - Upstream #293

### Changed

- [Security] Bump atob from 2.0.3 to 2.1.2 - Upstream #228
- [Security] Bump bower from 1.8.2 to 1.8.8 - Upstream #239
- [Security] Bump handlebars from 4.0.11 to 4.7.2 - Upstream #281, Upstream #295, Upstream #297, Upstream #299

## [0.5.0] - 2019-12-20

### Added

- Deny admin access when system config is set - Upstream #273
- Add Support for PHP 7.3 - Upstream #226

### Fixed

- App should only be shown if it is whitelisted for guests - Upstream #271
- [Security] Bump tar from 2.2.1 to 2.2.2 - Upstream #238
- [Security] Bump extend from 3.0.1 to 3.0.2 - Upstream #230
- [Security] Bump fstream from 1.0.11 to 1.0.12 - Upstream #232
- [Security] Bump mixin-deep from 1.3.0 to 1.3.2 - Upstream #235
- [Security] Bump sshpk from 1.13.1 to 1.16.1 - Upstream #236
- [Security] Bump stringstream from 0.0.5 to 0.0.6 - Upstream #237

### Changed

- Drop Support for PHP 7.0 - Upstream #275

## [0.4.1] - 2019-05-16

### Added

- Add validation for group creation - Upstream #197

## [0.4.0] - 2018-12-03

### Changed

- Set max version to 10 because core platform is switching to Semver

### Fixed

- Sort groups when requested from DB, fixes Oracle - Upstream #187
- Fix double encoding when displaying group name to delete - Upstream #165
- PHP 7.2 support - Upstream #164

## [0.3.6] - 2018-01-11

### Fixed

- restrict autocomplete results when sharing restrictions in place Upstream #117

## [0.3.5] - 2017-09-15

### Added

- Adding more dispatcher events for the app - Upstream #94 Upstream #103

### Changed

- Add option to prevent duplicate display names - Upstream #82
- Use event names with namespace - Upstream #102
- Set min version to 10.0.3 - Upstream #98
- Align package.json versions with core - Upstream #101

### Fixed

- Deleting a custom group now properly deletes associated shares Upstream #92
- Fix member search in member sidebar to use all search fields - Upstream #106
- Fix closing sidebar, reset selection - Upstream #96
- Improve spinners in members view - Upstream #97
- Prevent registering select event twice on autocomplete - Upstream #95

## [0.3.4] - 2017-07-19

### Added

- Added events for when administrating groups and members - Upstream #74

### Changed

- "Group admin" is now renamed to "Group owner" - Upstream #67
- Server administrators now always see "Administrator" as role - Upstream #67

### Fixed

- Ellipsize long member names - Upstream #78
- Fix when avatars are disabled - Upstream #68
- Implement method that returns users in group - Upstream #73
- Move restriction checkbox to the sharing section - Upstream #72
- Allow restricting group creation to subadmins - Upstream #70
- Show settings section above 'additional' in admin - Upstream #65
- Added enabling of testing app in the setup. - Upstream #71

## [0.3.1] - 2017-05-22

### Fixed

- Register section for the app in settings - Upstream #62

## [0.2.0] - 2017-04-18

### Added

- Added notification for removal of membership - Upstream #56
- Added notification for role changes - Upstream #56

### Changed

- Simplified notification subject line - Upstream #56

## [0.1.1] - 2017-03-27

### Added

- Publish notification when adding user - Upstream #28
- Added member autocomplete - Upstream #43
- Use display names for members - Upstream #45
- Adding app category to app info.xml - Upstream #48

### Fixed

- Fixes spinner issues - Upstream #47

