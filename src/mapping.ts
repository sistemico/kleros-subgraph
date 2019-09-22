import {
  NewPhase,
  NewPeriod,
  StakeSet,
  Draw,
  TokenAndETHShift,
  DisputeCreation,
  AppealPossible,
  AppealDecision,
} from '../generated/Kleros/KlerosLiquid'

import { Dispute } from '../generated/schema'

import { toPeriod } from './helpers'

export function handleNewPhase(event: NewPhase): void {
  // TODO
}

export function handleNewPeriod(event: NewPeriod): void {
  let dispute = new Dispute(event.params._disputeID.toString())
  dispute.period = toPeriod(event.params._period)

  dispute.modified = event.block.timestamp
  dispute.modifiedAtBlock = event.block.number
  dispute.modifiedAtTransaction = event.transaction.hash

  dispute.save()
}

export function handleStakeSet(event: StakeSet): void {
  // TODO
}

export function handleDraw(event: Draw): void {
  // TODO
}

export function handleTokenAndETHShift(event: TokenAndETHShift): void {
  // TODO
}

export function handleDisputeCreation(event: DisputeCreation): void {
  let dispute = new Dispute(event.params._disputeID.toString())
  dispute.period = 'EVIDENCE'
  dispute.owner = event.transaction.from

  dispute.created = event.block.timestamp
  dispute.createdAtBlock = event.block.number
  dispute.createdAtTransaction = event.transaction.hash

  dispute.modified = dispute.created
  dispute.modifiedAtBlock = dispute.createdAtBlock
  dispute.modifiedAtTransaction = dispute.createdAtTransaction

  dispute.save()
}

export function handleAppealPossible(event: AppealPossible): void {
  // TODO
}

export function handleAppealDecision(event: AppealDecision): void {
  // TODO
}
