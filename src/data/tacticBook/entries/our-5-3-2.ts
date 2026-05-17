import type { TacticBookEntry } from '../types'

export const entriesOur532: TacticBookEntry[] = [
  {
    id: '5-3-2_vs_4-2-3-1',
    ourSystem: '5-3-2',
    opponentSystem: '4-2-3-1',
    rating: 'vorteilhaft',
    character:
      'Meist gutes Verteidigungsduell für uns, wenn wir den Zehnerraum kontrollieren und nach Ballgewinn nicht nur tief bleiben. Unsere Fünferkette nimmt Tiefe und Flanken auf, aber Entlastung entsteht nur über klare vertikale erste Pässe neben ihre Außenverteidiger.',
    phases: {
      ownPossession: {
        spaces: [
          'Konterräume neben ihren Außenverteidigern sind unser wichtigster Zielraum.',
          'Der Raum hinter ihrer Doppelsechs öffnet sich, wenn eine Spitze klatschen lässt und ein Achter nachrückt.',
          'Unsere Wingbacks brauchen nach Ballbesitzphasen klare Anschlussräume, dürfen aber nicht beide gleichzeitig hoch stehen.',
          'Zweite-Ball-Zonen vor ihrer Viererkette werden wichtig, wenn wir direkt auf die Spitzen spielen.',
          'Der ballferne Halbraum ist offen, wenn ihr 4-2-3-1 zur Ballseite presst.',
        ],
        advantages: [
          'Mit zwei Spitzen können wir ihre Innenverteidiger direkt binden und Ablagen für nachrückende Achter erzeugen.',
          'Unsere Wingbacks können nach Verlagerungen aus tiefer Position Tempo gegen ihre Außenverteidiger aufnehmen.',
          'Durch die Dreier-Mittelfeldreihe haben wir genug Spieler für zweite Bälle und Rückraumsicherung.',
        ],
        dangers: [
          'Wenn wir nur lang spielen, kommen die Bälle schnell gegen ihre Doppelsechs zurück.',
          'Unsere Außenspieler müssen weite Wege gehen und können im Aufbau zu spät Anschluss finden.',
          'Zu langsame Zirkulation lässt ihr 4-2-3-1 sauber in die Pressingordnung kommen.',
          'Bei Ballverlusten mit hohen Wingbacks wird der Raum neben unseren Halbverteidigern offen.',
        ],
        keyActions: [
          'Eine Spitze bindet tief, die andere lässt für den nachrückenden Achter klatschen.',
          'Wingback nach Ballverlagerung sofort in den Raum neben ihrem Außenverteidiger schicken.',
          'Zentrale Achter bleiben gestaffelt für zweite Bälle und Rückpässe.',
          'Halbverteidiger nutzen Andribbeln, wenn ihre Flügelspieler nur passiv anlaufen.',
          'Nach langen Bällen sofort auf die zweite Aktion vorbereitet sein.',
        ],
      },
      afterLoss: {
        spaces: [
          'Der Zehnerraum vor unserer Fünferkette muss sofort geschlossen werden.',
          'Halbräume vor unserer Kette sind gefährlich, wenn ihre Flügelspieler einrücken.',
          'Der Rückraum vor unserer Abwehr kann offen werden, wenn beide Achter dem Ball hinterherlaufen.',
          'Die Außenbahn hinter unserem Wingback ist ihr erster Umschaltraum.',
        ],
        advantages: [
          'Unsere letzte Linie bleibt mit drei Innenverteidigern stabil gegen ihre einzelne Spitze.',
          'Unsere zentrale Kompaktheit erschwert direkte Pässe auf ihren Zehner.',
          'Ein Achter kann Druck machen, während Sechs und Halbverteidiger den Raum dahinter sichern.',
        ],
        dangers: [
          'Ihr Zehner kann nach Ballverlust frei aufdrehen, wenn unsere Sechs herausgezogen wird.',
          'Rückraum kann offen werden, wenn die Achter zu tief in den ersten Druck springen.',
          'Außenspieler müssen lange Wege zurückgehen, besonders nach eigenen Angriffen über Wingback.',
        ],
        keyActions: [
          'Nach Ballverlust Zentrum sofort verdichten und den Zehner nicht frei drehen lassen.',
          'Ballnaher Achter stellt den ersten Pass auf ihre Doppelsechs.',
          'Sechs bleibt vor der Fünferkette und sichert den Zehnerraum.',
          'Ballnaher Wingback sprintet zurück in die Kette, wenn der Gegenpressingzugriff fehlt.',
          'Einer sichert, einer startet: nur ein zentraler Spieler darf aggressiv nach vorne jagen.',
        ],
      },
      oppPossession: {
        spaces: [
          'Der Zehnerraum ist die Schlüsselzone, weil ihr 4-2-3-1 dort Verbindungen sucht.',
          'Halbräume vor unserer Kette müssen zwischen Achter, Sechs und Halbverteidiger übergeben werden.',
          'Außenbahnen werden kontrolliert, wenn Wingback und Halbverteidiger klare Übergaben haben.',
          'Der Rückraum nach Flanken darf nicht unbesetzt bleiben.',
          'Die Passwege von ihrer Doppelsechs auf Zehner und Flügel sind unsere Pressingauslöser.',
        ],
        advantages: [
          'Unsere letzte Linie ist stabil gegen ihre einzelne Spitze.',
          'Unsere Flankenverteidigung ist mit fünf Spielern in der letzten Linie stark.',
          'Das Zentrum bleibt durch Sechs und zwei Achter kompakt.',
        ],
        dangers: [
          'Der Zehner kann zwischen unseren Linien frei werden, wenn die Abstände zu groß sind.',
          'Ihre Flügelspieler können unsere Wingbacks tief binden und Rückraumläufe vorbereiten.',
          'Wenn wir zu tief bleiben, kann ihre Doppelsechs den Ball ohne Druck verlagern.',
          'Der Rückraum kann offen werden, wenn alle Verteidiger nur in die letzte Linie fallen.',
        ],
        keyActions: [
          'Zentrum verdichten und den Zehner nicht frei drehen lassen.',
          'Ballnaher Achter schiebt auf ihre Doppelsechs, sobald der Pass ins Zentrum kommt.',
          'Wingback stellt den Flügelspieler, Halbverteidiger sichert den Halbraum dahinter.',
          'Sechs bleibt vor der Kette und nimmt Klatschpässe auf.',
          'Bei Rückpässen schieben beide Spitzen gemeinsam auf Innenverteidiger und Sechserpassweg.',
        ],
      },
      afterGain: {
        spaces: [
          'Der Raum neben ihrem aufgerückten Außenverteidiger ist nach Ballgewinn sofort offen.',
          'Die Tiefe hinter ihrer Viererkette ist nutzbar, wenn ihre Doppelsechs im Angriff vor dem Ball steht.',
          'Zweite-Ball-Zonen um unsere Spitzen entscheiden über die Fortsetzung des Konters.',
          'Der ballferne Wingback kann frei werden, wenn ihr Gegenpressing zur Ballseite kippt.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort vertikal werden, weil zwei Spitzen Ziel- und Ablagespieler geben.',
          'Unsere kompakte Mitte gewinnt häufig zweite Bälle für den Anschlussangriff.',
          'Wingbacks können aus der Tiefe mit Tempo in freie Flügelräume starten.',
        ],
        dangers: [
          'Ein blinder langer Ball gibt den Besitz schnell zurück und hält uns dauerhaft tief.',
          'Wenn beide Spitzen starten und niemand klatscht, fehlt der Anschluss an den Konter.',
          'Zu viele Spieler vor dem Ball öffnen bei erneutem Verlust den Zehnerraum.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort vertikal auf eine Spitze oder in den Raum neben ihrem Außenverteidiger spielen.',
          'Eine Spitze sichert den Ball, die andere startet in die Tiefe.',
          'Nächster Achter rückt für den zweiten Ball und die Ablage nach.',
          'Ballferner Wingback startet erst, wenn der erste Pass gesichert ist.',
          'Sechs bleibt als Sicherung vor der Kette, falls der Konter abbricht.',
        ],
      },
    },
    liveCoaching: [
      '„Zehner zu!"',
      '„Zweiter Ball!"',
      '„Sofort vertikal!"',
    ],
    adjustments: [
      'Auf 5-4-1 abkippen, wenn mehr Flügelstabilität nötig ist',
    ],
  },
  {
    id: '5-3-2_vs_4-3-3',
    ourSystem: '5-3-2',
    opponentSystem: '4-3-3',
    rating: 'ausgeglichen',
    character:
      'Wir stehen stabil gegen die erste Linie und können mit zwei Spitzen direkt kontern. Kritisch wird es, wenn ihre Flügel unsere Wingbacks dauerhaft binden.',
    phases: {
      ownPossession: {
        spaces: [
          'Der Raum hinter ihren Außenverteidigern ist unser wichtigster Tiefenraum.',
          'Der ballferne Wingback wird frei, wenn ihr 4-3-3 mit Flügel und Achter zur Ballseite presst.',
          'Die Schnittstelle zwischen Innen- und Außenverteidiger ist Zielraum für unsere zwei Spitzen.',
          'Halbräume neben ihrer Sechs öffnen sich, wenn eine Spitze bindet und ein Achter nachrückt.',
          'Räume hinter unseren Wingbacks bleiben kritisch, sobald beide Seiten gleichzeitig hochschieben.',
        ],
        advantages: [
          'Zwei Spitzen können ihre Innenverteidiger binden und direkte Tiefenläufe anbieten.',
          'Nach Ballzirkulation können wir diagonal auf den freien Wingback verlagern.',
          'Unsere Dreierkette gibt gegen ihre erste Pressinglinie stabile Absicherung.',
        ],
        dangers: [
          'Ihr Flügelpressing kann unsere Wingbacks tief festnageln und uns im Aufbau nach außen drücken.',
          'Wenn die Spitzen keine Ablage sichern, kommen lange Bälle schnell zurück.',
          'Bei zu hohen Wingbacks entstehen Räume hinter ihnen für ihre Flügelstürmer.',
          'Ihre Achter können nach Ballverlusten sofort in unsere Halbräume springen.',
        ],
        keyActions: [
          'Nach Ballzirkulation schnell diagonal auf den freien Wingback spielen.',
          'Spitzen besetzen Tiefe zwischen Innen- und Außenverteidiger.',
          'Eine Spitze kommt entgegen, die andere hält die Tiefe.',
          'Ballnaher Achter bietet sich unter dem Wingback für Rückpass und zweiten Ball an.',
          'Ballferner Wingback startet erst, wenn der erste Pass aus dem Druck gesichert ist.',
        ],
      },
      afterLoss: {
        spaces: [
          'Der Halbraum vor dem äußeren Innenverteidiger muss sofort geschlossen werden.',
          'Die Außenbahn hinter unserem Wingback ist ihre erste Umschaltspur.',
          'Der Passweg auf ihren Flügelstürmer darf nicht offen bleiben.',
          'Der zentrale Raum vor unserer Fünferkette muss gegen nachrückende Achter geschützt werden.',
        ],
        advantages: [
          'Unsere Fünferkette sichert grundsätzlich gut gegen ihre drei Angreifer.',
          'Unsere drei Zentrumsspieler können nach Ballverlust schnell den Halbraum verdichten.',
          'Ein Halbverteidiger kann absichern, während der Wingback zurück in die Kette sprintet.',
        ],
        dangers: [
          'Flügelüberzahl gegen unsere Wingbacks entsteht sofort, wenn der ballnahe Achter zu spät hilft.',
          'Räume hinter aufrückenden Wingbacks werden direkt von ihren Flügelstürmern attackiert.',
          'Ihre Achter können zweite Bälle aufnehmen, wenn unsere Sechs zu tief in die Kette fällt.',
        ],
        keyActions: [
          'Nach Ballverlust Halbraum sofort schließen.',
          'Ballnaher Achter hilft konsequent auf dem Flügel.',
          'Wingback sprintet zurück, wenn der erste Gegenpressingzugriff fehlt.',
          'Sechs bleibt vor der Kette und nimmt den ersten Pass ins Zentrum auf.',
          'Halbverteidiger schiebt nur heraus, wenn der zentrale Innenverteidiger absichert.',
        ],
      },
      oppPossession: {
        spaces: [
          'Außenbahnen neben den Wingbacks sind die Hauptkonfliktzone gegen ihre Flügelstürmer.',
          'Halbräume vor den äußeren Innenverteidigern müssen zwischen Achter, Wingback und Halbverteidiger übergeben werden.',
          'Der Raum um ihre Sechs ist Pressingziel unserer zwei Spitzen.',
          'Die ballferne Seite darf bei Flügelverlagerungen nicht zu spät nachschieben.',
          'Der Rückraum vor unserer Kette bleibt gefährlich, wenn alle fünf Verteidiger zu tief fallen.',
        ],
        advantages: [
          'Unsere Fünferkette sichert gut gegen ihre drei Angreifer.',
          'Zwei Spitzen können ihre Innenverteidiger früh anlaufen und den Sechserpass schließen.',
          'Im Zentrum können Sechs und Achter die Wege auf ihre Achter eng halten.',
        ],
        dangers: [
          'Ihre Flügel können unsere Wingbacks dauerhaft binden und Flanken- oder Rückpassdruck erzeugen.',
          'Ihre Außenverteidiger können Überzahl herstellen, wenn unser Achter nicht mit auf die Seite kommt.',
          'Wingback springt zu früh heraus und öffnet dann den Raum hinter sich.',
          'Ihre Achter können im Rücken unserer Achter auftauchen, wenn wir nur auf die Flügel fokussieren.',
        ],
        keyActions: [
          'Spitzen lenken auf eine Seite und schließen den Sechser.',
          'Wingback springt erst bei schlechtem erstem Kontakt.',
          'Ballnaher Achter hilft konsequent auf dem Flügel.',
          'Eine Spitze lässt sich situativ auf ihren Sechser fallen.',
          'Halbverteidiger sichert den Raum hinter dem Wingback, ohne den Innenverteidiger herauszuziehen.',
        ],
      },
      afterGain: {
        spaces: [
          'Der Raum hinter ihren Außenverteidigern ist nach Ballgewinn sofort offen.',
          'Die Schnittstelle zwischen Innen- und Außenverteidiger eignet sich für Tiefenläufe der Spitzen.',
          'Der ballferne Wingback kann nach Verlagerung frei in Tempo kommen.',
          'Der zentrale zweite Ball vor ihrer Viererkette entscheidet, ob der Konter weiterläuft.',
        ],
        advantages: [
          'Mit zwei Spitzen haben wir sofort Zielspieler für direkte Vertikalpässe.',
          'Wingbacks können aus der Tiefe in freie Flügelräume starten.',
          'Unsere stabile letzte Linie erlaubt klare Konterabsicherung mit einem zurückbleibenden Wingback.',
        ],
        dangers: [
          'Ein zu langer Ball ohne Anschluss bringt uns direkt wieder in tiefe Verteidigung.',
          'Wenn beide Wingbacks gleichzeitig starten, fehlt die Breite in der Restverteidigung.',
          'Ihre Sechs kann Gegenpressing auslösen, wenn die Ablage der Spitze unsauber ist.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort hinter ihre Außenverteidiger spielen.',
          'Erster Pass sucht eine Spitze oder den ballnah startenden Wingback.',
          'Eine Spitze sichert den Ball, die andere läuft in die Tiefe.',
          'Achter rückt für den zweiten Ball nach und hält den Halbraum besetzt.',
          'Ballferner Wingback bleibt zunächst tiefer, bis der Konter kontrolliert ist.',
        ],
      },
    },
    liveCoaching: [
      '„Wingback nicht locken!"',
      '„Direkt in Tiefe!"',
      '„Halbraum zu!"',
    ],
    adjustments: [
      'Ballnaher Achter hilft konsequent auf dem Flügel.',
      'Eine Spitze lässt sich auf ihren Sechser fallen.',
      'Wenn ihre Flügel dominieren, auf 5-4-1 abkippen und den ballfernen Achter breiter verteidigen lassen.',
      'Bei eigenem Ballbesitz einen Wingback bewusst tiefer halten, damit die Gegenseite mutiger starten kann.',
    ],
  },
  {
    id: '5-3-2_vs_4-4-2',
    ourSystem: '5-3-2',
    opponentSystem: '4-4-2',
    rating: 'vorteilhaft',
    character:
      'Wir haben im Zentrum meist einen Mann mehr und können zweite Bälle gut sichern. Gefährlich sind breite Angriffe mit Außenverteidiger und Außenspieler gegen unseren Wingback.',
    phases: {
      ownPossession: {
        spaces: [
          'Das Zentrum vor ihrer Doppelsechs ist unser Hauptvorteil, weil wir dort mit drei Mittelfeldspielern gegen zwei spielen.',
          'Die Halbräume neben ihrer Doppelsechs öffnen sich, wenn eine Spitze abkippt und ein Achter nachrückt.',
          'Wingbacks können früh hochschieben und ihre Außenspieler nach hinten binden.',
          'Der ballferne Raum hinter ihrem Außenverteidiger wird nach Verlagerungen interessant.',
          'Die Restverteidigung hinter unseren Wingbacks muss gegen ihre zwei Spitzen und direkte Flügelbälle stabil bleiben.',
        ],
        advantages: [
          'Drei zentrale Mittelfeldspieler können ihre Doppelsechs überladen.',
          'Drei Innenverteidiger kontrollieren ihre zwei Spitzen und geben uns Aufbauabsicherung.',
          'Über zweite Bälle können wir Druckphasen verlängern und ihre Mittelfeldlinie zurückdrücken.',
        ],
        dangers: [
          'Wenn wir zu früh breit werden, verlieren wir unseren zentralen Vorteil.',
          'Ein Ballverlust nach hohem Wingback öffnet den direkten Pass auf ihre Außenspieler.',
          'Ihre zwei Spitzen können unsere erste Zirkulation lenken, wenn die Sechs nicht sauber freikommt.',
          'Zu viele direkte Bälle auf beide Spitzen nehmen unseren Achtern die Anschlusswege.',
        ],
        keyActions: [
          'Überzahl im Zentrum ruhig ausspielen.',
          'Wingbacks früh hochschieben und ihre Außenspieler binden.',
          'Eine Spitze kippt ab, um den ersten Kontakt zwischen den Linien zu sichern.',
          'Äußerer Innenverteidiger darf ins Mittelfeld andribbeln, wenn ihr Außenspieler tief bleibt.',
          'Achter bleiben gestaffelt für Rückpass, zweiten Ball und Kontersicherung.',
        ],
      },
      afterLoss: {
        spaces: [
          'Das Zentrum muss sofort eng werden, damit ihre Doppelsechs nicht aufdreht.',
          'Der ballferne Raum hinter unserem Wingback ist nach Flügelangriffen besonders gefährlich.',
          'Die Außenbahn kann durch Außenverteidiger und Außenspieler schnell gedoppelt werden.',
          'Der ballferne Pfosten muss bei frühen Flanken aus dem Umschalten mitverteidigt werden.',
        ],
        advantages: [
          'Unsere drei zentralen Mittelfeldspieler haben kurze Wege zum Gegenpressing.',
          'Drei Innenverteidiger geben Überzahl gegen ihre zwei Spitzen.',
          'Der zentrale Mittelfeldspieler kann ihre Doppelsechs aggressiv attackieren, ohne die letzte Linie zu entblößen.',
        ],
        dangers: [
          'Doppeln auf den Außenbahnen kann unseren Wingback isolieren.',
          'Flanken auf den ballfernen Pfosten werden gefährlich, wenn der ballferne Wingback zu spät einrückt.',
          'Wenn unsere Achter breit hängen bleiben, entsteht ein freier erster Pass ins Zentrum.',
        ],
        keyActions: [
          'Nach Ballverlust Zentrum eng machen.',
          'Zentraler Mittelfeldspieler attackiert ihre Doppelsechs aggressiv.',
          'Ballnaher Wingback stellt den Außenspieler, Halbverteidiger sichert dahinter.',
          'Ballferner Wingback rückt früh zum zweiten Pfosten ein.',
          'Eine Spitze bleibt als Entlastungsoption, die andere schließt den Rückpass ins Zentrum.',
        ],
      },
      oppPossession: {
        spaces: [
          'Das Zentrum vor ihrer Doppelsechs ist unsere Pressingzone.',
          'Außenbahnen werden kritisch, wenn ihr Außenverteidiger und Außenspieler gegen unseren Wingback doppeln.',
          'Der ballferne Pfosten muss gegen Flanken konsequent aufgenommen werden.',
          'Halbräume vor unseren äußeren Innenverteidigern dürfen nicht durch ihre abkippenden Spitzen geöffnet werden.',
          'Der Rückraum vor unserer Fünferkette bleibt für zweite Bälle und Klärungen wichtig.',
        ],
        advantages: [
          'Drei zentrale Mittelfeldspieler geben uns Überzahl gegen ihre zwei Zentrumsspieler.',
          'Drei Innenverteidiger kontrollieren ihre zwei Spitzen.',
          'Unsere Fünferkette kann Flanken aufnehmen, wenn Wingbacks und Halbverteidiger klare Übergaben haben.',
        ],
        dangers: [
          'Breite Angriffe mit Außenverteidiger und Außenspieler können unseren Wingback tief binden.',
          'Flanken auf den ballfernen Pfosten sind gefährlich, wenn die Kette zu ballorientiert verteidigt.',
          'Ihre Spitzen können unsere Halbverteidiger herausziehen und Platz für zweite Läufe öffnen.',
          'Zu passives Zentrum lässt ihre Doppelsechs ungestört verlagern.',
        ],
        keyActions: [
          'Spitzen laufen Innenverteidiger bogenförmig an und lenken in eine Pressingseite.',
          'Zentraler Mittelfeldspieler attackiert ihre Doppelsechs aggressiv.',
          'Ballnaher Achter hilft dem Wingback, sobald ihre Seite doppelt.',
          'Ballferner Wingback kontrolliert den zweiten Pfosten vor dem Außenspieler.',
          'Halbverteidiger rückt nur heraus, wenn der zentrale Innenverteidiger die Tiefe absichert.',
        ],
      },
      afterGain: {
        spaces: [
          'Der Raum hinter ihren Außenverteidigern öffnet sich, wenn sie breit angegriffen haben.',
          'Die abkippende Spitze kann zwischen ihrer Doppelsechs und Viererkette den ersten Ball sichern.',
          'Der ballferne Wingback hat nach Ballgewinn häufig freie Bahn für die Verlagerung.',
          'Zweite-Ball-Räume im Zentrum bleiben unser Vorteil gegen ihre zwei Mittelfeldspieler.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort auf die abkippende Spitze spielen.',
          'Unsere zentrale Überzahl gibt gute Anschlussoptionen für den zweiten Pass.',
          'Wingbacks können nach Ballgewinn direkt gegen ihre zurücklaufenden Außenspieler Tempo aufnehmen.',
        ],
        dangers: [
          'Ein unkontrollierter langer Ball auf beide Spitzen gibt ihre Viererkette wieder Zugriff.',
          'Wenn der ballnahe Wingback sofort startet, kann der Rückkonter über seine Seite offen bleiben.',
          'Zu langsames Umschalten erlaubt ihrer Doppelsechs, den zentralen Raum wieder zu schließen.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort auf die abkippende Spitze spielen.',
          'Nächster Achter rückt für die Ablage und den zweiten Ball nach.',
          'Ballferner Wingback startet in die Breite, sobald der erste Pass gesichert ist.',
          'Eine Spitze hält Tiefe zwischen Innen- und Außenverteidiger.',
          'Sechs bleibt unter dem Angriff und verhindert den direkten Rückkonter durchs Zentrum.',
        ],
      },
    },
    liveCoaching: [
      '„Zentrum gehört uns!"',
      '„Flanke früh blocken!"',
      '„Zweiter Pfosten!"',
    ],
    adjustments: [
      'Wingback tiefer halten, wenn ihre Seite überlädt.',
      'Äußerer Innenverteidiger darf ins Mittelfeld andribbeln.',
      'Bei dauerhaftem Flügeldruck ballnahen Achter konsequent nach außen schieben.',
      'Bei eigener Dominanz eine Spitze häufiger abkippen lassen, um ihre Doppelsechs zu binden.',
    ],
  },
  {
    id: '5-3-2_vs_4-4-2-raute',
    ourSystem: '5-3-2',
    opponentSystem: '4-4-2-raute',
    rating: 'ausgeglichen',
    character:
      'Beide Teams wollen das Zentrum kontrollieren. Unsere Wingbacks können viel Raum nutzen, müssen aber nach Ballverlust sofort gegen die Raute einrücken.',
    phases: {
      ownPossession: {
        spaces: [
          'Außenbahnen hinter ihren Halbspielern sind der freie Raum gegen die enge Raute.',
          'Unsere Wingbacks haben außen oft freie Anspielstationen, wenn wir das Zentrum kurz anlocken.',
          'Rückräume vor ihrer Viererkette öffnen sich, wenn unsere Spitzen die Innenverteidiger auseinanderziehen.',
          'Der ballferne Wingback kann nach Verlagerungen mit Tempo gegen ihren Außenverteidiger gehen.',
          'Das Zentrum darf nicht überladen werden, wenn ihre Raute nach Ballverlust sofort Zugriff sucht.',
        ],
        advantages: [
          'Wingbacks haben außen oft freie Anspielstationen.',
          'Mit zwei Spitzen können wir ihre Innenverteidiger binden und Rückräume für nachrückende Mittelfeldspieler öffnen.',
          'Unsere Fünferkette gibt Absicherung gegen zwei Spitzen, wenn ein Wingback hoch anschiebt.',
        ],
        dangers: [
          'Ihre Raute kann unser Zentrum überladen, wenn wir zu lange durch die Mitte spielen.',
          'Ballverluste im Sechserraum öffnen sofort den Pass auf ihren Zehner.',
          'Wenn beide Wingbacks gleichzeitig hoch stehen, fehlen seitliche Sicherungen gegen direkte Außenwechsel.',
          'Zu flache Spitzen machen es ihrer Viererkette leicht, unsere Vertikalpässe zu kontrollieren.',
        ],
        keyActions: [
          'Spiel schnell nach außen auf die Wingbacks verlagern.',
          'Spitzen ziehen Innenverteidiger auseinander und öffnen Rückräume.',
          'Eine Spitze kommt entgegen, die andere hält Tiefe zwischen Innen- und Außenverteidiger.',
          'Achter bieten sich unter dem Wingback an, damit der erste Außenpass nicht isoliert ist.',
          'Ballferner Wingback bleibt zunächst tiefer, wenn die ballnahe Seite überlädt.',
        ],
      },
      afterLoss: {
        spaces: [
          'Der Passweg auf ihren Zehner muss als erstes geschlossen werden.',
          'Der Raum vor unserem zentralen Innenverteidiger ist ihre gefährlichste Umschaltzone.',
          'Die Halbspuren neben unserer Sechs werden durch ihre Raute sofort besetzt.',
          'Die Außenbahn hinter unserem hochstehenden Wingback bleibt offen für ihren ersten Entlastungspass.',
        ],
        advantages: [
          'Unsere Fünferkette gibt Absicherung gegen zwei Spitzen.',
          'Der zentrale Innenverteidiger kann den Zehnerraum absichern, wenn Sechs und Achter Druck herstellen.',
          'Ballnahe Achter haben kurze Wege, um ihre Halbspieler nach Ballverlust zu stellen.',
        ],
        dangers: [
          'Ihre Raute kann unser Zentrum nach Ballverlust überladen.',
          'Ihr Zehner findet Raum vor unserer Abwehr, wenn unsere Sechs zu weit herausgezogen wird.',
          'Wenn Wingbacks nach Ballverlust nicht einrücken, entstehen Passwege diagonal in den Zehnerraum.',
        ],
        keyActions: [
          'Nach Ballverlust Passweg auf ihren Zehner schließen.',
          'Mittelfeld eng halten und den Zehner nicht frei drehen lassen.',
          'Zentraler Innenverteidiger rückt mutig auf den Zehner heraus, wenn Druck auf dem Ball ist.',
          'Ballferner Wingback bleibt tiefer zur Restverteidigung.',
          'Ballnaher Achter attackiert den ersten Halbspieler der Raute.',
        ],
      },
      oppPossession: {
        spaces: [
          'Der Raum vor unserem zentralen Innenverteidiger entscheidet, ob ihr Zehner das Spiel drehen kann.',
          'Ihre Halbspieler wollen in den Rücken unserer Achter kommen und den Zehner verbinden.',
          'Außenbahnen bleiben für uns Entlastungsräume, müssen defensiv aber nach Verlagerungen schnell geschlossen werden.',
          'Der Sechserraum ihrer Raute ist Pressingziel unserer beiden Spitzen.',
          'Die Schnittstellen neben unseren Halbverteidigern sind gefährlich, wenn ihre Spitzen auseinanderziehen.',
        ],
        advantages: [
          'Unsere Fünferkette gibt Absicherung gegen ihre zwei Spitzen.',
          'Mit drei zentralen Mittelfeldspielern können wir ihre Raute im Block eng aufnehmen.',
          'Unsere Wingbacks können außen hoch bleiben, wenn der ballnahe Achter den Halbraum sichert.',
        ],
        dangers: [
          'Ihre Raute kann unser Zentrum überladen.',
          'Ihr Zehner findet Raum vor unserer Abwehr, wenn unsere Abstände zwischen Mittelfeld und Kette zu groß werden.',
          'Ihre zwei Spitzen können Halbverteidiger binden und den zentralen Innenverteidiger herauslocken.',
          'Wenn eine Spitze ihren Sechser nicht deckt, kann die Raute frei verlagern.',
        ],
        keyActions: [
          'Eine Spitze nimmt den Sechser, die andere lenkt den Aufbau.',
          'Mittelfeld eng halten und den Zehner nicht frei drehen lassen.',
          'Zentraler Innenverteidiger rückt mutig auf den Zehner heraus, wenn die Sechs überspielt ist.',
          'Ballnaher Wingback hält Kontakt zum Außenverteidiger, ohne den Halbraum zu öffnen.',
          'Achter übergeben Halbspieler klar an Sechs oder Wingback, statt beide dem Ball zu folgen.',
        ],
      },
      afterGain: {
        spaces: [
          'Die Außenbahn ist nach Ballgewinn sofort frei, weil ihre Raute zentral verdichtet.',
          'Der ballferne Wingback kann nach Verlagerung in viel Raum starten.',
          'Der Rückraum hinter ihrer Raute öffnet sich, wenn ihre Halbspieler nach innen gegenpressen.',
          'Die Tiefe neben ihren Außenverteidigern ist offen, wenn unsere Spitzen früh auseinanderziehen.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort über außen lösen.',
          'Unsere Wingbacks haben klare freie Flügelräume gegen ihre enge Raute.',
          'Zwei Spitzen geben direkte Ziel- und Tiefenoptionen, bevor ihre Viererkette nachschiebt.',
        ],
        dangers: [
          'Ein erster Pass ins enge Zentrum läuft direkt in ihr Gegenpressing.',
          'Wenn der Wingback den ersten Kontakt verliert, ist der Passweg auf ihren Zehner wieder offen.',
          'Zu viele frühe Läufe vor den Ball nehmen uns die Absicherung gegen den Rückkonter durch die Mitte.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort über außen lösen.',
          'Erster Pass sucht den Wingback oder die abkippende Spitze neben ihrer Raute.',
          'Ballnaher Achter bietet sich unter dem Wingback als Klatschoption an.',
          'Eine Spitze startet diagonal in den Raum neben ihrem Außenverteidiger.',
          'Sechs bleibt zentral und schließt den Rückweg auf ihren Zehner.',
        ],
      },
    },
    liveCoaching: [
      '„Zehner eng nehmen!"',
      '„Außen ist frei!"',
      '„Nicht durchs Zentrum verlieren!"',
    ],
    adjustments: [
      'Zentraler Innenverteidiger rückt mutig auf den Zehner heraus.',
      'Ballferner Wingback bleibt tiefer zur Restverteidigung.',
      'Wenn ihre Raute das Zentrum dominiert, eine Spitze konsequent auf ihren Sechser fallen lassen.',
      'Bei eigenem Druck Wingbacks höher halten und Achter unter den Ball staffeln.',
    ],
  },
  {
    id: '5-3-2_vs_3-5-2',
    ourSystem: '5-3-2',
    opponentSystem: '3-5-2',
    rating: 'ausgeglichen',
    character:
      'Beide Systeme spiegeln sich fast komplett. Kleine Vorteile entstehen über bessere Wingback-Positionen und klarere Besetzung der zweiten Bälle.',
    phases: {
      ownPossession: {
        spaces: [
          'Wingback-Duelle an der Seitenlinie entscheiden, wer die gegnerische Fünferkette nach hinten drückt.',
          'Der Raum hinter den äußeren Innenverteidigern öffnet sich, wenn eine Spitze kurz kommt und die andere Tiefe hält.',
          'Zweite-Ball-Zonen im Zentrum sind wichtiger als lange Ballbesitzphasen ohne Raumgewinn.',
          'Der Rücken des ballfernen Wingbacks ist nach schnellen Seitenwechseln angreifbar.',
          'Der zentrale Innenverteidiger kann Andribbeln nutzen, wenn ihre zwei Spitzen nur passiv lenken.',
        ],
        advantages: [
          'Drei Innenverteidiger sichern gut gegen zwei Spitzen und erlauben kontrollierte Aufbauphasen.',
          'Unser zentrales Mittelfeld kann direkten Zugriff und kurze Anschlusswege herstellen.',
          'Wingbacks können früh eingebunden werden, um den Gegner seitlich zu verschieben.',
        ],
        dangers: [
          'Lange Gleichzahl auf den Außenbahnen macht Fortschritt schwierig, wenn der Wingback isoliert ist.',
          'Zu wenig Tiefe entsteht, wenn beide Spitzen gleichzeitig gebunden oder entgegenkommend sind.',
          'Ein Ballverlust nach hohem Wingback öffnet sofort den spiegelgleichen Konterraum.',
          'Wenn der zentrale Innenverteidiger nicht andribbeln darf, wird der Aufbau statisch gegen ihre erste Linie.',
        ],
        keyActions: [
          'Wingbacks früh einbinden und den Gegner seitlich verschieben.',
          'Eine Spitze lässt sich kurz fallen, die andere hält Tiefe.',
          'Zentralen Innenverteidiger mutiger andribbeln lassen, wenn ihre Spitzen nicht aktiv springen.',
          'Achter bleiben unter dem Ball für zweite Bälle und Rückpässe.',
          'Nach Verlagerungen den ballfernen Wingback direkt in den Rücken des Gegners schicken.',
        ],
      },
      afterLoss: {
        spaces: [
          'Das Zentrum muss nach Ballverlust sofort kompakt geschlossen werden.',
          'Der Rücken unseres Wingbacks ist der erste Konterraum des Gegners.',
          'Die zweite-Ball-Zone vor unserer Fünferkette entscheidet über direkten Wiederzugriff.',
          'Der Raum hinter unseren äußeren Innenverteidigern wird gefährlich, wenn ihre Spitze in die Tiefe startet.',
        ],
        advantages: [
          'Drei Innenverteidiger sichern gut gegen ihre zwei Spitzen.',
          'Unser zentrales Mittelfeld kann nach Ballverlust direkten Zugriff herstellen.',
          'Ballnahe Achter und Wingbacks haben klare Zuordnungen in den spiegelgleichen Räumen.',
        ],
        dangers: [
          'Ihre Wingbacks können sofort in den Rücken unserer Wingbacks starten.',
          'Wenn unser Zentrum nach außen gezogen wird, kann ihr zentraler Mittelfeldspieler aufdrehen.',
          'Zu wenig Tiefensicherung entsteht, wenn der äußere Innenverteidiger unkontrolliert ins Gegenpressing springt.',
        ],
        keyActions: [
          'Nach Ballverlust Zentrum kompakt schließen.',
          'Ballnaher Achter schiebt sofort auf den zentralen Mittelfeldspieler.',
          'Wingback sprintet zurück und nimmt den gegnerischen Wingback auf.',
          'Sechs bleibt vor der Kette und sichert zweite Bälle.',
          'Äußerer Innenverteidiger rückt nur heraus, wenn der zentrale Innenverteidiger die Tiefe kontrolliert.',
        ],
      },
      oppPossession: {
        spaces: [
          'Der äußere Innenverteidiger ist die Pressingseite, weil dort Wingback und Achter zugeschoben werden können.',
          'Wingback-Duelle an der Seitenlinie bestimmen, ob unser Block nach hinten gedrückt wird.',
          'Das Zentrum um ihre drei Mittelfeldspieler darf nicht aufdrehen.',
          'Der Raum hinter unseren Wingbacks bleibt die gefährlichste Tiefe.',
          'Zweite-Ball-Zonen vor beiden Fünferketten entscheiden über längere Druckphasen.',
        ],
        advantages: [
          'Drei Innenverteidiger sichern gut gegen zwei Spitzen.',
          'Unser zentrales Mittelfeld kann direkten Zugriff auf ihre drei Mittelfeldspieler herstellen.',
          'Spiegelgleiche Zuordnungen machen Pressingauslöser klar und leicht kommunizierbar.',
        ],
        dangers: [
          'Lange Gleichzahl auf den Außenbahnen kann unsere Wingbacks ermüden und tief binden.',
          'Wenn ihre zentrale Mitte den ersten Druck überspielt, müssen unsere Innenverteidiger in offene Halbräume verteidigen.',
          'Zu passives Anlaufen gibt ihren äußeren Innenverteidigern Zeit für Diagonalbälle.',
          'Wenn beide Spitzen nur gerade anlaufen, bleibt ihr zentraler Innenverteidiger frei.',
        ],
        keyActions: [
          'Spitzen lenken auf einen äußeren Innenverteidiger.',
          'Ballnaher Achter schiebt sofort auf den zentralen Mittelfeldspieler.',
          'Wingback bleibt aktiv und stellt den gegnerischen Wingback bei Zuspiel.',
          'Eine Spitze nimmt den Rückpass auf den zentralen Innenverteidiger im Deckungsschatten.',
          'Sechs sichert vor der Kette und kontrolliert zweite Bälle.',
        ],
      },
      afterGain: {
        spaces: [
          'Der Rücken des gegnerischen Wingbacks ist nach Ballgewinn sofort der beste Zielraum.',
          'Der Raum hinter dem äußeren Innenverteidiger öffnet sich, wenn eine Spitze diagonal startet.',
          'Der ballferne Wingback kann nach schneller Verlagerung frei werden.',
          'Zweite-Ball-Zonen im Zentrum geben Anschluss, falls der erste Tiefenpass nicht sauber ist.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort in den Rücken des Wingbacks spielen.',
          'Eine abkippende Spitze und eine tiefe Spitze geben klare erste und zweite Optionen.',
          'Unsere Wingbacks können aus der Gleichzahl ausbrechen, wenn der erste Pass schnell genug kommt.',
        ],
        dangers: [
          'Ein verzögerter erster Pass bringt beide Teams zurück in spiegelgleiche Ordnung.',
          'Wenn beide Spitzen tief starten, fehlt die Ablage für den zweiten Ball.',
          'Ein Ballverlust im Konter öffnet denselben Raum hinter unserem Wingback.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort in den Rücken des Wingbacks spielen.',
          'Eine Spitze lässt klatschen, die andere startet hinter den äußeren Innenverteidiger.',
          'Ballnaher Achter rückt für den zweiten Ball nach.',
          'Wingback startet in die Tiefe, sobald der erste Pass gesichert ist.',
          'Sechs bleibt unter dem Angriff und schützt den direkten Rückkonter.',
        ],
      },
    },
    liveCoaching: [
      '„Wingback aktiv bleiben!"',
      '„Zweite Bälle sichern!"',
      '„Eine kommt, eine geht!"',
    ],
    adjustments: [
      'Einen Achter höher schieben, um ihren Aufbau früher zu stören.',
      'Zentralen Innenverteidiger mutiger andribbeln lassen.',
      'Wenn die Wingbacks isoliert sind, ballnahen Achter näher an die Seitenlinie schieben.',
      'Bei eigener Führung Wingbacks tiefer halten und nur nach klarer Sicherung starten lassen.',
    ],
  },
  {
    id: '5-3-2_vs_3-4-3',
    ourSystem: '5-3-2',
    opponentSystem: '3-4-3',
    rating: 'unangenehm',
    character:
      'Ihre drei Angreifer können unsere letzte Linie breit binden. Wir brauchen saubere Abstände, damit die Halbräume neben den Innenverteidigern nicht offen werden.',
    phases: {
      ownPossession: {
        spaces: [
          'Der Raum hinter ihren hohen Wingbacks ist unser wichtigster Entlastungs- und Konterraum.',
          'Schnittstellen der Dreierkette öffnen sich, wenn unsere Stürmer diagonal zwischen Halbverteidiger und zentralem Innenverteidiger starten.',
          'Der ballferne Wingback wird frei, wenn ihr 3-4-3 zur Ballseite schiebt.',
          'Das Zentrum vor ihrer Doppelsechs muss schnell überspielt werden, bevor ihre Front drei zurückpresst.',
          'Halbräume hinter unseren Wingbacks bleiben kritisch, wenn wir beide Seiten gleichzeitig hochschieben.',
        ],
        advantages: [
          'Zwei Spitzen können ihre Dreierkette direkt anlaufen und im Ballbesitz zwei Zielspieler binden.',
          'Unsere Fünferkette gibt Absicherung, wenn ein Wingback in freie Räume nach vorne startet.',
          'Schnelle Verlagerungen treffen ihr 3-4-3, bevor Wingback und Außenstürmer zurückarbeiten.',
        ],
        dangers: [
          'Ihre Außenstürmer können unsere Wingbacks tief binden und den Aufbau nach außen ersticken.',
          'Bei zu flachem Aufbau bleiben unsere Spitzen isoliert gegen drei Innenverteidiger.',
          'Ballverluste im Halbraum öffnen direkte Wege auf ihre breite Front drei.',
          'Wenn der ballnahe Achter nicht unter dem Wingback steht, fehlt die Rückpass- und Sicherungsoption.',
        ],
        keyActions: [
          'Schnell hinter ihre hohen Wingbacks spielen.',
          'Stürmer diagonal in die Schnittstellen der Dreierkette schicken.',
          'Nach Ballzirkulation sofort auf die ballferne Seite verlagern.',
          'Ballnaher Achter bietet sich unter dem Wingback an und sichert den Halbraum.',
          'Ein Wingback startet hoch, der andere bleibt für Restverteidigung gestaffelt.',
        ],
      },
      afterLoss: {
        spaces: [
          'Der Halbraum hinter dem ballnahen Wingback muss sofort geschlossen werden.',
          'Außenstürmer dürfen nach Ballverlust nicht frei aufdrehen.',
          'Das Zentrum vor unserer Fünferkette braucht Zugriff gegen Klatschpässe ihrer Front drei.',
          'Die ballferne Seite bleibt gefährlich, wenn ihr Wingback früh breit bleibt.',
        ],
        advantages: [
          'Unsere Fünferkette gibt klare Absicherung gegen ihre Front drei.',
          'Ballnaher Achter und Wingback können Außenstürmer gemeinsam doppeln.',
          'Drei Innenverteidiger erlauben, dass ein Halbverteidiger situativ in den Halbraum schiebt.',
        ],
        dangers: [
          'Halbräume zwischen Wingback und Innenverteidiger öffnen sich bei schlechtem Gegenpressing.',
          'Außenstürmer binden unsere Wingbacks tief und können direkte Konterläufe starten.',
          'Wenn die Sechs zu tief fällt, können ihre Mittelfeldspieler zweite Bälle vor der Kette kontrollieren.',
        ],
        keyActions: [
          'Nach Ballverlust Außenstürmer sofort doppeln.',
          'Ballnaher Achter unterstützt den Wingback gegen Außenstürmer.',
          'Sechs bleibt vor der Fünferkette und sichert das Zentrum.',
          'Halbverteidiger rückt in den Halbraum, wenn der zentrale Innenverteidiger die Tiefe hält.',
          'Ballferner Wingback bleibt aufmerksam für schnelle Verlagerungen.',
        ],
      },
      oppPossession: {
        spaces: [
          'Halbräume zwischen Wingback und Innenverteidiger sind die wichtigste Gefahrenzone.',
          'Der Halbraum hinter dem ballnahen Wingback darf nicht von Außenstürmer und Wingback gleichzeitig besetzt werden.',
          'Das Zentrum vor unserer Fünferkette muss gegen Ablagen der drei Angreifer eng bleiben.',
          'Die äußeren Innenverteidiger ihrer Dreierkette sind Pressingziele unserer Spitzen.',
          'Der ballferne Wingback muss gegen Verlagerungen früh einrücken oder herausrücken können.',
        ],
        advantages: [
          'Unsere Fünferkette gibt klare Absicherung gegen ihre Front drei.',
          'Zwei Spitzen können ihre Dreierkette direkt anlaufen und auf eine Seite lenken.',
          'Unsere drei zentralen Mittelfeldspieler können die Räume vor der Kette kompakt halten.',
        ],
        dangers: [
          'Ihre drei Angreifer können unsere letzte Linie breit binden.',
          'Außenstürmer können unsere Wingbacks tief binden und Rückraumdruck vorbereiten.',
          'Wenn ein Wingback zu früh springt, wird der Halbraum neben dem Innenverteidiger offen.',
          'Ihre Wingbacks können nach Verlagerungen aus der Tiefe Dynamik erzeugen.',
        ],
        keyActions: [
          'Spitzen pressen die äußeren Innenverteidiger nach innen.',
          'Ballnaher Achter unterstützt den Wingback gegen Außenstürmer.',
          'Wingback springt nur heraus, wenn der Halbverteidiger den Halbraum sichert.',
          'Sechs bleibt zentral und nimmt Ablagen vor der Fünferkette auf.',
          'Ballferner Achter bleibt eingerückt, um die Verlagerung ins Zentrum abzufangen.',
        ],
      },
      afterGain: {
        spaces: [
          'Die ballferne Seite ist nach Ballgewinn oft frei, weil ihr 3-4-3 zur Ballseite presst.',
          'Der Rücken ihrer Wingbacks ist sofort bespielbar.',
          'Schnittstellen der Dreierkette öffnen sich, wenn unsere Spitzen diagonal auseinanderlaufen.',
          'Der zentrale zweite Ball ist wichtig, falls der erste Pass hinter den Wingback geblockt wird.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort auf die ballferne Seite verlagern.',
          'Zwei Spitzen geben direkte Tiefenoptionen gegen ihre Dreierkette.',
          'Wingbacks können nach Balleroberung aus tiefer Position mit Tempo starten.',
        ],
        dangers: [
          'Ein zu langsamer erster Pass lässt ihre Front drei sofort gegenpressen.',
          'Wenn beide Spitzen nur tief gehen, fehlt die Ablage aus dem Druck.',
          'Ein erneuter Ballverlust auf außen öffnet wieder den Halbraum hinter unserem Wingback.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort auf die ballferne Seite verlagern.',
          'Erster Blick geht hinter ihren Wingback oder auf die klatschende Spitze.',
          'Eine Spitze startet diagonal, die andere sichert den ersten Ball.',
          'Ballnaher Achter rückt für zweiten Ball und Rückpass nach.',
          'Ballferner Wingback startet erst, wenn der Pass aus dem Druck gesichert ist.',
        ],
      },
    },
    liveCoaching: [
      '„Halbraum dicht machen!"',
      '„Raus aus Druck!"',
      '„Ballfern lösen!"',
    ],
    adjustments: [
      'Ballnaher Achter rückt früher nach außen.',
      'Wingbacks bei Druck tiefer starten lassen.',
      'Bei dauerhaftem Flügeldruck auf 5-4-1 abkippen und den ballfernen Achter breiter verteidigen lassen.',
      'Bei eigenem Ballbesitz eine Spitze häufiger klatschen lassen, damit die andere diagonal starten kann.',
    ],
  },
  {
    id: '5-3-2_vs_5-3-2',
    ourSystem: '5-3-2',
    opponentSystem: '5-3-2',
    rating: 'ausgeglichen',
    character:
      'Das Duell ist stark gespiegelt und oft eng. Entscheidend sind Mut im Andribbeln, Tempo über die Wingbacks und bessere Anschlussaktionen nach zweiten Bällen.',
    phases: {
      ownPossession: {
        spaces: [
          'Die zweite-Ball-Zone vor beiden Dreierketten entscheidet, wer längere Druckphasen bekommt.',
          'Die Außenbahn hinter dem gegnerischen Wingback ist nach Verlagerungen der wichtigste Raumgewinn.',
          'Halbräume neben ihren äußeren Innenverteidigern öffnen sich, wenn eine Spitze seitlich ausweicht.',
          'Das Zentrum kann schnell festlaufen, wenn beide Teams mit drei Mittelfeldspielern eng spiegeln.',
          'Andribbelräume für äußere Innenverteidiger entstehen, wenn ihre Spitzen nur passiv lenken.',
        ],
        advantages: [
          'Wir haben klare defensive Zuordnung in allen Linien und können deshalb kontrolliert nachschieben.',
          'Unsere Dreierkette gibt gute Absicherung gegen direkte Bälle auf zwei Spitzen.',
          'Wingbacks können durch Höhe und Breite die spiegelgleiche Ordnung auseinanderziehen.',
        ],
        dangers: [
          'Das Spiel kann zentral festlaufen, wenn unsere Achter auf gleicher Höhe bleiben.',
          'Zu wenig Breite entsteht, wenn Wingbacks zu tief bleiben.',
          'Ohne Andribbeln haben ihre Spitzen leichte Pressingwege gegen unsere Dreierkette.',
          'Wenn beide Spitzen gebunden sind, fehlt ein freier Klatschspieler zwischen den Linien.',
        ],
        keyActions: [
          'Äußere Innenverteidiger mit Tempo andribbeln lassen.',
          'Wingbacks hoch und breit halten.',
          'Eine Spitze seitlich ausweichen lassen, um Halbverteidiger herauszuziehen.',
          'Einen Achter höher zwischen ihre Linien schieben.',
          'Zweite Bälle bewusst unter den Spitzen besetzen, statt nur tief zu laufen.',
        ],
      },
      afterLoss: {
        spaces: [
          'Direkte Passwege ins Zentrum müssen sofort geschlossen werden.',
          'Der Raum hinter unserem Wingback ist die erste spiegelgleiche Konterspur.',
          'Die zweite-Ball-Zone vor unserer Dreierkette darf nicht frei bleiben.',
          'Halbräume neben den äußeren Innenverteidigern sind offen, wenn diese ungesichert ins Gegenpressing springen.',
        ],
        advantages: [
          'Unsere klare defensive Zuordnung hilft beim sofortigen Wiederfinden der Gegenspieler.',
          'Drei Innenverteidiger geben gute Absicherung gegen direkte Bälle auf zwei Spitzen.',
          'Das Mittelfeld kann mannorientiert gegen ihre drei Zentrumsspieler nachschieben.',
        ],
        dangers: [
          'Ein Ballverlust im Zentrum kann sofort auf eine klatschende Spitze gespielt werden.',
          'Wenn Wingbacks hoch stehen und nicht zurücksprinten, entsteht seitliche Tiefe für den Gegner.',
          'Zu aggressives Herausrücken der Halbverteidiger öffnet den Raum hinter ihnen.',
        ],
        keyActions: [
          'Nach Ballverlust direkte Passwege ins Zentrum schließen.',
          'Mittelfeld schiebt mannorientiert auf die drei Zentrumsspieler.',
          'Ballnaher Wingback sprintet zurück und nimmt den gegnerischen Wingback auf.',
          'Sechs bleibt vor der Kette und sichert zweite Bälle.',
          'Eine Spitze bleibt als Entlastungsoption, statt beide ins Gegenpressing zu schicken.',
        ],
      },
      oppPossession: {
        spaces: [
          'Der äußere Innenverteidiger ist Pressingziel, weil wir dort Wingback und Achter zustellen können.',
          'Zweite-Ball-Zonen vor beiden Dreierketten bleiben die Schlüsselräume.',
          'Außenbahnen hinter unseren Wingbacks müssen gegen schnelle Verlagerungen geschützt werden.',
          'Das Zentrum um die drei Mittelfeldspieler ist eng und braucht klare Übergaben.',
          'Der Rückpass auf den zentralen Innenverteidiger darf nicht dauerhaft frei bleiben.',
        ],
        advantages: [
          'Klare defensive Zuordnung in allen Linien macht das Spiegelpressing gut steuerbar.',
          'Gute Absicherung gegen direkte Bälle auf zwei Spitzen bleibt durch unsere Dreierkette erhalten.',
          'Unsere Wingbacks können direkte Gleichzahl herstellen und Druck nach außen lenken.',
        ],
        dangers: [
          'Ihr Aufbau kann frei werden, wenn unsere zwei Spitzen die Rückpasswege nicht sauber schließen.',
          'Ein gegnerischer äußerer Innenverteidiger kann andribbeln, wenn unser Mittelfeld zu tief bleibt.',
          'Zu mannorientiertes Herausschieben öffnet Räume hinter den Achtern.',
          'Wenn ihre Wingbacks höher bleiben, können sie unsere Wingbacks dauerhaft nach hinten drücken.',
        ],
        keyActions: [
          'Eine Spitze läuft an, die andere schließt den Rückpass.',
          'Mittelfeld schiebt mannorientiert auf die drei Zentrumsspieler.',
          'Wingback stellt den gegnerischen Wingback bei Zuspiel sofort nach außen.',
          'Sechs kontrolliert den Raum vor der Dreierkette.',
          'Ballferner Achter bleibt eingerückt, damit die Verlagerung nicht durchs Zentrum läuft.',
        ],
      },
      afterGain: {
        spaces: [
          'Der erste Vertikalpass auf eine Spitze ist offen, bevor ihre drei Mittelfeldspieler zurückschieben.',
          'Die Außenbahn hinter ihrem Wingback ist nach Balleroberung der beste Temporaum.',
          'Der Halbraum neben dem äußeren Innenverteidiger wird frei, wenn eine Spitze seitlich ausweicht.',
          'Die zweite-Ball-Zone unter unseren Spitzen entscheidet über die Anschlussaktion.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort vertikal auf eine Spitze klatschen.',
          'Eine seitlich ausweichende Spitze kann die Spiegelzuordnung brechen.',
          'Wingbacks können mit dem zweiten Pass Breite und Tempo geben.',
        ],
        dangers: [
          'Ein unpräziser Vertikalpass kommt gegen ihre Dreierkette schnell zurück.',
          'Wenn beide Spitzen tief starten, fehlt der Klatschspieler für den Anschluss.',
          'Bei zu frühem Wingback-Start öffnen wir denselben Raum für den Rückkonter.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort vertikal auf eine Spitze klatschen.',
          'Eine Spitze sichert den Ball, die andere startet diagonal in die Tiefe.',
          'Achter rückt unter den Ball für die Ablage nach.',
          'Wingback hält Breite und startet nach dem gesicherten ersten Pass.',
          'Sechs bleibt zentral und kontrolliert die zweite Aktion.',
        ],
      },
    },
    liveCoaching: [
      '„Mutig andribbeln!"',
      '„Breite halten!"',
      '„Zweiter Ball!"',
    ],
    adjustments: [
      'Eine Spitze seitlich ausweichen lassen.',
      'Einen Achter höher zwischen ihre Linien schieben.',
      'Wenn ihr Pressing passiv bleibt, äußere Innenverteidiger konsequent andribbeln lassen.',
      'Bei eigener Führung Wingbacks tiefer starten lassen und Konter über die ausweichende Spitze suchen.',
    ],
  },
  {
    id: '5-3-2_vs_5-4-1',
    ourSystem: '5-3-2',
    opponentSystem: '5-4-1',
    rating: 'vorteilhaft',
    character:
      'Wir haben mit zwei Spitzen mehr Präsenz gegen ihre tiefe letzte Linie. Entscheidend ist Geduld, weil ihre Mittelfeldkette zentrale Räume lange schließt.',
    phases: {
      ownPossession: {
        spaces: [
          'Halbräume vor ihrer Fünferkette sind die wichtigsten Kombinationsräume für Spitze und Achter.',
          'Der Rückraum nach geblockten Flanken muss konsequent besetzt bleiben.',
          'Die ballferne Seite hinter ihrer Mittelfeldkette wird nach geduldigen Verlagerungen frei.',
          'Wingbacks können ihre äußeren Mittelfeldspieler zurückdrücken, wenn sie breit und früh anspielbar sind.',
          'Das Zentrum vor ihrer kompakten Mittelfeldkette ist riskant, wenn der erste Kontakt unsauber ist.',
        ],
        advantages: [
          'Zwei Spitzen binden ihre Innenverteidiger dauerhaft.',
          'Drei Zentrumsspieler können zweite Bälle sichern und Druckphasen verlängern.',
          'Wingbacks können ihre äußeren Mittelfeldspieler zurückdrücken.',
        ],
        dangers: [
          'Zu frühe Flanken gegen ihre Fünferkette machen ihr Verteidigen einfach.',
          'Ballverluste im Zentrum vor ihrer Kompaktheit öffnen direkte Entlastung.',
          'Wenn beide Wingbacks gleichzeitig hoch stehen, fehlt Absicherung gegen den Zielspieler.',
          'Ohne Achter im Zwischenraum werden beide Spitzen gegen die Fünferkette isoliert.',
        ],
        keyActions: [
          'Geduldig von Seite zu Seite verlagern.',
          'Eine Spitze kurz anbieten, die andere Tiefe halten.',
          'Flanken erst nach klarer Dynamik bringen.',
          'Einen Achter höher zwischen ihre Linien schieben.',
          'Zentralen Innenverteidiger mutiger andribbeln lassen, wenn ihr Zielspieler passiv bleibt.',
        ],
      },
      afterLoss: {
        spaces: [
          'Der Pass auf ihren Zielspieler muss sofort verhindert werden.',
          'Rückraum nach geblockten Flanken ist die Zone für Gegenpressing und zweite Bälle.',
          'Ballferne Seite hinter unserem Wingback bleibt die gefährliche Entlastungsspur.',
          'Das Zentrum vor unserer Fünferkette muss gegen Ablagen des Zielspielers besetzt bleiben.',
        ],
        advantages: [
          'Drei Zentrumsspieler können zweite Bälle konsequent sichern.',
          'Unsere Fünferkette hat Überzahl gegen ihren einzelnen Zielspieler.',
          'Ballferner Wingback kann zur Absicherung tiefer bleiben, während die Ballseite presst.',
        ],
        dangers: [
          'Konter über den freien Zielspieler können unsere hohe Struktur überspielen.',
          'Wenn die Zentrumsspieler nach Flanken zu tief stehen, gehört ihnen der Rückraum.',
          'Ein zweiter Ball auf den ballfernen Flügel kann unsere Wingbacks in lange Rückwege zwingen.',
        ],
        keyActions: [
          'Nach Ballverlust Pass auf den Zielspieler verhindern.',
          'Zentrumsspieler sichern konsequent zweite Bälle.',
          'Ballferner Wingback bleibt zur Absicherung tiefer.',
          'Nächster Achter attackiert den ersten freien Pass nach außen.',
          'Zentraler Innenverteidiger bleibt gegen Tiefenlauf und lässt sich nicht aus der Kette ziehen.',
        ],
      },
      oppPossession: {
        spaces: [
          'Der Zielspieler ist ihr Entlastungspunkt und muss mit Innenverteidiger plus Sechs kontrolliert werden.',
          'Flügelräume öffnen sich erst, wenn ihre äußeren Mittelfeldspieler nachrücken.',
          'Der Rückraum vor unserer Fünferkette ist wichtig für zweite Bälle nach langen Befreiungen.',
          'Ihre Rückpasswege sind Pressingauslöser für unsere zwei Spitzen.',
          'Ballferne Seite muss gegen lange Diagonalbälle durch den Wingback gesichert werden.',
        ],
        advantages: [
          'Unsere Fünferkette kontrolliert ihren einzelnen Zielspieler mit Überzahl.',
          'Zwei Spitzen können Rückpässe zustellen und nach außen lenken.',
          'Drei Zentrumsspieler können zweite Bälle vor der Kette aufnehmen.',
        ],
        dangers: [
          'Wenn wir zu früh mit dem Wingback springen, kann ihr äußerer Mittelfeldspieler in den Raum dahinter starten.',
          'Ein freier Zielspieler kann trotz Unterzahl Ablagen auf nachrückende Mittelfeldspieler sichern.',
          'Zu passives Pressing gibt ihrem 5-4-1 Zeit, den Block zu entlasten.',
        ],
        keyActions: [
          'Spitzen stellen Rückpässe zu und lenken nach außen.',
          'Wingback presst erst, wenn der Ball auf den Flügel kommt.',
          'Zentrumsspieler sichern konsequent zweite Bälle.',
          'Sechs nimmt Ablagen des Zielspielers vor der Fünferkette auf.',
          'Ballferner Wingback bleibt eingerückt und schützt den zweiten Pfosten.',
        ],
      },
      afterGain: {
        spaces: [
          'Gegen ihre breite Kette muss nach Ballgewinn sofort Tempo entstehen.',
          'Die ballferne Seite hinter ihrer Mittelfeldkette ist offen, bevor sie wieder in den Block fällt.',
          'Halbräume vor ihrer Fünferkette bieten die erste Ablage für die kurze Spitze.',
          'Der Rückraum bleibt für den zweiten Ball wichtig, wenn die Fünferkette den ersten Pass blockt.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort Tempo gegen ihre breite Kette aufnehmen.',
          'Zwei Spitzen geben eine kurze und eine tiefe Option.',
          'Unsere Zentrumsspieler sind nah genug, um zweite Bälle und Ablagen zu sichern.',
        ],
        dangers: [
          'Ein überhasteter Pass in die Fünferkette verschenkt den Ball sofort zurück.',
          'Wenn beide Wingbacks starten, fehlt die Absicherung gegen ihren Zielspieler.',
          'Zu langsames Umschalten lässt ihr 5-4-1 wieder komplett hinter den Ball kommen.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort Tempo gegen ihre breite Kette aufnehmen.',
          'Eine Spitze kurz anspielen, die andere in Tiefe schicken.',
          'Ballfernen Wingback erst nach gesichertem ersten Pass aktivieren.',
          'Achter rückt in den Rückraum nach und nimmt zweite Bälle auf.',
          'Sechs bleibt unter dem Angriff und verhindert die direkte Entlastung.',
        ],
      },
    },
    liveCoaching: [
      '„Geduldig verlagern!"',
      '„Rückraum besetzen!"',
      '„Zielspieler zu!"',
    ],
    adjustments: [
      'Einen Achter höher zwischen ihre Linien schieben.',
      'Wingbacks breiter und früher anspielbar machen.',
      'Zentralen Innenverteidiger mutiger andribbeln lassen.',
      'Bei Kontergefahr nur einen Wingback gleichzeitig hochschieben.',
    ],
  },
  {
    id: '5-3-2_vs_4-1-4-1',
    ourSystem: '5-3-2',
    opponentSystem: '4-1-4-1',
    rating: 'ausgeglichen',
    character:
      'Ihre Fünfer-Mittelfeldstruktur kann unser Zentrum blockieren. Wir müssen den einzelnen Sechser binden und dann schnell über Wingbacks oder diagonale Läufe lösen.',
    phases: {
      ownPossession: {
        spaces: [
          'Räume neben ihrem Sechser sind die wichtigsten Zwischenräume für unsere Achter.',
          'Außenbahnen hinter ihren Außenspielern öffnen sich nach diagonalen Verlagerungen auf den Wingback.',
          'Der Rückraum vor ihrer Viererkette muss für Ablagen und zweite Bälle besetzt bleiben.',
          'Der ballferne Wingback wird frei, wenn ihr Fünfermittelfeld zur Ballseite schiebt.',
          'Unsere Dreierkette hat Zeit, wenn ihr einzelner Stürmer nicht aktiv auf den zentralen Innenverteidiger presst.',
        ],
        advantages: [
          'Zwei Spitzen können ihre Innenverteidiger unter Druck setzen und ihren Sechser binden.',
          'Wingbacks haben Breite gegen ihre Viererkette.',
          'Drei Innenverteidiger sichern gut gegen ihren einzelnen Stürmer.',
        ],
        dangers: [
          'Ihr Mittelfeld kann unsere Passwege ins Zentrum schließen.',
          'Außenspieler können unsere Wingbacks früh anlaufen.',
          'Ihr Sechser kann zweite Bälle frei aufnehmen, wenn unsere Spitze ihn nicht bindet.',
          'Zu langsame Zirkulation lässt ihr 4-1-4-1 seitlich sauber nachschieben.',
        ],
        keyActions: [
          'Eine Spitze bindet den Sechser durch Zurückfallen.',
          'Diagonal auf den ballfernen Wingback verlagern.',
          'Achter in die Räume neben ihrem Sechser schieben.',
          'Wingback auf der Ballseite höher positionieren, wenn ihr Außenspieler tief gebunden ist.',
          'Zentraler Innenverteidiger darf andribbeln, wenn ihr einzelner Stürmer nur passiv lenkt.',
        ],
      },
      afterLoss: {
        spaces: [
          'Der erste Pass ins Zentrum muss nach Ballverlust geblockt werden.',
          'Räume neben unserem zentralen Mittelfeld werden gefährlich, wenn ihre Achter sofort aufdrehen.',
          'Außenbahnen hinter unseren Wingbacks sind offen, wenn ihre Außenspieler hoch bleiben.',
          'Der Raum vor dem zentralen Innenverteidiger muss gegen lange Bälle und zweite Bälle geschützt werden.',
        ],
        advantages: [
          'Drei Innenverteidiger sichern gut gegen ihren einzelnen Stürmer.',
          'Unsere zwei Spitzen können nach Ballverlust Rückpässe und Sechserpasswege schließen.',
          'Unsere zentrale Dreierreihe kann kurze Gegenpressingwege gegen ihre Achter herstellen.',
        ],
        dangers: [
          'Ihr Mittelfeld kann nach Ballgewinn sofort Überzahl um den ersten Pass ins Zentrum erzeugen.',
          'Ihr Sechser kann zweite Bälle frei aufnehmen, wenn unsere Spitze zu tief hängen bleibt.',
          'Außenspieler können nach Ballgewinn direkt hinter unsere Wingbacks starten.',
        ],
        keyActions: [
          'Nach Ballverlust ihren ersten Pass ins Zentrum blocken.',
          'Zentraler Innenverteidiger sichert gegen lange Bälle.',
          'Ballnaher Achter springt auf ihren Achter heraus.',
          'Eine Spitze bleibt im Deckungsschatten ihres Sechsers.',
          'Wingback sprintet zurück, wenn der ballnahe Außenspieler starten kann.',
        ],
      },
      oppPossession: {
        spaces: [
          'Ihr Sechser ist die zentrale Verbindung und muss im Deckungsschatten der Spitzen bleiben.',
          'Ballnahe Achterräume entscheiden, ob ihr 4-1-4-1 zentral ins Spiel kommt.',
          'Außenbahnen müssen gegen frühe Läufe ihrer Außenspieler kontrolliert werden.',
          'Der Rückraum vor unserer Fünferkette bleibt gegen zweite Bälle ihres Sechsers wichtig.',
          'Verlagerungen auf ihre Außenspieler sind gefährlich, wenn unser Wingback zu spät erkennt.',
        ],
        advantages: [
          'Zwei Spitzen können ihre Innenverteidiger anlaufen und den Sechser abdecken.',
          'Drei Innenverteidiger sichern gut gegen ihren einzelnen Stürmer.',
          'Unsere drei Mittelfeldspieler können ihre zentralen Passwege direkt bekämpfen.',
        ],
        dangers: [
          'Ihr Mittelfeld kann unsere Passwege ins Zentrum schließen und uns nach Balleroberung sofort zustellen.',
          'Außenspieler können unsere Wingbacks früh anlaufen und tief binden.',
          'Ihr Sechser kann zweite Bälle frei aufnehmen, wenn unser Pressing nur auf die Innenverteidiger geht.',
          'Bei zu spätem Herausrücken bekommt ihr Achter Zeit, auf die ballferne Seite zu verlagern.',
        ],
        keyActions: [
          'Spitzen laufen Innenverteidiger an und decken den Sechser ab.',
          'Ballnaher Achter springt auf ihren Achter heraus.',
          'Wingback bleibt wach gegen Verlagerungen.',
          'Sechs schützt den Raum vor der Fünferkette gegen zweite Bälle.',
          'Ballferner Achter bleibt eingerückt und nimmt den nächsten Zentrumspass auf.',
        ],
      },
      afterGain: {
        spaces: [
          'Die Außenbahn hinter ihren Außenspielern ist nach Ballgewinn sofort bespielbar.',
          'Räume neben ihrem Sechser öffnen sich, wenn er nach vorn gegenpresst.',
          'Der ballferne Wingback kann nach schnellem Diagonalball frei werden.',
          'Der Rückraum vor ihrer Viererkette ist offen, bevor ihre Achter zurückfallen.',
        ],
        advantages: [
          'Nach Ballgewinn können wir sofort hinter ihre Außenspieler spielen.',
          'Zwei Spitzen geben eine tiefe und eine kurze Option gegen ihre Viererkette.',
          'Wingbacks können aus der Breite Tempo aufnehmen, bevor ihr 4-1-4-1 wieder kompakt ist.',
        ],
        dangers: [
          'Ein erster Pass in ihr kompaktes Zentrum läuft in den Zugriff von Sechs und Achtern.',
          'Wenn der Zielpass auf den Wingback zu spät kommt, wird er von ihrem Außenspieler gestellt.',
          'Zu viele Spieler vor dem Ball öffnen bei erneutem Verlust den direkten Zentrumspass.',
        ],
        keyActions: [
          'Nach Ballgewinn sofort hinter ihre Außenspieler spielen.',
          'Eine Spitze tiefer als Verbindungsspieler einsetzen.',
          'Achter enger an ihren Sechser heranschieben und nach Gewinn in dessen Rücken starten.',
          'Ballfernen Wingback früh sehen, aber erst nach gesichertem erstem Pass anspielen.',
          'Zentraler Innenverteidiger bleibt als Sicherung gegen lange Bälle.',
        ],
      },
    },
    liveCoaching: [
      '„Sechser binden!"',
      '„Ballferne Seite!"',
      '„Zentrum blocken!"',
    ],
    adjustments: [
      'Eine Spitze tiefer als Verbindungsspieler einsetzen.',
      'Wingback auf der Ballseite höher positionieren.',
      'Achter enger an ihren Sechser heranschieben.',
      'Wenn ihr Fünfermittelfeld das Zentrum schließt, häufiger über den zentralen Innenverteidiger andribbeln.',
    ],
  },
]
