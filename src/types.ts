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

export type Player = {
  id: string
  name: string
  role: Role
  /** Optionales Spielerfoto als Data-URL (wird im localStorage abgelegt). */
  photo?: string
  skills?: Skills
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
