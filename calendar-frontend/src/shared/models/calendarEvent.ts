export interface CalendarEvent {
    id: number,
    allDay: boolean,
    start?: Date,
    end?: Date,
    daysOfWeek: number[],
    title: string,
    description: string,
    minParticipants: number,
    maxParticipants: number,
    className: string,
    startRecur?: Date,
    endRecur?: Date,
    startTime?: string,
    endTime?: string
}