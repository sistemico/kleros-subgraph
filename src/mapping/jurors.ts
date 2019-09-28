import { Draw, StakeSet, TokenAndETHShift } from '../../generated/Kleros/KlerosLiquid'

import { Dispute, Juror, Stake, Vote } from '../../generated/schema'

import { getSummaryEntity } from './core'
import { getOrRegisterCourt } from './courts'
import { toDecimal } from './token'
import { ONE } from './utils'

export function handleDraw(event: Draw): void {
  let disputeId = event.params._disputeID.toString()
  let jurorAddress = event.params._address.toHexString()
  let round = event.params._appeal.toString()
  let voteId = event.params._voteID.toString()

  let dispute = Dispute.load(disputeId)
  let juror = Juror.load(jurorAddress)

  if (dispute != null && juror != null) {
    let vote = new Vote(disputeId + '-' + round + '-' + voteId)
    vote.dispute = dispute.id
    vote.juror = juror.id
    vote.round = event.params._appeal
    vote.voteId = event.params._voteID

    vote.created = event.block.timestamp
    vote.createdAtBlock = event.block.number
    vote.createdAtTransaction = event.transaction.hash

    dispute.voteCount = dispute.voteCount.plus(ONE)

    let summary = getSummaryEntity()
    summary.voteCount = summary.voteCount.plus(ONE)

    dispute.save()
    vote.save()
    summary.save()
  }
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
