// Small, local replacements for Starlight internals the overrides used to import
// from `node_modules/@astrojs/starlight/...`. Starlight 0.42+ only ships its
// compiled `dist/` folder and its package exports do not expose `utils/navigation`
// or `constants`, so those deep imports no longer resolve.

/** Anchor id used by Starlight for the page title heading. */
export const PAGE_TITLE_ID = "_top";

/**
 * Turn the nested tree structure of a Starlight sidebar into a flat list of all
 * links. Mirrors Starlight's internal `flattenSidebar` helper.
 */
export function flattenSidebar<T extends SidebarNode>(sidebar: T[]): T[] {
  return sidebar.flatMap((entry) =>
    entry.type === "group" && entry.entries
      ? flattenSidebar(entry.entries as T[])
      : [entry],
  );
}

interface SidebarNode {
  type: string;
  entries?: SidebarNode[];
}
