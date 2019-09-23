import { BigInt } from '@graphprotocol/graph-ts'

import { Kleros } from '../../generated/schema'

const KLEROS_SUMMARY_ID = '1'

export function getSummaryEntity(): Kleros {
  let summary = Kleros.load(KLEROS_SUMMARY_ID)

  if (summary == null) {
    summary = new Kleros(KLEROS_SUMMARY_ID)
    summary.courtCount = BigInt.fromI32(0)
  }

  return summary as Kleros
}
