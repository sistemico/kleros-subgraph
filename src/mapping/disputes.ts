import {
  AppealDecision,
  AppealPossible,
  DisputeCreation,
  NewPeriod,
} from '../../generated/Kleros/KlerosLiquid'

import { Dispute } from '../../generated/schema'

import { getKlerosContract, getSummaryEntity } from './core'
import { getOrRegisterCourt } from './courts'
import { ONE } from './utils'

export function handleDisputeCreation(event: DisputeCreation): void {
  let callResult = getKlerosContract().try_disputes(event.params._disputeID)

  if (!callResult.reverted) {
    let disputeData = callResult.value

    // Register a new dispute
    let dispute = new Dispute(event.params._disputeID.toString())
    dispute.numberOfChoices = disputeData.value2
    dispute.period = toPeriod(disputeData.value3)
    dispute.owner = event.transaction.from

    dispute.created = event.block.timestamp
    dispute.createdAtBlock = event.block.number
    dispute.createdAtTransaction = event.transaction.hash

    dispute.modified = dispute.created
    dispute.modifiedAtBlock = dispute.createdAtBlock
    dispute.modifiedAtTransaction = dispute.createdAtTransaction

    // Associate dispute with a court
    if (disputeData.value0 != null) {
      let court = getOrRegisterCourt(disputeData.value0)

      if (court != null) {
        dispute.court = court.id
        court.disputeCount = court.disputeCount.plus(ONE)

        court.save()
      }
    }

    dispute.save()

    // Register dispute in platform summary
    let summary = getSummaryEntity()
    summary.disputeCount = summary.disputeCount.plus(ONE)

    summary.save()
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
