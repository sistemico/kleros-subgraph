import {
  AppealDecision,
  AppealPossible,
  DisputeCreation,
  NewPeriod,
} from '../../generated/Kleros/KlerosLiquid'

import { Dispute } from '../../generated/schema'

import { getKlerosContract } from './core'
import { getOrCreateCourt } from './courts'

export function handleDisputeCreation(event: DisputeCreation): void {
  let disputeData = getKlerosContract().try_disputes(event.params._disputeID)

  if (!disputeData.reverted) {
    let court = getOrCreateCourt(disputeData.value.value0)

    let dispute = new Dispute(event.params._disputeID.toString())
    dispute.court = court.id
    dispute.numberOfChoices = disputeData.value.value2
    dispute.period = toPeriod(disputeData.value.value3)
    dispute.owner = event.transaction.from

    dispute.created = event.block.timestamp
    dispute.createdAtBlock = event.block.number
    dispute.createdAtTransaction = event.transaction.hash

    dispute.modified = dispute.created
    dispute.modifiedAtBlock = dispute.createdAtBlock
    dispute.modifiedAtTransaction = dispute.createdAtTransaction

    dispute.save()
  }
}

export function handleNewPeriod(event: NewPeriod): void {
  let dispute = new Dispute(event.params._disputeID.toString())
  dispute.period = toPeriod(event.params._period)

  dispute.modified = event.block.timestamp
  dispute.modifiedAtBlock = event.block.number
  dispute.modifiedAtTransaction = event.transaction.hash

  dispute.save()
}

export function handleAppealPossible(event: AppealPossible): void {
  // TODO
}

export function handleAppealDecision(event: AppealDecision): void {
  // TODO
}

function toPeriod(period: i32): string {
  switch (period) {
    default:
    case 0:
      return 'EVIDENCE'
    case 1:
      return 'COMMIT'
    case 2:
      return 'VOTE'
    case 3:
      return 'APPEAL'
    case 4:
      return 'EXECUTION'
  }
}
