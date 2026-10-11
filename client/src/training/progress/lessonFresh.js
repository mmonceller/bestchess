/*
 * Saved answers are one per step. If a lesson grew after the player finished it,
 * the old list no longer lines up and they need to play the new version.
 *
 * Bump `lesson.rev` (and `bonusRev` for bonus-only edits) when you add steps.
 * Completions also store the step count so later length changes are picked up
 * even when the old run never saved answers.
 */
function savedCount(list, fallback) {
  if (Array.isArray(list)) return list.length;
  if (Number.isFinite(fallback)) return fallback;
  return null;
}

export function lessonUpdate(record, lesson) {
  if (!record || !lesson) return { stale: false, steps: false, bonus: false };
  const stepN = savedCount(record.answers, record.stepsAtFinish);
  const bonusN = savedCount(record.bonusAnswers, record.bonusAtFinish);
  const steps = stepN !== null && stepN !== lesson.steps.length
    || (lesson.rev || 0) > (record.lessonRev || 0);
  const bonus = bonusN !== null && bonusN !== (lesson.bonus?.length || 0)
    || (lesson.bonusRev || 0) > (record.bonusRev || 0);
  return { stale: steps || bonus, steps, bonus };
}
