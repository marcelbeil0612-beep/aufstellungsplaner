import type { TacticBookEntry } from '../types'

export const entriesOur433: TacticBookEntry[] = [
  {
    id: '4-3-3_vs_4-4-2',
    ourSystem: '4-3-3',
    opponentSystem: '4-4-2',
    rating: 'vorteilhaft',
    character:
      'Wir haben meist die bessere Kontrolle, wenn wir das Zentrum mit unserem Dreier-Mittelfeld sauber besetzen. Schlüsselraum ist das Mittelfeld 3 gegen 2, Schlüsselrisiko ihre zwei Spitzen im eigenen Aufbau.',
    phases: {
      ownPossession: {
        spaces: [
          'Sechserraum vor ihrer Doppelsechs ist frei, weil ihre zwei Spitzen hochschieben',
          'Halbräume neben ihren zentralen Mittelfeldspielern öffnen sich, wenn die Achter dort einrücken',
          'Raum hinter ihrem Außenmittelfeld, sobald unser Außenverteidiger nachschiebt und Überzahl auf außen entsteht',
          'Zwischenlinie zwischen ihrer Mittelfeld- und Abwehrkette wird groß, wenn wir das Zentrum binden',
        ],
        advantages: [
          'Drei zentrale Mittelfeldspieler gegen ihre zwei → strukturelle Aufbau-Überzahl',
          'Sechser kann meist frei aufdrehen und das Spiel lenken',
          'Flügel halten Breite, Achter besetzen die Halbräume — klare Aufbaustruktur',
        ],
        dangers: [
          'Ihre zwei Spitzen können unseren Innenverteidiger-Aufbau direkt anlaufen, wenn wir zu lange am Ball klebten',
          'Zu langsames Tempo lässt ihren kompakten Block stehen und macht den Aufbau wirkungslos',
          'Wenn beide Außenverteidiger gleichzeitig hochschieben, fehlt Restverteidigung',
        ],
        keyActions: [
          'Sechser bietet sich zwischen den Innenverteidigern an, lenkt das Spiel',
          'Achter zwischen ihre Linien einrücken, im Halbraum anspielbar machen',
          'Außenverteidiger nachschieben, wenn Flügel diagonal einrückt',
          'Bei zentraler Bindung schnell Seitenwechsel suchen, ihre Flügel in Laufduelle zwingen',
        ],
      },
      afterLoss: {
        spaces: [
          'Zwischen unseren Innenverteidigern öffnet sich Raum für lange Bälle auf ihre zwei Spitzen',
          'Hinter unseren aufgerückten Außenverteidigern ist der ballnahe Korridor sehr verwundbar',
          'Halbraum hinter unserem ballnahen Achter wird zur Konterautobahn',
        ],
        advantages: [
          'Sechser steht zentral und kann sofort den ersten Vertikalpass blocken',
          'Drei zentrale Spieler ermöglichen Gegenpressing auf engem Raum',
        ],
        dangers: [
          'Ihre zwei Spitzen können den ersten langen Ball ausspielen und sofort 2-gegen-2 erzwingen',
          'Ihre Außenmittelfeldspieler haben freie Außenbahnen für Konter über außen',
          'Wenn unser Außenverteidiger nicht zurückkommt, drohen direkte Flanken aus dem Lauf',
        ],
        keyActions: [
          'Sechser bleibt zentral, sichert gegen den vertikalen Pass auf die Spitzen',
          'Ballnaher Achter presst sofort den Ballführer, kein passives Zurückfallen',
          'Flügel lassen sich nach hinten fallen, doppeln den Außenmittelfeldspieler',
          'Zweite Bälle im Zentrum aggressiv jagen, nicht ihrem Spieler überlassen',
        ],
      },
      oppPossession: {
        spaces: [
          'Ihr zentraler Aufbau ist eng — ihre Innenverteidiger haben keinen freien Mann mehr (wir sind 3-gegen-2-Pressing)',
          'Halbräume vor ihren Außenverteidigern sind die Druckzonen, dort lenken wir hin',
          'Sechserraum vor unserer Abwehr muss zentral geschlossen bleiben — kein Aufdrehen erlaubt',
        ],
        advantages: [
          'Front drei kann mannorientiert pressen: Stürmer auf einen Innenverteidiger, Flügel auf die Außenverteidiger',
          'Achter können auf ihre beiden Zentrumsspieler springen — keine Überzahl möglich',
          'Klare Pressingauslöser: Rückpass zum Innenverteidiger, schlechter erster Kontakt, langer Ball',
        ],
        dangers: [
          'Beide Spitzen suchen den langen Ball — unsere Innenverteidiger müssen die zweiten Bälle gewinnen',
          'Wenn wir zu hoch pressen und sie überspielen, sind ihre Spitzen vor unserer Kette frei',
          'Bei Überladung einer Seite kann ihr Außenverteidiger ballfern unbesetzt nachstoßen',
        ],
        keyActions: [
          'Stürmer lenkt den Aufbau bogenförmig auf eine Seite, blockt Querpass',
          'Ballnaher Flügel presst den Außenverteidiger aggressiv, Innenseite zu',
          'Ballnaher Achter springt auf ihren zentralen Mittelfeldspieler',
          'Sechser bleibt zentral als Restverteidigung, nicht mannorientiert nach vorne ziehen',
          'Außenverteidiger sichert hinter dem hochschiebenden Flügel ab',
        ],
      },
      afterGain: {
        spaces: [
          'Hinter ihren aufgerückten Außenmittelfeldspielern bleibt die Außenbahn offen für unseren Flügel',
          'Tiefe zwischen ihren Innenverteidigern, sobald die nach Ballverlust kurz unsortiert sind',
          'Halbraum-Diagonale auf den ballfernen Flügel ist nach Verlagerungen besonders ergiebig',
        ],
        advantages: [
          'Drei schnelle Angreifer können sofort in die Tiefe attackieren',
          'Sechser sichert hinten, Achter nutzen freie Räume in der Mitte',
          'Klare Konteroption über außen, weil ihre Außenmittelfeldspieler weite Wege zurück haben',
        ],
        dangers: [
          'Ihre Doppelsechs steht meist zentral, schnelle vertikale Pässe können geblockt werden',
          'Wenn wir zentral kontern statt über außen, laufen wir oft direkt in ihre Spitzen-Sicherung',
        ],
        keyActions: [
          'Erster Pass sucht den ballnahen Flügel in die Tiefe oder den Achter im Zwischenraum',
          'Flügel attackiert sofort die Außenbahn, nicht im Fuß bleiben',
          'Außenverteidiger schiebt nach für Doppelpass oder zweite Welle',
          'Stürmer bindet ihre Innenverteidiger durch Tiefenläufe, schafft Raum für Achter',
        ],
      },
    },
    ourAdvantages: [
      'Zentrum oft 3 gegen 2',
      'Flügel + Außenverteidiger geben klare Breite',
      'Sechser kann das Spiel lenken',
    ],
    ourDangers: [
      'Zwei Spitzen stressen unseren Aufbau',
      'Außenverteidiger sind nach Ballverlust offen',
      'Zu langsames Spiel macht ihren Block stark',
    ],
    importantZones: [
      'Sechserraum vor deren Mittelfeld',
      'Halbräume neben deren zentralen Spielern',
      'Raum hinter deren Außenmittelfeld',
    ],
    pressing: [
      'Neuner lenkt den Aufbau auf eine Seite',
      'Flügel pressen Außenverteidiger aggressiv',
      'Achter schieben auf deren Zentrum',
    ],
    inPossession: [
      'Achter zwischen den Linien anbieten',
      'Außenverteidiger mutig nachschieben',
      'Seitenwechsel nach Ballbindung suchen',
    ],
    transition: [
      'Nach Ballgewinn sofort Tiefe über außen',
      'Nach Ballverlust Sechser zentral sichern',
      'Zweite Bälle im Zentrum jagen',
    ],
    liveCoaching: [
      '„Zentrum besetzen!"',
      '„Schnell verlagern!"',
    ],
    adjustments: [
      'Auf 4-2-3-1 kippen, wenn der Zehnerraum zu wenig besetzt wird',
      'Einen Achter tiefer abkippen lassen für mehr Aufbausicherheit',
      'Bei zwei aktiven Außenverteidigern einen als Restverteidiger zurückhalten',
    ],
  },
  {
    id: '4-3-3_vs_4-2-3-1',
    ourSystem: '4-3-3',
    opponentSystem: '4-2-3-1',
    rating: 'ausgeglichen',
    character:
      'Ausgeglichenes Duell, weil beide Teams im Zentrum sauber gestaffelt sind. Schlüsselraum ist der Bereich um ihren Zehner, Schlüsselrisiko ist ein isolierter Sechser vor unserer Abwehr.',
    phases: {
      ownPossession: {
        spaces: [
          'Raum neben ihrer Doppelsechs wird offen, wenn unsere Achter im Halbraum versetzt anbieten.',
          'Hinter ihrer Doppelsechs entsteht Zwischenraum, sobald ihr Zehner nach vorne auf unseren Sechser schiebt.',
          'Außenbahn hinter ihren Außenspielern kann bespielt werden, wenn wir mit Flügel und Außenverteidiger Überzahl herstellen.',
          'Ballferner Halbraum im letzten Drittel wird frei, wenn wir eine Seite überladen und dann schnell verlagern.',
        ],
        advantages: [
          'Unsere klare Flügelstruktur zieht ihre Außenspieler breit und öffnet Passwege neben ihre Doppelsechs.',
          'Mit Sechser und zwei Achtern haben wir gute Staffelung, um ihren Zehner zu überspielen und danach Tempo aufzunehmen.',
          'Hohe Breite der Flügel bindet ihre Außenverteidiger und schafft Raum für Achterläufe in den Halbraum.',
        ],
        dangers: [
          'Ihr Zehner kann unseren Sechser zustellen und den Aufbau durch die Mitte blockieren.',
          'Ihre Doppelsechs kann vertikale Pässe auf unsere Achter abfangen, wenn wir zu flach anbieten.',
          'Bei zu langsamem Balltempo verschiebt ihr 4-2-3-1 kompakt und nimmt uns die Halbräume.',
          'Wenn beide Außenverteidiger gleichzeitig hochschieben, öffnen wir Räume hinter uns für ihre Außenspieler.',
        ],
        keyActions: [
          'Sechser löst sich aktiv aus dem Deckungsschatten ihres Zehners und bietet sich nicht statisch vor den Innenverteidigern an.',
          'Ballnaher Achter kippt kurz neben ihre Doppelsechs, ballferner Achter bleibt höher im Halbraum anspielbar.',
          'Flügel hält Breite, Außenverteidiger unterstützt versetzt dahinter oder startet erst nach klarer Absicherung nach vorne.',
          'Mittelstürmer bindet die Innenverteidiger und lässt sich situativ kurz fallen, um den dritten Mann im Zentrum freizuspielen.',
          'Nach Seitenüberladung schnell auf den ballfernen Flügel verlagern und sofort Tempo gegen den Außenverteidiger aufnehmen.',
        ],
      },
      afterLoss: {
        spaces: [
          'Zehnerraum vor unserer Abwehr ist sofort kritisch, weil ihr Zehner dort den ersten freien Pass fordern kann.',
          'Halbraum neben unserem Sechser öffnet sich, wenn ein Achter nach Ballverlust zu hoch steht.',
          'Außenbahn hinter unserem aufgerückten Außenverteidiger ist offen für ihre Außenspieler.',
          'Rückraum um die Mittellinie wird eng, dort entscheiden zweite Bälle über Kontrolle oder Konter.',
        ],
        advantages: [
          'Unsere drei Mittelfeldspieler können den Ballverlust zentral sofort einkreisen, wenn die Abstände kurz bleiben.',
          'Ballnaher Flügel und Außenverteidiger können auf außen schnell eine Pressingfalle gegen ihren Außenspieler stellen.',
          'Der Sechser steht grundsätzlich zentral und kann den direkten Pass auf ihren Zehner blocken.',
        ],
        dangers: [
          'Ihr Zehner kann nach dem ersten Pass aufdrehen, wenn unser Sechser alleine gelassen wird.',
          'Ihre Außenspieler können direkt in den Raum hinter unsere Außenverteidiger starten.',
          'Ihre Doppelsechs kann zweite Bälle aufnehmen und sofort diagonal hinter unsere Kette spielen.',
        ],
        keyActions: [
          'Ballnaher Achter geht sofort auf den Ballführer, während der Sechser den Passweg auf ihren Zehner schließt.',
          'Ballnaher Flügel arbeitet rückwärts und verhindert den einfachen Pass auf ihren Außenverteidiger oder Außenspieler.',
          'Ballferner Achter rückt eng ein und sichert den zweiten Ball im Zentrum.',
          'Außenverteidiger sprintet nicht blind ins Gegenpressing, sondern sichert zuerst den Raum hinter sich.',
          'Innenverteidiger bleiben gestaffelt: einer hält Kontakt zum Stürmer, der andere sichert Tiefe.',
        ],
      },
      oppPossession: {
        spaces: [
          'Raum um ihre Doppelsechs ist die zentrale Pressingzone, weil dort ihr Spielaufbau stabilisiert wird.',
          'Zehnerraum zwischen unseren Achtern und unserem Sechser darf nicht offen werden.',
          'Außenbahn auf unserer ballnahen Seite wird zur Falle, wenn Flügel, Achter und Außenverteidiger gemeinsam schieben.',
          'Halbraum neben unserem Sechser ist gefährlich, wenn ein Achter zu früh auf ihren Sechser springt.',
        ],
        advantages: [
          'Unsere Achter können mutig auf ihre beiden Sechser schieben und zentrale Drehungen verhindern.',
          'Unser Sechser hat eine klare Aufgabe gegen ihren Zehner und kann den Zwischenlinienraum kontrollieren.',
          'Die Front drei kann den Aufbau auf eine Seite lenken und ihre Außenverteidiger unter Druck setzen.',
        ],
        dangers: [
          'Ihr Zehner kann sich seitlich aus dem Rücken unseres Sechsers lösen und zwischen den Linien frei werden.',
          'Wenn unsere Achter zu hoch pressen, öffnen sich Passwege hinter ihnen in den Halbraum.',
          'Bei schwachem Rückwärtsverhalten unserer Flügel entstehen 2-gegen-1-Situationen auf unseren Außenverteidigern.',
          'Ihr Mittelstürmer kann unsere Innenverteidiger binden und Ablagen auf den nachstoßenden Zehner ermöglichen.',
        ],
        keyActions: [
          'Mittelstürmer läuft bogenförmig an und nimmt einen ihrer Sechser in den Deckungsschatten.',
          'Ballnaher Flügel presst den Außenverteidiger mit geschlossener Innenseite.',
          'Ballnaher Achter springt auf ihren Sechser, sobald der Pass offen gespielt wird.',
          'Sechser bleibt eng am Zehnerraum und lässt sich nicht unnötig aus dem Zentrum ziehen.',
          'Ballferner Flügel rückt ein, bleibt aber bereit für die Verlagerung auf ihren Außenverteidiger.',
        ],
      },
      afterGain: {
        spaces: [
          'Raum hinter ihren Außenverteidigern ist sofort bespielbar, wenn sie im Angriff hochgeschoben haben.',
          'Halbraum hinter ihrer Doppelsechs öffnet sich, wenn diese nach Ballverlust noch vor dem Ball steht.',
          'Ballferne Außenbahn ist frei, wenn wir nach Ballgewinn ihren Zehner und die ballnahe Doppelsechs überspielen.',
          'Schnittstelle zwischen Innenverteidiger und Außenverteidiger wird offen für diagonale Tiefenläufe unserer Flügel.',
        ],
        advantages: [
          'Unsere drei Angreifer können direkt gegen ihre Viererkette in die Tiefe starten.',
          'Durch klare Breite haben wir nach Ballgewinn sofort eine Option hinter ihre Außenverteidiger.',
          'Unsere Achter können die freien Halbräume als zweite Welle besetzen.',
        ],
        dangers: [
          'Ihre Doppelsechs kann zentrale Konterpässe blocken, wenn unser erster Pass zu langsam oder zu offensichtlich ist.',
          'Ihr Zehner kann unseren Sechser direkt wieder unter Druck setzen, wenn wir nach Ballgewinn quer statt vorwärts spielen.',
          'Bei zu vielen Tiefenläufen fehlt eine kurze Sicherungsoption und wir verlieren den Ball sofort wieder.',
        ],
        keyActions: [
          'Erster Pass spielt aus dem Druck heraus und überspielt ihren Zehner möglichst mit einem Kontakt.',
          'Ballnaher Flügel startet sofort hinter den Außenverteidiger, statt den Ball nur in den Fuß zu fordern.',
          'Mittelstürmer bindet die Innenverteidiger mit Tiefenlauf oder lässt klatschen auf den nachrückenden Achter.',
          'Ballferner Achter besetzt den Rückraum, falls der direkte Konter nicht durchgeht.',
          'Sechser bleibt als Absicherung zentral und schiebt nur nach, wenn beide Innenverteidiger sauber gestaffelt sind.',
        ],
      },
    },
    liveCoaching: ['„Sechser nicht allein!"', '„Zehnerraum zu!"', '„Balltempo hoch!"'],
    adjustments: [
      'Einen Achter tiefer für mehr Aufbaukontrolle halten, wenn ihr Zehner unseren Sechser isoliert.',
      'Gegen den Ball situativ in ein 4-1-4-1 fallen lassen, damit die Flügel ihre Außenspieler sauber aufnehmen.',
      'Bei festgefahrenem Zentrum Flügel breiter halten und Außenverteidiger nur auf klaren Auslöser nachschieben lassen.',
      'Mittelstürmer häufiger kurz entgegenkommen lassen, um ihre Doppelsechs herauszuziehen und Achterläufe in den Halbraum zu öffnen.',
    ],
    // Legacy-Felder leer — Inhalte sind ins neue phases-Schema migriert.
    ourAdvantages: [],
    ourDangers: [],
    importantZones: [],
    pressing: [],
    inPossession: [],
    transition: [],
  },
  {
    id: '4-3-3_vs_3-5-2',
    ourSystem: '4-3-3',
    opponentSystem: '3-5-2',
    rating: 'unangenehm',
    character:
      'Oft unangenehm, weil der Gegner im Zentrum viele Spieler hat und mit zwei Spitzen bindet.',
    ourAdvantages: [
      'Außen oft Platz hinter den Wingbacks',
      'Gute Breite gegen Dreier-/Fünferkette',
      '1 gegen 1 auf dem Flügel möglich',
    ],
    ourDangers: [
      'Zentrum kann unterbesetzt wirken',
      'Wingbacks können unsere Außenverteidiger tief drücken',
      'Zwei Stürmer gegen unsere Innenverteidiger',
    ],
    importantZones: [
      'Raum hinter den Wingbacks',
      'Halbräume beim Umschalten',
      'Sechserraum zur Stabilisierung',
    ],
    pressing: [
      'Flügel müssen Wingbacks mitdenken',
      'Sechser kippt situativ zwischen Innenverteidiger',
      'Achter schließen Passwege ins Zentrum',
    ],
    inPossession: [
      'Schnell auf Außen verlagern',
      'Tiefenläufe hinter den Wingbacks',
      'Nicht zu eng durchs Zentrum erzwingen',
    ],
    transition: [
      'Ballgewinne sofort in freie Außenräume spielen',
      'Nach Ballverlust Zentrum schließen',
    ],
    liveCoaching: [
      'Außenverteidiger nicht permanent isolieren',
      'Flügel mit Defensivdisziplin',
      'Tiefe hinter Wingbacks attackieren',
    ],
    adjustments: [
      'Auf 4-2-3-1 oder 4-4-2 gegen den Ball wechseln',
    ],
  },
  {
    id: '4-3-3_vs_3-4-3',
    ourSystem: '4-3-3',
    opponentSystem: '3-4-3',
    rating: 'unangenehm',
    character: 'Sehr fordernd auf den Flügeln und in den Halbräumen.',
    ourAdvantages: [
      'Zentrum kann mit gutem Positionsspiel kontrolliert werden',
      'Raum hinter hochstehenden Wingbacks',
    ],
    ourDangers: [
      'Deren vordere Dreierreihe bindet stark',
      'Halbräume sind schwer zu kontrollieren',
      'Außenverteidiger geraten leicht in Unterzahl',
    ],
    importantZones: [
      'Hinter Wingbacks',
      'Halbraum neben unserem Sechser',
      'Schnittstellen neben den Halbverteidigern',
    ],
    pressing: [
      'Flügelspieler müssen konsequent rückwärts arbeiten',
      'Achter unterstützen außen',
    ],
    inPossession: [
      'Mit Verlagerungen arbeiten',
      'Flügelstürmer in Tiefe schicken',
    ],
    transition: [
      'Offene Außenräume sofort nutzen',
      'Gegenpressing sauber absichern',
    ],
    liveCoaching: [
      'Halbräume schließen',
      'Außen doppeln',
      'Nicht in offene Konter fallen',
    ],
    adjustments: [
      '4-1-4-1 gegen den Ball',
    ],
  },
  {
    id: '4-3-3_vs_4-4-2-raute',
    ourSystem: '4-3-3',
    opponentSystem: '4-4-2-raute',
    rating: 'vorteilhaft',
    character: 'Meist gutes Duell für uns, wenn wir Breite sauber nutzen.',
    ourAdvantages: [
      'Außen klare Vorteile',
      'Gegner muss viel verschieben',
      'Seitenwechsel tun weh',
    ],
    ourDangers: [
      'Zentrum kann bei schlechtem Positionsspiel zugestellt werden',
      'Gegner hat Präsenz im Zwischenlinienraum',
    ],
    importantZones: [
      'Beide Außenbahnen',
      'Raum hinter ihren Achtern',
      'Schnittstellen neben dem Sechser',
    ],
    pressing: [
      'Zentrum gut verdichten',
      'Gegner nicht durch die Mitte kombinieren lassen',
    ],
    inPossession: [
      'Maximale Breite',
      'Schnelle Seitenwechsel',
      'Außenverteidiger aktiv einschalten',
    ],
    transition: [
      'Sofort auf Außen',
      'Bei Ballverlust Mitte schließen',
    ],
    liveCoaching: [
      'Feld groß machen',
      'Nicht ins Zentrum verrennen',
      'Außenüberzahl schaffen',
    ],
    adjustments: [
      'Kaum nötig, eher Rollenverhalten anpassen',
    ],
  },
  {
    id: '4-3-3_vs_5-4-1',
    ourSystem: '4-3-3',
    opponentSystem: '5-4-1',
    rating: 'unangenehm',
    character: 'Geduldsspiel gegen tiefen und kompakten Block.',
    ourAdvantages: [
      'Viel Ballbesitz',
      'Außen können wir den Gegner binden',
      'Rückraum kann frei werden',
    ],
    ourDangers: [
      'Viele ungefährliche Flanken',
      'Konter gegen offene Struktur',
      'Zu langsames Balltempo',
    ],
    importantZones: [
      'Halbräume vor der Kette',
      'Rückraum an der Strafraumkante',
      'Schnittstellen zwischen Außen- und Halbverteidiger',
    ],
    pressing: [
      'Restverteidigung immer sauber',
      'Konterspieler absichern',
    ],
    inPossession: [
      'Geduld mit Tempowechseln',
      'Rückpässe in den Rückraum',
      'Läufe in den Halbraum statt nur außen entlang',
    ],
    transition: [
      'Gegenpressing direkt nach Ballverlust',
      'Zweite Bälle sichern',
    ],
    liveCoaching: [
      'Nicht nur flanken',
      'Mehr Halbraumläufe',
      'Geduldig, aber scharf spielen',
    ],
    adjustments: [
      'Einen Achter höher als Zehner interpretieren',
    ],
  },
  {
    id: '4-3-3_vs_4-3-3',
    ourSystem: '4-3-3',
    opponentSystem: '4-3-3',
    rating: 'ausgeglichen',
    character:
      'Das Duell ist stark gespiegelt und wird über Tempo, Abstände und bessere Flügelbesetzung entschieden. Wer den Sechserraum sauber kontrolliert, bekommt mehr Kontrolle.',
    ourAdvantages: [
      'Klare Pressingzuordnung gegen ihre Viererkette.',
      'Flügel können ihre Außenverteidiger früh binden.',
      'Achter können flexibel in Halbräume schieben.',
    ],
    ourDangers: [
      'Räume hinter unseren Außenverteidigern.',
      'Ihr Sechser kann frei aufdrehen.',
      'Gleichzahl auf den Flügeln kann kippen.',
    ],
    importantZones: [
      'Sechserraum vor unserer Abwehr.',
      'Halbräume neben ihrem Sechser.',
      'Außenbahn hinter ihren Außenverteidigern.',
    ],
    pressing: [
      'Front drei lenkt den Aufbau auf eine Seite.',
      'Ballnaher Achter springt auf ihren Sechser.',
      'Außenverteidiger rückt nur mit klarer Absicherung heraus.',
    ],
    inPossession: [
      'Flügel breit halten und Außenverteidiger versetzt einbinden.',
      'Achter in die Räume neben ihrem Sechser schieben.',
      'Nach Verlagerung sofort Tempo gegen den Außenverteidiger aufnehmen.',
    ],
    transition: [
      'Nach Ballgewinn sofort hinter ihren Außenverteidiger spielen.',
      'Nach Ballverlust mit Achter und Flügel sofort gegenpressen.',
      'Sechser bleibt zentral als Restverteidigung.',
    ],
    liveCoaching: [
      '„Sechser sichern!"',
      '„Breite halten!"',
    ],
    adjustments: [
      'Einen Achter tiefer halten, wenn ihr Sechser zu frei wird.',
      'Außenverteidiger ballfern früher einrücken lassen.',
      'Flügelspieler situativ innen starten lassen.',
    ],
  },
  {
    id: '4-3-3_vs_5-3-2',
    ourSystem: '4-3-3',
    opponentSystem: '5-3-2',
    rating: 'ausgeglichen',
    character:
      'Wir haben Breite und können ihre Wingbacks binden. Schwierig wird es, wenn ihre zwei Spitzen unsere Innenverteidiger früh unter Druck setzen.',
    ourAdvantages: [
      'Flügel können die Breite gegen ihre Fünferkette halten.',
      'Außenverteidiger können Überzahl gegen Wingbacks schaffen.',
      'Drei zentrale Spieler sichern zweite Bälle gut.',
    ],
    ourDangers: [
      'Konter über ihre zwei Spitzen.',
      'Zu frühe Flanken gegen drei Innenverteidiger.',
      'Ballverluste im Zentrum gegen ihre enge Staffelung.',
    ],
    importantZones: [
      'Außenbahn gegen ihre Wingbacks.',
      'Rückraum vor ihrer Fünferkette.',
      'Raum hinter unseren Außenverteidigern.',
    ],
    pressing: [
      'Mittelstürmer lenkt auf einen äußeren Innenverteidiger.',
      'Flügel presst Wingback erst bei offenem Pass.',
      'Achter sichern den Pass auf ihre Zentrumsspieler.',
    ],
    inPossession: [
      'Geduldig verlagern und ihre Fünferkette verschieben.',
      'Flügel breit halten, Achter in den Halbraum schieben.',
      'Flanken erst nach Tempo oder Rückpassoption bringen.',
    ],
    transition: [
      'Nach Ballgewinn sofort die ballferne Seite suchen.',
      'Nach Ballverlust direkten Pass auf ihre Spitzen blocken.',
      'Außenverteidiger ballfern früh absichern.',
    ],
    liveCoaching: [
      '„Nicht blind flanken!"',
      '„Rückraum besetzen!"',
    ],
    adjustments: [
      'Einen Außenverteidiger tiefer zur Kontersicherung halten.',
      'Mittelstürmer häufiger kurz entgegenkommen lassen.',
      'Achter ballnah enger an den Wingback-Raum schieben.',
    ],
  },
  {
    id: '4-3-3_vs_4-1-4-1',
    ourSystem: '4-3-3',
    opponentSystem: '4-1-4-1',
    rating: 'ausgeglichen',
    character:
      'Ihre Fünfer-Mittelfeldstruktur kann unsere Zentrale blockieren. Wir müssen ihren Sechser bewegen und dann schnell über Flügel oder Halbraum durchbrechen.',
    ourAdvantages: [
      'Flügel können ihre Außenverteidiger direkt binden.',
      'Achter können neben ihrem Sechser Überladungen schaffen.',
      'Gute Restverteidigung gegen ihren einzelnen Stürmer.',
    ],
    ourDangers: [
      'Ihre Mittelfeldlinie schließt zentrale Passwege.',
      'Ihr Sechser kann zweite Bälle kontrollieren.',
      'Außenspieler können unsere Außenverteidiger früh attackieren.',
    ],
    importantZones: [
      'Raum neben ihrem Sechser.',
      'Außenbahn hinter ihren Außenspielern.',
      'Zentrum vor unserer Abwehr.',
    ],
    pressing: [
      'Mittelstürmer stellt ihren Sechser im Deckungsschatten zu.',
      'Flügel leiten den Aufbau auf den Außenverteidiger.',
      'Achter schieben aggressiv auf ihre Achter.',
    ],
    inPossession: [
      'Sechser über kurze Ablagen herausziehen.',
      'Achter diagonal in den Halbraum starten lassen.',
      'Flügel nach Verlagerung schnell ins Eins-gegen-eins bringen.',
    ],
    transition: [
      'Nach Ballgewinn sofort hinter ihre Außenspieler spielen.',
      'Nach Ballverlust Pass auf ihren Sechser schließen.',
      'Innenverteidiger sichern früh gegen lange Bälle.',
    ],
    liveCoaching: [
      '„Sechser bewegen!"',
      '„Tempo nach außen!"',
    ],
    adjustments: [
      'Einen Achter tiefer zur Spieleröffnung abkippen lassen.',
      'Flügel situativ innen positionieren.',
      'Außenverteidiger ballnah höher als Überzahlspieler nutzen.',
    ],
  },
]
