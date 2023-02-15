export interface ICronTimesFormat {
  seconds: string;
  minutes: string;
  hours: string;
  specificHours: string;
  hoursEveryDays: string;
  dayOfWeeks: string;
  dayOfMonth: string;
}

export enum TimeUnits {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  specificHours = 'specificHours',
  hoursEveryDays = 'hoursEveryDays',
  dayOfWeeks = 'dayOfWeeks',
  dayOfMonth = 'dayOfMonth',
}

export interface ITimes {
  timeUnit : TimeUnits
  timeInterval : number
}

export interface ICronJob extends ITimes {
  cronId: number;
}
