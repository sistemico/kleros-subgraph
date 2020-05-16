import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'

export let ONE = BigInt.fromI32(1)
export let ZERO = BigInt.fromI32(0)
export let ZERO_DECIMAL = BigDecimal.fromString('0')

export function uid(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + '-' + event.logIndex.toString()
}
