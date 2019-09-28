import { Draw, StakeSet, TokenAndETHShift } from '../../generated/Kleros/KlerosLiquid'

import { Dispute, Juror, Reward, Stake, Vote } from '../../generated/schema'

import { getSummaryEntity } from './core'
import { getOrRegisterCourt } from './courts'
import { toDecimal } from './token'
import { ONE, uid, ZERO_DECIMAL } from './utils'

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

  let stake = new Stake(court.id + '-' + juror.id + '-' + uid(event))
  stake.court = court.id
  stake.juror = juror.id
  stake.amount = toDecimal(event.params._stake)

  stake.timestamp = event.block.timestamp
  stake.block = event.block.number
  stake.transaction = event.transaction.hash

  let summary = getSummaryEntity()
  summary.totalStaked = summary.totalStaked.plus(stake.amount)

  juror.save()
  stake.save()
  summary.save()
}

export function handleTokenAndETHShift(event: TokenAndETHShift): void {
  let disputeId = event.params._disputeID.toString()
  let jurorAddress = event.params._address.toHexString()

  let reward = new Reward(disputeId + '-' + jurorAddress + '-' + uid(event))
  reward.dispute = disputeId
  reward.juror = jurorAddress
  reward.ethAmount = toDecimal(event.params._ETHAmount)
  reward.tokenAmount = toDecimal(event.params._tokenAmount)

  reward.timestamp = event.block.timestamp
  reward.block = event.block.number
  reward.transaction = event.transaction.hash

  let summary = getSummaryEntity()

  if (reward.ethAmount > ZERO_DECIMAL) {
    summary.totalEthRewarded = summary.totalEthRewarded.plus(reward.ethAmount)
  } else if (reward.ethAmount < ZERO_DECIMAL) {
    summary.totalEthPunished = summary.totalEthPunished.plus(reward.ethAmount)
  }

  if (reward.tokenAmount > ZERO_DECIMAL) {
    summary.totalTokenRewarded = summary.totalTokenRewarded.plus(reward.tokenAmount)
  } else if (reward.tokenAmount < ZERO_DECIMAL) {
    summary.totalTokenPunished = summary.totalTokenPunished.plus(reward.tokenAmount)
  }

  reward.save()
  summary.save()
}
