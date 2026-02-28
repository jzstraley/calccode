const modules = import.meta.glob( "./*.js", { eager: true } );

export const CALCS = Object.values(modules)
  .map((m) => m.default)
  .filter((x) => x && x.id && x.name && x.compute)
  .sort((a, b) => a.name.localeCompare(b.name));