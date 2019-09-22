import { BigInt } from '@graphprotocol/graph-ts'

import {
  NewPhase,
  NewPeriod,
  StakeSet,
  Draw,
  TokenAndETHShift,
  DisputeCreation,
  AppealPossible,
  AppealDecision,
  CreateSubcourtCall,
} from '../generated/Kleros/KlerosLiquid'

import { Court, Dispute, Kleros } from '../generated/schema'

import { toPeriod } from './helpers'

const KLEROS_SUMMARY_ID = '1'

export function handlerCourtCreation(call: CreateSubcourtCall): void {
  let court = new Court(generateCourtId())
  court.parent = call.inputs._parent.toString()
  court.hiddenVotes = call.inputs._hiddenVotes
  court.minStake = call.inputs._minStake
  court.alpha = call.inputs._alpha
  court.feeForJuror = call.inputs._feeForJuror
  court.jurorsForCourtJump = call.inputs._jurorsForCourtJump
  court.timesPerPeriod = call.inputs._timesPerPeriod

  court.created = call.block.timestamp
  court.createdAtBlock = call.block.number
  court.createdAtTransaction = call.transaction.hash

  court.save()
}

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

function generateCourtId(): string {
  let summary = getSummaryEntity()
  summary.courtCount = summary.courtCount.plus(BigInt.fromI32(1))

  summary.save()

  return summary.courtCount.toString()
}

function getSummaryEntity(): Kleros {
  let summary = Kleros.load(KLEROS_SUMMARY_ID)

  if (summary == null) {
    summary = new Kleros(KLEROS_SUMMARY_ID)
    summary.courtCount = BigInt.fromI32(0)
  }

  return summary as Kleros
}
