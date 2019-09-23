import { BigInt } from '@graphprotocol/graph-ts'

import { CreateSubcourtCall } from '../../generated/Kleros/KlerosLiquid'
import { Court } from '../../generated/schema'

import { getSummaryEntity } from './summary'

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

function generateCourtId(): string {
  let summary = getSummaryEntity()
  summary.courtCount = summary.courtCount.plus(BigInt.fromI32(1))

  summary.save()

  return summary.courtCount.toString()
}
