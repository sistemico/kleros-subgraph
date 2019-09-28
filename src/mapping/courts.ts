import { BigInt } from '@graphprotocol/graph-ts'

import {
  ChangeSubcourtAlphaCall,
  ChangeSubcourtJurorFeeCall,
  ChangeSubcourtJurorsForJumpCall,
  ChangeSubcourtMinStakeCall,
} from '../../generated/Kleros/KlerosLiquid'

import { PolicyUpdate } from '../../generated/PolicyRegistry/PolicyRegistry'

import { Court } from '../../generated/schema'

import { getKlerosContract, getSummaryEntity } from './core'
import { ONE } from './utils'
import { toDecimal } from './token'

export function handleChangeAlpha(call: ChangeSubcourtAlphaCall): void {
  let court = Court.load(call.inputs._subcourtID.toString())

  if (court != null) {
    court.alpha = call.inputs._alpha

    court.save()
  }
}

export function handleChangeJurorFee(call: ChangeSubcourtJurorFeeCall): void {
  let court = Court.load(call.inputs._subcourtID.toString())

  if (court != null) {
    court.feeForJuror = toDecimal(call.inputs._feeForJuror)

    court.save()
  }
}

export function handleChangeJurorsForJump(call: ChangeSubcourtJurorsForJumpCall): void {
  let court = Court.load(call.inputs._subcourtID.toString())

  if (court != null) {
    court.jurorsForCourtJump = toDecimal(call.inputs._jurorsForCourtJump)

    court.save()
  }
}

export function handleChangeMinStake(call: ChangeSubcourtMinStakeCall): void {
  let court = Court.load(call.inputs._subcourtID.toString())

  if (court != null) {
    court.minStake = toDecimal(call.inputs._minStake)

    court.save()
  }
}

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
