import { BigInt } from '@graphprotocol/graph-ts'

import { PolicyUpdate } from '../../generated/PolicyRegistry/PolicyRegistry'

import { Court } from '../../generated/schema'

import { getKlerosContract, getSummaryEntity } from './core'
import { ONE } from './utils'
import { toDecimal } from './token'

export function handlerPolicyUpdate(event: PolicyUpdate): void {
  let court = getOrRegisterCourt(event.params._subcourtID)

  if (court) {
    court.policy = event.params._policy

    court.save()
  }
}

export function getOrRegisterCourt(courtId: BigInt): Court {
  let court = Court.load(courtId.toString())

  if (court == null) {
    let courtData = getKlerosContract().try_courts(courtId)

    // Register court if not exists
    if (!courtData.reverted) {
      court = new Court(courtId.toString())
      court.name = getCourtName(courtId)
      court.parent = courtData.value.value0.toString()
      court.hiddenVotes = courtData.value.value1
      court.minStake = toDecimal(courtData.value.value2)
      court.alpha = courtData.value.value3
      court.feeForJuror = toDecimal(courtData.value.value4)
      court.jurorsForCourtJump = toDecimal(courtData.value.value5)

      court.disputeCount = BigInt.fromI32(0)

      // Register court in platform summary
      let summary = getSummaryEntity()
      summary.courtCount = summary.courtCount.plus(ONE)

      // Persist all the entities
      court.save()
      summary.save()
    }
  }

  return court as Court
}

function getCourtName(id: BigInt): string {
  switch (id.toI32()) {
    case 0:
      return 'General Court'
    case 1:
      return 'Blockchain'
    case 2:
      return 'Non-Technical'
    case 3:
      return 'Exchange Token Listing'
    case 4:
      return 'Technical'
    case 5:
      return 'Marketing Services'
    case 6:
      return 'English Language'
    case 7:
      return 'Video Production'
    default:
      return 'Unknown'
  }
}
