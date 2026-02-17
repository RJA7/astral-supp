export type Component = object;

export type ComponentClass = new (id: hash, fragment: hash) => Component;
