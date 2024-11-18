namespace calendar_backend
{
    public class CalendarEvent
    {
        public int Id { get; set; }
        public bool AllDay { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public List<int> DaysOfWeek { get; set; }
        public string Title { get; set; }
    }
}
