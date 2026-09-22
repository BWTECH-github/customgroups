/**
 * Benutzerdefinierte Gruppen (customgroups) im Redesign, Ende zu Ende.
 *
 * Voraussetzung: customgroups-testdaten.sh einrichten (Konten cgprobe-a und
 * cgprobe-b, Anzeigenamen mit "&"). Die Probe legt ihre Gruppen, eine
 * Probedatei und eine Freigabe selbst an und räumt alles wieder weg.
 *
 * Geprüft wird:
 *   - Verwaltung (Teilen): beide Schalter speichern
 *   - Einstellungsseite und App-Seite zeigen das Anlegeformular
 *   - Gruppe anlegen (Name mit & < > "), doppelter Name abgelehnt
 *   - Umbenennen, bleibt nach Neuladen
 *   - Mitgliederleiste: per Tastatur öffnen, liegt in der Karte
 *   - Mitglied hinzufügen (Liste öffnet beim Hineinklicken), Rolle ändern
 *   - CSV-Export und -Import
 *   - Mitglied entfernen: Dialogtext ohne doppelte Maskierung
 *   - Benachrichtigung an das hinzugefügte Mitglied
 *   - Freigabe einer Datei an die Gruppe über den Freigabedialog; das
 *     Mitglied sieht die Datei
 *   - Mitglied verlässt die Gruppe (Dialogtext), Gruppe verschwindet bei ihm
 *   - "Nur Gruppen-Administratoren dürfen erstellen" blendet das Formular aus
 *   - Gruppe löschen (Dialogtext)
 *   - 400 px ohne waagerechtes Scrollen, keine Konsolenfehler
 *
 * Aufruf: OC_PASSWORD=... node tests/visual/pruefe-customgroups.js
 *   CG_PASS (Standard wie im Testdatenskript), OC_URL, OCC (occ-Präfix)
 *
 * @copyright Copyright (c) 2026, BW-Tech GmbH
 * @license AGPL-3.0
 */
'use strict';

let chromium;
try {
	({ chromium } = require('playwright'));
} catch (e) {
	({ chromium } = require('C:/git/owncloud.online-redesign/node_modules/playwright'));
}
const { execSync } = require('child_process');

const BASIS = process.env.OC_URL || 'http://127.0.0.1:18130';
const PASSWORT = process.env.OC_PASSWORD;
const CG_PASS = process.env.CG_PASS || 'Cg-Probe-2026!x';
const OCC = process.env.OCC || 'wsl.exe -u root -e sudo -u www-data php8.4 /opt/oco-schnell/occ';
if (!PASSWORT) {
	console.error('OC_PASSWORD fehlt.');
	process.exit(2);
}

const NAME = 'Probe & <Team> "1"';
const NAME_NEU = 'Probe & Team 2';
const DATEI = 'CG-Probe.txt';

const ergebnisse = [];
function pruefe(name, ok, zusatz) {
	ergebnisse.push({ name, ok: ok === true, zusatz: zusatz === undefined ? '' : String(zusatz) });
}

function basic(benutzer, passwort) {
	return 'Basic ' + Buffer.from(benutzer + ':' + passwort).toString('base64');
}

async function dav(methode, pfad, benutzer, passwort, kopf, rumpf) {
	const r = await fetch(BASIS + pfad, {
		method: methode,
		headers: Object.assign({ Authorization: basic(benutzer, passwort), 'OCS-APIRequest': 'true' }, kopf || {}),
		body: rumpf,
	});
	return { status: r.status, text: await r.text() };
}

// Probegruppen (Anzeigename beginnt mit "Probe") und Probedatei entfernen
async function aufraeumen() {
	const liste = await dav('PROPFIND', '/remote.php/dav/customgroups/groups/', 'admin', PASSWORT, { Depth: '1', 'Content-Type': 'application/xml' },
		'<?xml version="1.0"?><d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns"><d:prop><oc:display-name/></d:prop></d:propfind>');
	const antworten = liste.text.split(/<d:response>/).slice(1);
	for (const a of antworten) {
		const href = (a.match(/<d:href>([^<]+)<\/d:href>/) || [])[1];
		const anzeige = (a.match(/<oc:display-name>([^<]*)<\/oc:display-name>/) || [])[1] || '';
		if (href && /^Probe/.test(anzeige.replace(/&amp;/g, '&')) && !/\/groups\/$/.test(href)) {
			await dav('DELETE', href, 'admin', PASSWORT);
		}
	}
	await dav('DELETE', '/remote.php/dav/files/admin/' + DATEI, 'admin', PASSWORT);
}

async function anmelden(browser, benutzer, passwort, breite) {
	const kontext = await browser.newContext({ locale: 'de-DE', viewport: { width: breite || 1440, height: 900 } });
	const seite = await kontext.newPage();
	const fehler = [];
	seite.on('console', (m) => {
		const quelle = m.location().url || '';
		if (m.type() === 'error' && !/\/remote\.php\/dav\/files\/admin\/CG-Probe\.txt$/.test(quelle)) {
			fehler.push(m.text().slice(0, 160) + ' @ ' + quelle.slice(0, 120));
		}
	});
	seite.on('pageerror', (e) => fehler.push('Seitenfehler: ' + e.message.slice(0, 200)));
	// Fehlantworten mit Methode, um Konsolenmeldungen zuordnen zu können
	const antworten = [];
	seite.on('response', (r) => {
		if (r.status() >= 400) {
			antworten.push(r.request().method() + ' ' + r.status() + ' ' + decodeURIComponent(r.url().replace(BASIS, '')).slice(0, 120));
		}
	});
	await seite.goto(BASIS + '/index.php/login', { waitUntil: 'domcontentloaded' });
	await seite.fill('#user', benutzer);
	await seite.fill('#password', passwort);
	await Promise.all([seite.waitForNavigation({ timeout: 60000 }).catch(() => {}), seite.click('#submit, button[type=submit], input[type=submit]')]);
	return { kontext, seite, fehler, antworten };
}

// OC.Notification.showTemporary mitschneiden (Meldungen des Plugins)
async function meldungenMitschneiden(seite) {
	await seite.evaluate(() => {
		window.__meldungen = [];
		if (window.OC && OC.Notification && !OC.Notification.__probe) {
			const alt = OC.Notification.showTemporary;
			OC.Notification.showTemporary = function (text) {
				window.__meldungen.push(String(text));
				return alt.apply(this, arguments);
			};
			OC.Notification.__probe = true;
		}
	});
}

async function gruppenSeite(seite, pfad) {
	await seite.goto(BASIS + (pfad || '/index.php/settings/personal?sectionid=customgroups'), { waitUntil: 'load' });
	await seite.waitForFunction(() => {
		const c = document.querySelector('#customgroups .groups-container');
		return !!c && !c.classList.contains('icon-loading') && !document.querySelector('#customgroups .loading:not(.hidden)');
	}, null, { timeout: 30000 }).catch(() => {});
	await seite.waitForTimeout(800);
	await meldungenMitschneiden(seite);
}

function zeile(seite, name) {
	return seite.locator('#customgroups tr.group').filter({ has: seite.locator('.group-display-name', { hasText: name }) });
}

// sichtbarer Dialog des Kerns: Text und Knöpfe
async function dialog(seite) {
	await seite.waitForFunction(() => Array.from(document.querySelectorAll('.oc-dialog')).some((d) => d.getClientRects().length > 0), null, { timeout: 10000 }).catch(() => {});
	return seite.evaluate(() => {
		const d = Array.from(document.querySelectorAll('.oc-dialog')).find((x) => x.getClientRects().length > 0);
		if (!d) {
			return null;
		}
		const inhalt = d.querySelector('.oc-dialog-content');
		return { text: (inhalt ? inhalt.textContent : d.textContent).replace(/\s+/g, ' ').trim() };
	});
}

async function dialogJa(seite) {
	const knopf = seite.locator('.oc-dialog:visible .oc-dialog-buttonrow button.primary').first();
	await knopf.click({ timeout: 10000 }).catch(() => {});
	await seite.waitForFunction(() => !Array.from(document.querySelectorAll('.oc-dialog')).some((d) => d.getClientRects().length > 0), null, { timeout: 10000 }).catch(() => {});
}

(async () => {
	execSync(OCC + ' config:app:delete customgroups only_subadmin_can_create');
	execSync(OCC + ' config:app:delete customgroups allow_duplicate_names');
	await aufraeumen();
	await dav('PUT', '/remote.php/dav/files/admin/' + DATEI, 'admin', PASSWORT, { 'Content-Type': 'text/plain' }, 'Probe für benutzerdefinierte Gruppen');

	const browser = await chromium.launch();
	const admin = await anmelden(browser, 'admin', PASSWORT);
	const s = admin.seite;

	// --- Verwaltung: Schalter speichern -------------------------------------
	await s.goto(BASIS + '/index.php/settings/admin?sectionid=sharing', { waitUntil: 'load' });
	const schalter = await s.evaluate(() => ['onlySubAdminCanCreate', 'allowDuplicateNames'].map((id) => {
		const e = document.getElementById(id);
		const l = document.querySelector('label[for="' + id + '"]');
		return { id, da: !!e, beschriftet: !!l && l.getClientRects().length > 0 && l.textContent.trim() !== '' };
	}));
	pruefe('Verwaltung: beide Schalter mit Beschriftung', schalter.every((x) => x.da && x.beschriftet), JSON.stringify(schalter));
	await Promise.all([
		s.waitForResponse((r) => /appconfig|apps\/provisioning_api|config\/apps/.test(r.url()) && r.request().method() !== 'GET', { timeout: 15000 }).catch(() => null),
		s.click('label[for="allowDuplicateNames"]'),
	]);
	await s.waitForTimeout(800);
	const gespeichert = execSync(OCC + ' config:app:get customgroups allow_duplicate_names', { encoding: 'utf8' }).trim();
	pruefe('Verwaltung: Schalter speichert', gespeichert === 'true', gespeichert);
	await s.click('label[for="allowDuplicateNames"]');
	await s.waitForTimeout(800);
	const zurueck = execSync(OCC + ' config:app:get customgroups allow_duplicate_names', { encoding: 'utf8' }).trim();
	pruefe('Verwaltung: Schalter zurück', zurueck === 'false', zurueck);

	// --- App-Seite und Einstellungsseite ---------------------------------------
	await gruppenSeite(s, '/index.php/apps/customgroups/');
	pruefe('App-Seite: Anlegeformular vorhanden', await s.locator('#customgroups form[name=customGroupsCreationForm] input[name=groupName]').count() === 1);
	await gruppenSeite(s);
	const formular = s.locator('#customgroups form[name=customGroupsCreationForm] input[name=groupName]');
	pruefe('Einstellungsseite: Anlegeformular sichtbar', await formular.isVisible().catch(() => false));

	// --- anlegen -----------------------------------------------------------------
	await formular.fill(NAME);
	await formular.press('Enter');
	await zeile(s, NAME).first().waitFor({ timeout: 15000 }).catch(() => {});
	const angelegt = await s.evaluate((n) => Array.from(document.querySelectorAll('#customgroups tr.group')).map((tr) => ({
		name: tr.querySelector('.group-display-name').textContent,
		rolle: tr.querySelector('.role-display-name').textContent.trim(),
	})).filter((x) => x.name === n), NAME);
	pruefe('Gruppe anlegen: Name exakt (& < > ")', angelegt.length === 1, JSON.stringify(angelegt));
	pruefe('Gruppe anlegen: eigene Rolle angezeigt', angelegt.length === 1 && angelegt[0].rolle !== '', angelegt[0] && angelegt[0].rolle);

	await s.evaluate(() => { window.__meldungen = []; });
	const vorDuplikat = { fehler: admin.fehler.length, antworten: admin.antworten.length };
	await formular.fill(NAME);
	await formular.press('Enter');
	await s.waitForFunction(() => window.__meldungen.length > 0, null, { timeout: 10000 }).catch(() => {});
	const doppelt = await s.evaluate((n) => ({
		zeilen: Array.from(document.querySelectorAll('#customgroups tr.group .group-display-name')).filter((x) => x.textContent === n).length,
		meldung: window.__meldungen.join(' | '),
	}), NAME);
	pruefe('doppelter Name abgelehnt mit Meldung', doppelt.zeilen === 1 && doppelt.meldung !== '', JSON.stringify(doppelt));
	// Gewollt: MKCOL auf die belegte Adresse (405), Ausweichadresse mit
	// belegtem Anzeigenamen (409). Nur genau diese Antworten sind hier erlaubt.
	const duplikatAntworten = admin.antworten.slice(vorDuplikat.antworten);
	pruefe('doppelter Name: nur die erwarteten Antworten 405 und 409', duplikatAntworten.length === 2
		&& /^MKCOL 405 /.test(duplikatAntworten[0]) && /^MKCOL 409 /.test(duplikatAntworten[1]), duplikatAntworten.join(' | '));
	admin.fehler.splice(vorDuplikat.fehler, duplikatAntworten.length);

	// --- umbenennen ------------------------------------------------------------
	// Text im Anlegefeld, der nicht abgeschickt wurde, darf beim Umbenennen
	// (Enter im Umbenennen-Formular) keine Gruppe anlegen.
	await formular.fill('Probe Rest');
	await s.evaluate(() => { window.__ohneNeuladen = true; });
	const z = zeile(s, NAME).first();
	await z.hover({ timeout: 5000 }).catch(() => {});
	await z.locator('.action-rename-group').click({ timeout: 10000 }).catch(() => {});
	const umbenennen = s.locator('#customgroups .group-rename-form input');
	await umbenennen.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
	const vorbelegt = await umbenennen.inputValue().catch(() => '');
	await umbenennen.fill(NAME_NEU);
	await umbenennen.press('Enter');
	await zeile(s, NAME_NEU).first().waitFor({ timeout: 15000 }).catch(() => {});
	pruefe('Umbenennen: Feld mit altem Namen vorbelegt', vorbelegt === NAME, vorbelegt);
	await s.waitForTimeout(2500);
	pruefe('Umbenennen per Enter lädt die Seite nicht neu', await s.evaluate(() => window.__ohneNeuladen === true));
	const gruppenNachUmbenennen = await dav('PROPFIND', '/remote.php/dav/customgroups/groups/', 'admin', PASSWORT, { Depth: '1', 'Content-Type': 'application/xml' },
		'<?xml version="1.0"?><d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns"><d:prop><oc:display-name/></d:prop></d:propfind>');
	const probeNamen = (gruppenNachUmbenennen.text.match(/<oc:display-name>Probe[^<]*<\/oc:display-name>/g) || []).map((x) => x.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'));
	pruefe('Umbenennen legt keine Gruppe aus dem Anlegefeld an', probeNamen.length === 1 && probeNamen[0] === NAME_NEU, probeNamen.join(' | '));
	await gruppenSeite(s);
	pruefe('Umbenennen: bleibt nach Neuladen', await zeile(s, NAME_NEU).count() === 1);

	// --- Mitgliederleiste per Tastatur -----------------------------------------
	await zeile(s, NAME_NEU).first().focus();
	await s.keyboard.press('Enter');
	await s.waitForFunction(() => {
		const p = document.querySelector('#customgroups .members-container');
		return !!p && !p.classList.contains('disappear') && !!p.querySelector('.group-name-title-display');
	}, null, { timeout: 15000 }).catch(() => {});
	await s.waitForSelector('#customgroups tr.group-member', { timeout: 15000 }).catch(() => {});
	const leiste = await s.evaluate(() => {
		const karte = document.querySelector('#customgroups');
		const p = document.querySelector('#customgroups .members-container');
		const t = p && p.querySelector('.group-name-title-display');
		const k = karte.getBoundingClientRect();
		const r = p ? p.getBoundingClientRect() : null;
		return {
			offen: !!p && !p.classList.contains('disappear'),
			titel: t ? t.textContent : '',
			innen: !!r && r.left >= k.left - 1 && r.right <= k.right + 1,
			karte: Math.round(k.width),
			mitglieder: Array.from(document.querySelectorAll('#customgroups tr.group-member')).map((x) => x.getAttribute('data-id')),
		};
	});
	pruefe('Mitgliederleiste öffnet per Enter mit Gruppennamen', leiste.offen && leiste.titel === NAME_NEU, JSON.stringify(leiste));
	pruefe('Mitgliederleiste liegt in der Karte', leiste.innen && leiste.karte > 700, JSON.stringify(leiste));
	pruefe('Anleger ist Mitglied', leiste.mitglieder.indexOf('admin') !== -1, leiste.mitglieder.join(','));

	// --- Mitglied hinzufügen ---------------------------------------------------
	const feld = s.locator('#customgroups .member-input-field');
	await feld.click({ timeout: 10000 }).catch(() => {});
	await s.waitForFunction(() => Array.from(document.querySelectorAll('ul.ui-autocomplete li')).some((l) => l.getClientRects().length > 0), null, { timeout: 10000 }).catch(() => {});
	const beimKlick = await s.evaluate(() => Array.from(document.querySelectorAll('ul.ui-autocomplete li')).filter((l) => l.getClientRects().length > 0).length);
	pruefe('Mitgliedersuche: Liste öffnet beim Hineinklicken', beimKlick > 0, beimKlick);
	await feld.fill('cgprobe-a');
	const treffer = s.locator('ul.ui-autocomplete li:visible').filter({ hasText: 'Probe & a' }).first();
	await treffer.waitFor({ timeout: 10000 }).catch(() => {});
	const trefferText = await treffer.textContent().catch(() => '');
	await treffer.click().catch(() => {});
	await s.waitForSelector('#customgroups tr.group-member[data-id="cgprobe-a"]', { timeout: 15000 }).catch(() => {});
	pruefe('Mitglied hinzufügen: Anzeigename in der Liste exakt', /Probe & a/.test(trefferText) && !/&amp;/.test(trefferText), trefferText.replace(/\s+/g, ' ').trim());
	pruefe('Mitglied hinzufügen: Zeile erscheint', await s.locator('#customgroups tr.group-member[data-id="cgprobe-a"]').count() === 1);
	// Die Vorschlagsliste darf danach nicht ungefragt über der Tabelle liegen
	await s.waitForTimeout(1500);
	const listeDanach = await s.evaluate(() => ({
		offen: Array.from(document.querySelectorAll('ul.ui-autocomplete')).some((u) => u.getClientRects().length > 0),
		fokus: document.activeElement && document.activeElement.classList.contains('member-input-field'),
	}));
	pruefe('Mitglied hinzufügen: Feld behält Fokus, Liste bleibt zu', listeDanach.fokus && !listeDanach.offen, JSON.stringify(listeDanach));

	// --- Rolle ändern ----------------------------------------------------------
	const rolleVorher = await s.locator('#customgroups tr.group-member[data-id="cgprobe-a"] .role-display-name').textContent().catch(() => '');
	const mz = s.locator('#customgroups tr.group-member[data-id="cgprobe-a"]');
	await mz.hover({ timeout: 5000 }).catch(() => {});
	await mz.locator('.action-change-member-role').click().catch(() => {});
	await s.waitForFunction((alt) => {
		const e = document.querySelector('#customgroups tr.group-member[data-id="cgprobe-a"] .role-display-name');
		return !!e && e.textContent !== alt;
	}, rolleVorher, { timeout: 15000 }).catch(() => {});
	const rolleNachher = await s.locator('#customgroups tr.group-member[data-id="cgprobe-a"] .role-display-name').textContent().catch(() => '');
	pruefe('Rolle ändern', rolleNachher !== '' && rolleNachher !== rolleVorher, rolleVorher + ' -> ' + rolleNachher);

	// eigene Rolle: Rückfrage mit Gruppennamen, hier abgebrochen
	const eigene = s.locator('#customgroups tr.group-member[data-id="admin"]');
	await eigene.hover({ timeout: 5000 }).catch(() => {});
	await eigene.locator('.action-change-member-role').click().catch(() => {});
	const rollenDialog = await dialog(s);
	pruefe('eigene Rolle: Dialog nennt den Gruppennamen unmaskiert', !!rollenDialog && rollenDialog.text.indexOf('"' + NAME_NEU + '"') !== -1 && rollenDialog.text.indexOf('&amp;') === -1, rollenDialog && rollenDialog.text);
	if (rollenDialog) {
		await s.locator('.oc-dialog:visible .oc-dialog-buttonrow button:not(.primary)').first().click({ timeout: 10000 }).catch(() => {});
		await s.waitForTimeout(800);
	}
	const eigeneRolle = await s.locator('#customgroups tr.group-member[data-id="admin"] .role-display-name').textContent().catch(() => '');
	pruefe('eigene Rolle: Abbrechen ändert nichts', eigeneRolle === rolleNachher, eigeneRolle);

	// --- CSV -------------------------------------------------------------------
	const export_ = await s.evaluate(async () => {
		const a = document.querySelector('#customgroups .action-export-csv');
		if (!a) {
			return { da: false };
		}
		const r = await fetch(a.href, { headers: { requesttoken: OC.requestToken } });
		return { da: true, status: r.status, typ: r.headers.get('Content-Type'), text: await r.text() };
	});
	pruefe('CSV-Export enthält Mitglieder mit Rolle', export_.da && export_.status === 200 && /cgprobe-a,admin/.test(export_.text) && /admin,admin/.test(export_.text), JSON.stringify(export_).slice(0, 160));
	await s.evaluate(() => { window.__meldungen = []; });
	await s.setInputFiles('#custom-group-import-elem', { name: 'import.csv', mimeType: 'text/csv', buffer: Buffer.from('cgprobe-b,member\n') });
	await s.waitForSelector('#customgroups tr.group-member[data-id="cgprobe-b"]', { timeout: 15000 }).catch(() => {});
	const importMeldung = await s.evaluate(() => window.__meldungen.join(' | '));
	pruefe('CSV-Import fügt Mitglied hinzu und meldet Erfolg', await s.locator('#customgroups tr.group-member[data-id="cgprobe-b"]').count() === 1 && importMeldung !== '', importMeldung);

	// --- Mitglied entfernen ----------------------------------------------------
	const mb = s.locator('#customgroups tr.group-member[data-id="cgprobe-b"]');
	await mb.hover({ timeout: 5000 }).catch(() => {});
	await mb.locator('.action-delete-member').click().catch(() => {});
	const entfernenDialog = await dialog(s);
	pruefe('Mitglied entfernen: Dialog nennt den Namen unmaskiert', !!entfernenDialog && entfernenDialog.text.indexOf('"Probe & b"') !== -1 && entfernenDialog.text.indexOf('&amp;') === -1, entfernenDialog && entfernenDialog.text);
	if (entfernenDialog) {
		await dialogJa(s);
	}
	await s.waitForFunction(() => !document.querySelector('#customgroups tr.group-member[data-id="cgprobe-b"]'), null, { timeout: 15000 }).catch(() => {});
	pruefe('Mitglied entfernen: Zeile weg', await s.locator('#customgroups tr.group-member[data-id="cgprobe-b"]').count() === 0);

	// --- Benachrichtigung an cgprobe-a -----------------------------------------
	const benachrichtigung = await dav('GET', '/ocs/v2.php/apps/notifications/api/v1/notifications?format=json', 'cgprobe-a', CG_PASS);
	let betreffe = [];
	try {
		betreffe = JSON.parse(benachrichtigung.text).ocs.data.filter((n) => n.app === 'customgroups').map((n) => n.subject);
	} catch (e) {
		betreffe = ['Antwort ' + benachrichtigung.status];
	}
	pruefe('Benachrichtigung an das neue Mitglied', betreffe.some((b) => b.indexOf(NAME_NEU) !== -1 || b.indexOf(NAME) !== -1), betreffe.join(' | '));

	// --- Freigabe an die Gruppe über den Freigabedialog -------------------------
	await s.goto(BASIS + '/index.php/apps/files/', { waitUntil: 'domcontentloaded' });
	await s.waitForFunction((n) => {
		const tr = document.querySelector('#fileList tr[data-file="' + n + '"]');
		return !!(tr && tr.querySelector('input.selectCheckBox'));
	}, DATEI, { timeout: 30000 }).catch(() => {});
	await s.evaluate(() => {
		if (window.jQuery && jQuery.colorbox && document.getElementById('colorbox') && document.getElementById('colorbox').getClientRects().length) {
			jQuery.colorbox.close();
		}
	});
	await s.evaluate((n) => document.querySelector('#fileList tr[data-file="' + n + '"] input.selectCheckBox').click(), DATEI);
	await s.waitForFunction(() => !!document.querySelector('.oco-selectbar [data-action="share"]'), null, { timeout: 20000 }).catch(() => {});
	await s.evaluate(() => document.querySelector('.oco-selectbar [data-action="share"]').click());
	const teilenFeld = s.locator('#app-sidebar .shareWithField').first();
	await teilenFeld.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
	await teilenFeld.fill('Probe & Team');
	const gruppenTreffer = s.locator('ul.ui-autocomplete li:visible').filter({ hasText: NAME_NEU }).first();
	await gruppenTreffer.waitFor({ timeout: 15000 }).catch(() => {});
	const gruppenTrefferText = (await gruppenTreffer.textContent().catch(() => '')).replace(/\s+/g, ' ').trim();
	pruefe('Freigabedialog findet die Gruppe', gruppenTrefferText.indexOf(NAME_NEU) !== -1, gruppenTrefferText);
	await gruppenTreffer.click().catch(() => {});
	await s.waitForFunction((n) => Array.from(document.querySelectorAll('#app-sidebar .shareWithList > li')).some((li) => li.textContent.indexOf(n) !== -1), NAME_NEU, { timeout: 15000 }).catch(() => {});
	pruefe('Freigabe an die Gruppe steht in der Liste', await s.evaluate((n) => Array.from(document.querySelectorAll('#app-sidebar .shareWithList > li')).some((li) => li.textContent.indexOf(n) !== -1), NAME_NEU));
	const mitgliedSieht = await dav('PROPFIND', '/remote.php/dav/files/cgprobe-a/' + DATEI, 'cgprobe-a', CG_PASS, { Depth: '0' });
	pruefe('Mitglied sieht die freigegebene Datei', mitgliedSieht.status === 207, mitgliedSieht.status);

	// --- cgprobe-a verlässt die Gruppe ----------------------------------------
	const a = await anmelden(browser, 'cgprobe-a', CG_PASS);
	await gruppenSeite(a.seite);
	const aZeile = zeile(a.seite, NAME_NEU).first();
	const aRolle = await aZeile.locator('.role-display-name').textContent().catch(() => '');
	pruefe('Mitglied sieht die Gruppe mit Rolle', aRolle.trim() !== '', aRolle);
	// Mitgliederliste künstlich verzögern: "Verlassen" wird geklickt, bevor
	// der eigene Eintrag geladen ist (früher "reading 'destroy'")
	await a.seite.route(/\/remote\.php\/dav\/customgroups\/groups\/[^/]+\/$/, async (route) => {
		if (route.request().method() === 'PROPFIND') {
			await new Promise((r) => setTimeout(r, 5000));
		}
		await route.continue().catch(() => {});
	});
	await aZeile.locator('.group-display-name').click().catch(() => {});
	const verlassen = a.seite.locator('#customgroups .action-leave-group');
	await verlassen.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
	const nochNichtGeladen = await a.seite.evaluate(() => document.querySelectorAll('#customgroups tr.group-member').length === 0);
	pruefe('Verlassen: Mitgliederliste beim Klick noch nicht geladen (Race nachgestellt)', nochNichtGeladen);
	await verlassen.click().catch(() => {});
	const verlassenDialog = await dialog(a.seite);
	pruefe('Verlassen: Dialog nennt den Gruppennamen unmaskiert', !!verlassenDialog && verlassenDialog.text.indexOf('"' + NAME_NEU + '"') !== -1 && verlassenDialog.text.indexOf('&amp;') === -1, verlassenDialog && verlassenDialog.text);
	if (verlassenDialog) {
		await dialogJa(a.seite);
	}
	await a.seite.waitForFunction((n) => !Array.from(document.querySelectorAll('#customgroups tr.group .group-display-name')).some((x) => x.textContent === n), NAME_NEU, { timeout: 15000 }).catch(() => {});
	pruefe('Verlassen: Gruppe verschwindet beim Mitglied', await zeile(a.seite, NAME_NEU).count() === 0);
	pruefe('keine Konsolenfehler (Mitglied)', a.fehler.length === 0, a.fehler.join(' | '));
	await a.kontext.close();

	// --- nur Gruppen-Administratoren dürfen erstellen ---------------------------
	execSync(OCC + ' config:app:set customgroups only_subadmin_can_create --value=true');
	const b = await anmelden(browser, 'cgprobe-b', CG_PASS, 400);
	await gruppenSeite(b.seite);
	pruefe('Einschränkung: kein Anlegeformular für normale Konten', await b.seite.locator('#customgroups form[name=customGroupsCreationForm]').count() === 0);
	const breite = await b.seite.evaluate(() => ({ doc: document.documentElement.scrollWidth, fenster: window.innerWidth }));
	pruefe('400 px: kein waagerechtes Scrollen', breite.doc <= breite.fenster + 1, JSON.stringify(breite));
	pruefe('keine Konsolenfehler (400 px)', b.fehler.length === 0, b.fehler.join(' | '));
	await b.kontext.close();
	execSync(OCC + ' config:app:delete customgroups only_subadmin_can_create');

	// --- löschen ---------------------------------------------------------------
	await gruppenSeite(s);
	const dz = zeile(s, NAME_NEU).first();
	await dz.hover({ timeout: 5000 }).catch(() => {});
	await dz.locator('.action-delete-group').click().catch(() => {});
	const loeschDialog = await dialog(s);
	pruefe('Löschen: Dialog nennt den Gruppennamen unmaskiert', !!loeschDialog && loeschDialog.text.indexOf('"' + NAME_NEU + '"') !== -1 && loeschDialog.text.indexOf('&amp;') === -1, loeschDialog && loeschDialog.text);
	if (loeschDialog) {
		await dialogJa(s);
	}
	await s.waitForFunction((n) => !Array.from(document.querySelectorAll('#customgroups tr.group .group-display-name')).some((x) => x.textContent === n), NAME_NEU, { timeout: 15000 }).catch(() => {});
	pruefe('Löschen: Gruppe weg', await zeile(s, NAME_NEU).count() === 0);

	pruefe('keine Konsolenfehler (Verwaltung)', admin.fehler.length === 0, admin.fehler.join(' | ') + ' || Antworten: ' + admin.antworten.join(' | '));
	await browser.close();
	await aufraeumen();

	let fehler = 0;
	for (const e of ergebnisse) {
		console.log((e.ok ? 'OK    ' : 'FEHL  ') + e.name + (e.zusatz ? '  (' + e.zusatz + ')' : ''));
		if (!e.ok) {
			fehler++;
		}
	}
	console.log('\n' + (ergebnisse.length - fehler) + '/' + ergebnisse.length + ' bestanden');
	process.exit(fehler === 0 ? 0 : 1);
})().catch(async (e) => {
	console.error(e);
	try {
		execSync(OCC + ' config:app:delete customgroups only_subadmin_can_create');
		await aufraeumen();
	} catch (x) {
		// Aufräumen ist best effort
	}
	process.exit(2);
});
