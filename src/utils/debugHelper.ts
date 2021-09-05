import debug from "debug";

export default function createLog(logName: string): debug.Debugger {
  return debug(`app:${logName}`);
}
