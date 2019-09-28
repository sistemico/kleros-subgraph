import { BigDecimal, BigInt, EthereumEvent } from '@graphprotocol/graph-ts'

export let ONE = BigInt.fromI32(1)
export let ZERO = BigInt.fromI32(0)
export let ZERO_DECIMAL = BigDecimal.fromString('0')

export function uid(event: EthereumEvent): string {
  return event.transaction.hash.toString() + '-' + event.logIndex.toString()
}
