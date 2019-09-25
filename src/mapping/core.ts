import { Address, BigInt } from '@graphprotocol/graph-ts'

import { KlerosLiquid } from '../../generated/Kleros/KlerosLiquid'

import { Kleros } from '../../generated/schema'

import { KLEROS_LIQUID_ADDRESS, KLEROS_SUMMARY_ID } from '../constants'

export function getKlerosContract(): KlerosLiquid {
  return KlerosLiquid.bind(Address.fromString(KLEROS_LIQUID_ADDRESS))
}

export function getSummaryEntity(): Kleros {
  let summary = Kleros.load(KLEROS_SUMMARY_ID)

  if (summary == null) {
    summary = new Kleros(KLEROS_SUMMARY_ID)
    summary.courtCount = BigInt.fromI32(0)
  }

  return summary as Kleros
}
