#!/bin/bash
# Testdaten für pruefe-customgroups.js auf einer Testinstanz (Standard /opt/oco-schnell).
#
# Aufruf (als root):
#   bash customgroups-testdaten.sh einrichten   zwei Probekonten (cgprobe-a,
#                                               cgprobe-b), App-Werte gesichert,
#                                               Bruteforce-Tabelle geleert
#   bash customgroups-testdaten.sh entfernen    Probekonten weg (samt ihrer
#                                               Mitgliedschaften), App-Werte
#                                               zurück
#
# Die Probe legt ihre Gruppen selbst an und löscht sie wieder.
#
# @copyright Copyright (c) 2026, BW-Tech GmbH
# @license AGPL-3.0
set -euo pipefail
ZIEL=${OC_ZIEL:-/opt/oco-schnell}
CG_PASS=${CG_PASS:-Cg-Probe-2026!x}
OCC="sudo -u www-data php8.4 $ZIEL/occ"
SICHERUNG=/root/.customgroups-probe-appwerte
SCHLUESSEL="only_subadmin_can_create allow_duplicate_names"

case "${1:-}" in
	einrichten)
		: > "$SICHERUNG"
		for k in $SCHLUESSEL; do
			if wert=$($OCC config:app:get customgroups "$k" 2>/dev/null); then
				echo "$k=$wert" >> "$SICHERUNG"
			else
				echo "$k" >> "$SICHERUNG"
			fi
			$OCC config:app:delete customgroups "$k" > /dev/null
		done
		for u in cgprobe-a cgprobe-b; do
			if ! $OCC user:list --output=json 2>/dev/null | grep -q "\"$u\""; then
				sudo -u www-data env OC_PASS="$CG_PASS" php8.4 "$ZIEL/occ" user:add --password-from-env "$u" > /dev/null
			fi
			# "&" im Anzeigenamen prüft die Maskierung in den Bestätigungsdialogen
			$OCC user:modify "$u" displayname "Probe & ${u#cgprobe-}" > /dev/null
		done
		# viele Anmeldungen der Probe sollen nicht in die Drosselung laufen
		(cd "$ZIEL" && sudo -u www-data php8.4 -r 'require "lib/base.php"; \OC::$server->getDatabaseConnection()->executeStatement("DELETE FROM *PREFIX*bruteforce_attempts");')
		echo "eingerichtet: cgprobe-a, cgprobe-b (Passwort \$CG_PASS)"
		;;
	entfernen)
		for u in cgprobe-a cgprobe-b; do
			$OCC user:delete "$u" > /dev/null 2>&1 || true
		done
		if [ -f "$SICHERUNG" ]; then
			while IFS= read -r zeile; do
				k=${zeile%%=*}
				if [ "$zeile" = "$k" ]; then
					$OCC config:app:delete customgroups "$k" > /dev/null
				else
					$OCC config:app:set customgroups "$k" --value="${zeile#*=}" > /dev/null
				fi
			done < "$SICHERUNG"
			rm -f "$SICHERUNG"
		fi
		echo "entfernt"
		;;
	*)
		echo "Aufruf: $0 einrichten|entfernen" >&2
		exit 2
		;;
esac
