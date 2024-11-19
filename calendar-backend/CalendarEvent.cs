namespace calendar_backend
{
    public class CalendarEvent
    {
        public int? Id { get; set; }
        public required bool AllDay { get; set; }
        public required DateTime Start { get; set; }
        public required DateTime End { get; set; }
        public List<int>? DaysOfWeek { get; set; }
        public required string Title { get; set; }
    }
}
