const emailRegex = /(^|\s)[\w.+-]+@[\w-]+\.[\w.-]+(\s|$)/i;

export function maskValue(nameOrId: string | undefined, value: string | undefined) {
  if (!value) return value;
  const key = (nameOrId || "").toLowerCase();
  if (key.includes("password") || key.includes("secret") || key.includes("token")) return "••••";
  if (emailRegex.test(value)) return "••••@••••";
  return value;
}

export function safeSelector(el: Element) {
  const id = (el as HTMLElement).id;
  const testid = (el as HTMLElement).getAttribute("data-testid");
  if (testid) return `[data-testid="${testid}"]`;
  if (id) return `#${CSS.escape(id)}`;
  const cls = (el as HTMLElement).className?.toString().split(" ").filter(Boolean).slice(0,2).map(c=>'.'+CSS.escape(c)).join("") || "";
  return `${el.tagName.toLowerCase()}${cls}`;
}
