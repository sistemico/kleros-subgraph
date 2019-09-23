import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { Transfer as TransferEvent } from '../../generated/Pinakion/Pinakion'

import { PinakionTransfer } from '../../generated/schema'

const PINAKION_DECIMALS: u8 = 18

export function handlePinakionTransfer(event: TransferEvent): void {
  let transferId = event.transaction.hash.toHexString() + '-' + event.logIndex.toString()

  let transfer = new PinakionTransfer(transferId)
  transfer.amount = toDecimal(event.params._amount)
  transfer.from = event.params._from
  transfer.to = event.params._to

  transfer.block = event.block.number
  transfer.timestamp = event.block.timestamp
  transfer.transaction = event.transaction.hash

  transfer.save()
}

export function toDecimal(value: BigInt, decimals: u8 = PINAKION_DECIMALS): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(decimals)
    .toBigDecimal()

  return value.divDecimal(precision)
}
