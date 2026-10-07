type Props = { className?: string };

export function Arrow({ className }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className ?? "size-4"}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export function Peak({ className }: Props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className ?? "size-7"}>
      <circle cx="22" cy="9" r="4" fill="var(--color-saffron)" />
      <path d="M2 27 12 9l6 10 3-4 9 12H2Z" fill="currentColor" />
      <path d="m12 9-3 5.4 3-1.6 2.6 1.9L12 9Z" fill="var(--color-night)" opacity=".55" />
    </svg>
  );
}

export function WhatsApp({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className ?? "size-5"}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.300-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200Zm4.500-6.100c-.2-.1-1.500-.700-1.700-.800-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.700 6.700 0 0 1-3.300-2.900c-.3-.4.2-.4.700-1.300.1-.2 0-.3 0-.5l-.800-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.200.300-.900.900-.900 2.200s.900 2.500 1.100 2.700c.1.200 1.900 2.900 4.600 4 1.700.700 2.400.800 3.200.600.500-.1 1.500-.600 1.700-1.200.200-.600.200-1.100.200-1.200-.100-.100-.300-.200-.500-.300Z" />
    </svg>
  );
}

export function Instagram({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden className={className ?? "size-5"}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.800" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Facebook({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className ?? "size-5"}>
      <path d="M13.500 21v-7.500h2.500l.400-3h-2.900V8.600c0-.900.300-1.500 1.500-1.500h1.500V4.400c-.300 0-1.200-.100-2.200-.100-2.200 0-3.700 1.300-3.700 3.800v2.400H8v3h2.600V21h2.900Z" />
    </svg>
  );
}

export function Star({ className }: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={className ?? "size-4"}>
      <path d="m10 1.800 2.500 5.300 5.700.700-4.200 4 1.100 5.700L10 14.700l-5.100 2.800L6 11.800l-4.200-4 5.700-.700L10 1.800Z" />
    </svg>
  );
}
