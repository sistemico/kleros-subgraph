import { NewPhase } from '../../generated/Kleros/KlerosLiquid'

import { getSummaryEntity } from './core'

export function handleNewPhase(event: NewPhase): void {
  let summary = getSummaryEntity()
  summary.currentPhase = toPhase(event.params._phase)
  summary.lastPhaseChange = event.block.timestamp

  summary.save()
}

function toPhase(phase: i32): string {
  switch (phase) {
    default:
    case 0:
      return 'STAKING'
    case 1:
      return 'GENERATING'
    case 2:
      return 'DRAWING'
  }
}
