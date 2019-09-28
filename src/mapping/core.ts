import { Address } from '@graphprotocol/graph-ts'

import { KlerosLiquid } from '../../generated/Kleros/KlerosLiquid'

import { KlerosSummary } from '../../generated/schema'

import { ZERO, ZERO_DECIMAL } from './utils'

// Contracts
const KLEROS_LIQUID_ADDRESS = '0x988b3a538b618c7a603e1c11ab82cd16dbe28069'

// Summary entities
const KLEROS_SUMMARY_ID = '0'

export function getKlerosContract(): KlerosLiquid {
  return KlerosLiquid.bind(Address.fromString(KLEROS_LIQUID_ADDRESS))
}

export function getSummaryEntity(): KlerosSummary {
  let summary = KlerosSummary.load(KLEROS_SUMMARY_ID)

  if (summary == null) {
    summary = new KlerosSummary(KLEROS_SUMMARY_ID)
    summary.courtCount = ZERO
    summary.disputeCount = ZERO
    summary.voteCount = ZERO
    summary.totalStaked = ZERO_DECIMAL
    summary.totalEthPunished = ZERO_DECIMAL
    summary.totalEthRewarded = ZERO_DECIMAL
    summary.totalTokenPunished = ZERO_DECIMAL
    summary.totalTokenRewarded = ZERO_DECIMAL
  }

  return summary as KlerosSummary
}
