// Platform identity is managed by DukaDesk, not copied into business templates.
export function isPlatformProfileScreen(id, name) {
  return [id, name].some(value => /^(profile|my[ _-]?profile|account|my[ _-]?account|profile[ &_-]+settings)$/i.test(String(value || '').trim()));
}
