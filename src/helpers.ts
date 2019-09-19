export function toPeriod(period: i32): string {
  switch (period) {
    default:
    case 0:
      return 'EVIDENCE'
    case 1:
      return 'COMMIT'
    case 2:
      return 'VOTE'
    case 3:
      return 'APPEAL'
    case 4:
      return 'EXECUTION'
  }
}
