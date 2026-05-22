/**
 * Returns `true` if the value is a valid IPv4 address.
 *
 * @param value - The string to check
 * @returns `true` if valid IPv4, `false` otherwise
 *
 * @example
 * isIPv4('192.168.1.1')   // true
 * isIPv4('255.255.255.255') // true
 * isIPv4('256.0.0.1')     // false — out of range
 * isIPv4('192.168.1')     // false — missing octet
 */
export function isIPv4(value: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(value) &&
    value.split('.').every(n => parseInt(n) <= 255)
}

/**
 * Returns `true` if the value is a valid IPv6 address.
 *
 * @param value - The string to check
 * @returns `true` if valid IPv6, `false` otherwise
 *
 * @example
 * isIPv6('::1')                              // true
 * isIPv6('2001:0db8:85a3::8a2e:0370:7334')  // true
 * isIPv6('not-an-ip')                        // false
 */
export function isIPv6(value: string): boolean {
  return /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::)$/.test(value) ||
    /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(value)
}

/**
 * Returns `true` if the value is a valid IPv4 or IPv6 address.
 *
 * @param value - The string to check
 * @returns `true` if valid IP address, `false` otherwise
 *
 * @example
 * isIP('192.168.1.1')  // true — IPv4
 * isIP('::1')          // true — IPv6
 * isIP('999.0.0.1')   // false
 */
export function isIP(value: string): boolean {
  return isIPv4(value) || isIPv6(value)
}