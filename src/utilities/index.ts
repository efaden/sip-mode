// Convert a CSS in JS to string
export const getCSSString = (cssInJs: Record<string, string>): string => {
    return Object.entries(cssInJs)
        .map((entry: [string, string]): string => {
            const [decl, value] = entry;
            return `${decl}:${value}`;
        })
        .join(';') + ';';
};

export const querySelector = (selector: string, root = document) => {
  const nodes = [...root.querySelectorAll(selector)];
  const shadowNodes = [...root.querySelectorAll(':empty')].filter(node => node.shadowRoot);

  shadowNodes.map((shNode: any) => {
      nodes.push(...querySelector(selector, shNode.shadowRoot));
  })

  return nodes;
}