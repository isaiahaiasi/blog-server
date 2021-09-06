import debug from "debug";

export default function createLogger(logName: string): debug.Debugger {
  return debug(`app:${logName}`);
}
