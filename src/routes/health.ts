import { formatUptime } from 'src/lib/utils/time'

export function get() {
  return {
    ok: true,
    uptime: formatUptime(process.uptime()),
  }
}
