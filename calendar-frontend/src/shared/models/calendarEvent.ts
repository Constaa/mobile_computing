export interface CalendarEvent {
    id: number;
    allDay: boolean;
    start: Date;
    end: Date;
    daysOfWeek: number[],
    title: string;
}