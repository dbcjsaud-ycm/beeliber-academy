// Nano ID generator (crypto-safe, no dependency)
export function nanoid(size = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const arr = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(arr, (b) => chars[b % chars.length]).join('');
}

export function cn(...classes: unknown[]) {
  return classes
    .flatMap((item) => {
      if (!item) return [];
      if (typeof item === 'string') return [item];
      if (Array.isArray(item)) return item as unknown[];
      // Base UI 일부 컴포넌트는 className에 state 콜백 타입을 전달하므로 무시 처리
      if (typeof item === 'function') return [];
      return [String(item)];
    })
    .filter(Boolean)
    .join(' ');
}
