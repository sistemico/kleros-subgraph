import { Draw, StakeSet, TokenAndETHShift } from '../../generated/Kleros/KlerosLiquid'

import { Juror, Stake } from '../../generated/schema'

import { getSummaryEntity } from './core'
import { getOrRegisterCourt } from './courts'
import { toDecimal } from './token'

export function handleDraw(event: Draw): void {
  /*
  let disputeId = event.params._disputeID.toString()
  let jurorAddress = event.params._address.toHexString()
  let roundIndex = event.params._appeal.toString()
  let voteId = event.params._voteID.toString()

  let juror = new Juror(jurorAddress)
  juror.address = event.params._address

  juror.save()
  */
}

export function handleStakeSet(event: StakeSet): void {
  let court = getOrRegisterCourt(event.params._subcourtID)

  let juror = new Juror(event.params._address.toHexString())
  juror.address = event.params._address
  juror.stakedTokens = toDecimal(event.params._newTotalStake)

  juror.lastStake = event.block.timestamp
  juror.lastStakeBlock = event.block.number
  juror.lastStakeTransaction = event.transaction.hash

  let stake = new Stake(court.id + '-' + juror.id + '-' + event.block.timestamp.toString())
  stake.court = court.id
  stake.juror = juror.id
  stake.amount = toDecimal(event.params._stake)

  stake.timestamp = event.block.timestamp
  stake.block = event.block.number
  stake.transaction = event.transaction.hash

  let summary = getSummaryEntity()
  summary.totalStaked = summary.totalStaked.plus(stake.amount)

  // Persist all entities
  juror.save()
  stake.save()
  summary.save()
}

export function handleTokenAndETHShift(event: TokenAndETHShift): void {
  // TODO
}
