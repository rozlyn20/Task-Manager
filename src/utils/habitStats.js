/**
 * Date/streak math for the habit tracker.
 *
 * The tricky part of any habit tracker is timezones: the backend stores each
 * logged day as a UTC-midnight Date, but the user thinks in their own local
 * "today". To keep that round-trip stable:
 *   - `localDateKey` turns a JS Date into a "YYYY-MM-DD" string using LOCAL
 *     getters — this is what we send to the server and what we use to figure
 *     out what "today" means for the user.
 *   - `utcDateKeyFromLog` turns a Date coming back from Mongo into the same
 *     "YYYY-MM-DD" shape using UTC getters — since the server stored it as
 *     UTC midnight of the exact string we sent, this recovers the identical
 *     key regardless of what timezone the browser happens to be in.
 */

const pad = (n) => String(n).padStart(2, "0");

export const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const utcDateKeyFromLog = (log) => {
  const d = new Date(log);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

export const isLoggedOn = (habit, dateKey) =>
  (habit.logs || []).some((log) => utcDateKeyFromLog(log) === dateKey);

// Daily habits are scheduled every day. Weekly habits only on their chosen weekdays.
export const isScheduledDay = (habit, date) => {
  if (habit.frequency === "Weekly") {
    return Array.isArray(habit.daysOfWeek) && habit.daysOfWeek.includes(date.getDay());
  }
  return true;
};

/**
 * Current streak: walk backward from today counting consecutive scheduled
 * days that were logged. If today is scheduled but not logged yet, that's
 * not a break — the day just isn't finished. Longest streak: walk forward
 * from the habit's start, tracking the longest run of logged scheduled days.
 */
export const computeStreaks = (habit) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = localDateKey(today);

  // ---- current streak ----
  let current = 0;
  const cursor = new Date(today);
  const MAX_LOOKBACK = 1000; // safety cap, not a real limit on streak length

  for (let i = 0; i < MAX_LOOKBACK; i++) {
    const key = localDateKey(cursor);

    if (isScheduledDay(habit, cursor)) {
      if (isLoggedOn(habit, key)) {
        current += 1;
      } else if (key === todayKey) {
        // Today isn't done yet — don't break the streak, just don't count it.
      } else {
        break;
      }
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  // ---- longest streak ----
  const logTimes = (habit.logs || []).map((l) => new Date(l).getTime());
  const earliestLogTime = logTimes.length ? Math.min(...logTimes) : Date.now();
  const createdAtTime = habit.createdAt ? new Date(habit.createdAt).getTime() : earliestLogTime;

  const start = new Date(Math.min(createdAtTime, earliestLogTime));
  start.setHours(0, 0, 0, 0);

  let longest = 0;
  let run = 0;
  const walker = new Date(start);
  const MAX_DAYS = 3660; // ~10 years, safety cap

  for (let i = 0; i < MAX_DAYS && walker <= today; i++) {
    if (isScheduledDay(habit, walker)) {
      const key = localDateKey(walker);
      if (isLoggedOn(habit, key)) {
        run += 1;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
    }
    walker.setDate(walker.getDate() + 1);
  }

  return { current, longest };
};

/**
 * Builds a GitHub-style contribution grid: an array of weeks (columns),
 * each an array of 7 day-cells (Sun..Sat), ending on the current week.
 */
export const buildHeatmapWeeks = (habit, weeks = 12) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfGrid = new Date(today);
  endOfGrid.setDate(endOfGrid.getDate() + (6 - endOfGrid.getDay())); // this week's Saturday

  const totalDays = weeks * 7;
  const startOfGrid = new Date(endOfGrid);
  startOfGrid.setDate(startOfGrid.getDate() - totalDays + 1); // lands on a Sunday

  const days = [];
  const cursor = new Date(startOfGrid);
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(cursor);
    const key = localDateKey(date);
    days.push({
      date,
      key,
      scheduled: isScheduledDay(habit, date),
      logged: isLoggedOn(habit, key),
      isFuture: date > today,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const columns = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }
  return columns;
};

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
