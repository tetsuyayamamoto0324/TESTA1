// 超小さなイベントバス（シングルトン）

let handler: null | (() => void | Promise<void>) = null;

/** Today など発行側が登録する */
export function setRefetchHandler(fn: typeof handler) {
  handler = fn;
}

/** HeaderBar など受け側から叩く。実行できたら true を返す */
export async function triggerRefetch(): Promise<boolean> {
  const fn = handler;
  if (!fn) return false;
  await fn();
  return true;
}
