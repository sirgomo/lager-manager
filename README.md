 life -- https://lager.ww-soft.de
 Lagermanager, Lagerverwaltung mit NestJS + TypeORM und MySQL, Angular als Frontend, Projekt pausiert!

Administratorpanel
Fertig:
- Benutzer hinzufügen, löschen, bearbeiten,
- Speichern von Firmeneinstellungen (Firmenname, Adresse usw.)
- Verwaltung von Verbesserungsvorschlägen, Benutzer können anonym Verbesserungsvorschläge einreichen
- Informationen zu durchgeführten Maßnahmen und deren Ergebnissen
- Testgeneratoren für Lagerplatzierung in Regalen (20 Regale, 5 Plätze in jedem Regal mit doppelten Plätzen für Waren, von 01-01-01-01 bis 20-59-04-01), Artikel,
- Automatische Platzierung der generierten Artikel im Lager

Lagerverwaltung:
- Anzeige von Regalplätzen,
- Bearbeitung von Regalplätzen,
- Überblick, wo gelagerte Paletten mit Waren sortiert nach MHD sind,
- Überblick über Waren in aktuellen Bestellungen
- Suchfunktion nach Artikel-ID, Name,

Datapflege:
- Anzeige von Spediteuren, Einstellung des maximalen Gewichts (in kg) für einen bestimmten Spediteur, sichtbar für den Verkäufer bei der Kommissionierung (z. B. Spediteur X kann maximal 22.500 kg und 33 Paletten aufnehmen)
- Debitoren - Hinzufügen, Bearbeiten, Löschen von Debitoren
- Verwaltung von Artikeln, Hinzufügen von neuen Artikeln, Bearbeiten von Artikeln
- Annahme von Waren, Speicherung des Warenannahmestatus

Verkauf:
- Erstellen von neuen Kommissionierungen,
- Anzeige meiner Kommissionierungen,
- Anzeige aller Kommissionierungen
- Verschieben von Artikeln von einer Kommissionierung zu einer anderen Kommissionierung
- Anzeige der Kommissionierung im PDF-Format

Warenausgangskontrolle:
- Anzeige von Kommissionierungen, Ändern ihres Status
- Drucken einer Packliste für die Palette
- Ändern des LKWs, auf dem sich die Palette befindet
- Kontrolle der Artikel auf der Palette
- Ändern des Gewichts und des Palettentyps

Kommissionierung:
- Starten durch Eingabe der Kommissionsnummer
- Erstellen einer neuen Palette
- Hinzufügen von Artikeln zur Palette (Artikelnummer oder UID)
- Zugriff auf die letzte Kommissionierung und die letzte aktive Palette nach dem erneuten Anmelden

Warenannahme
- Anzeige der aktuellen Buchungen
- Einlagern von Waren mit MHD
- Anzeige des aktuellen Füllstands jedes Regals, Anzeige, ob in einem bestimmten Regal freie Stellplätze oben sowie Static (Felder, aus denen die Kommissionier Waren entnimmt) vorhanden sind
- Anzeige, wo sich die Ware befindet, Static
- Auswahl des Palettentyps, wenn die Ware auf einer Palette gelagert wird

