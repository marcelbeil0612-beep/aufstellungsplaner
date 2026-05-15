export type Role = 'GK' | 'FIELD'

export type Position =
  | 'GK'
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'ST' | 'CF'

export type Skills = {
  pace?: number
  shooting?: number
  passing?: number
  dribbling?: number
  defending?: number
  physical?: number
  gkReflexes?: number
  gkHandling?: number
  gkDiving?: number
  gkPositioning?: number
  gkKicking?: number
}

/** Aktueller Verfügbarkeitsstatus eines Spielers (undefined = verfügbar). */
export type PlayerStatus = 'injured' | 'suspended' | 'absent'

export type Player = {
  id: string
  name: string
  role: Role
  /**
   * Legacy-Feld (≤ v5 Persistenz): Foto als Data-URL.
   * Wird nach Hydration einmalig in den Photo-IDB-Store migriert und
   * anschließend gelöscht. Neue Fotos werden ausschließlich per `photoId` referenziert.
   * @deprecated nur noch für Migrations-Zwecke vorhanden
   */
  photo?: string
  /** Referenz auf einen Blob im Photo-IDB-Store (siehe `store/photoStore.ts`). */
  photoId?: string
  skills?: Skills
  /** Trikotnummer 1–99, rein anzeigerelevant. */
  number?: number
  /** Verfügbarkeitsstatus; undefined = einsatzbereit. */
  status?: PlayerStatus
  /**
   * Bevorzugte Spielpositionen (Stammposition[en]). Gibt der Auto-Aufstellung
   * einen kleinen Score-Bonus, wenn der Spieler dort steht. Nur für Feldspieler
   * relevant – Torhüter haben implizit GK als Stammposition.
   */
  preferredPositions?: Position[]
}

export type Slot = {
  id: string
  position: Position
  /** 0 = linke Spielfeldseite, 100 = rechte */
  x: number
  /** 0 = eigene Torlinie, 100 = gegnerische Torlinie */
  y: number
}

export type Formation = {
  id: string
  name: string
  slots: Slot[]
}

/**
 * Eintrag im Spielprotokoll: ein gespieltes Match mit Datum, Gegner, Ergebnis
 * und optionaler Referenz auf die genutzte Aufstellung. Bewusst flach gehalten;
 * Mannschafts- oder Wettbewerbskontext fehlt absichtlich für v1.
 */
export type Match = {
  id: string
  /** ISO-Datum (YYYY-MM-DD). */
  date: string
  /** Gegner-Anzeigename. */
  opponent: string
  /** ID einer gespeicherten Aufstellung (oder undefined, wenn frei eingetragen). */
  lineupId?: string
  /** Eigene Tore. */
  ourGoals?: number
  /** Gegnerische Tore. */
  oppGoals?: number
  /** Heim/Auswärts – rein anzeigerelevant. */
  venue?: 'home' | 'away'
  /** Freier Notiztext (max ~500 Zeichen empfohlen). */
  notes?: string
  createdAt: number
  updatedAt: number
}

/** Ein geplanter Auswechselvorgang. Reine Notiz – die App rechnet daraus keine
 *  abgeleitete Aufstellung, sondern hält den Plan strukturiert für den Trainer. */
export type Substitution = {
  id: string
  /** Geplante Spielminute, undefined = noch offen. */
  minute?: number
  /** Spieler, der vom Platz geht. */
  outPlayerId: string
  /** Spieler, der reinkommt. */
  inPlayerId: string
  /** Freier Hinweis („für den 10er", „wenn wir führen"). */
  note?: string
}
