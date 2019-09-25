import { BigInt, ipfs, JSONValue, log, Value } from '@graphprotocol/graph-ts'

import { CreateSubcourtCall } from '../../generated/PolicyRegistry/KlerosLiquid'
import { PolicyUpdate } from '../../generated/PolicyRegistry/PolicyRegistry'

import { Court } from '../../generated/schema'

import { getKlerosContract, getSummaryEntity } from './core'
import { toDecimal } from './token'

export function handlerCourtCreation(call: CreateSubcourtCall): void {
  let court = new Court(generateCourtId())
  court.parent = call.inputs._parent.toString()
  court.hiddenVotes = call.inputs._hiddenVotes
  court.minStake = toDecimal(call.inputs._minStake)
  court.alpha = call.inputs._alpha
  court.feeForJuror = toDecimal(call.inputs._feeForJuror)
  court.jurorsForCourtJump = toDecimal(call.inputs._jurorsForCourtJump)

  court.created = call.block.timestamp
  court.createdAtBlock = call.block.number
  court.createdAtTransaction = call.transaction.hash

  court.save()
}

export function handlerPolicyUpdate(event: PolicyUpdate): void {
  let court = getOrCreateCourt(event.params._subcourtID)

  if (court != null && event.params._policy != null) {
    court.policy = event.params._policy
    court.save()

    // Try to get information from policy
    let policy = court.policy.split('/ipfs/').reverse()[0]

    if (policy != null) {
      if (ipfs.cat(policy) != null) {
        ipfs.mapJSON(policy, 'processPolicy', Value.fromString(court.id))
      } else {
        log.warning('Unable to retrieve {} file ({})', [policy, event.params._policy])
      }
    }
  }
}

export function getOrCreateCourt(courtId: BigInt): Court {
  let court = Court.load(courtId.toString())

  if (court == null) {
    let courtData = getKlerosContract().try_courts(courtId)

    if (!courtData.reverted) {
      court = new Court(courtId.toString())
      court.parent = courtData.value.value0.toString()
      court.hiddenVotes = courtData.value.value1
      court.minStake = toDecimal(courtData.value.value2)
      court.alpha = courtData.value.value3
      court.feeForJuror = toDecimal(courtData.value.value4)
      court.jurorsForCourtJump = toDecimal(courtData.value.value5)

      court.save()
    }
  }

  return court as Court
}

function generateCourtId(): string {
  let summary = getSummaryEntity()
  summary.courtCount = summary.courtCount.plus(BigInt.fromI32(1))

  summary.save()

  return summary.courtCount.toString()
}

function processPolicy(value: JSONValue, courtId: Value): void {
  let court = getOrCreateCourt(courtId.toBigInt())
  let data = value.toObject()

  if (court != null && data != null) {
    let name = data.get('name')
    let description = data.get('description')
    let summary = data.get('summary')

    if (name != null) {
      court.name = name.toString()
    }

    if (description != null) {
      court.description = description.toString()
    }

    if (summary != null) {
      court.summary = summary.toString()
    }
  }
}
