namespace calendar_backend {
    public class CalendarEvent {
        public int? Id { get; set; }
        public required bool AllDay { get; set; }
        public required DateTime Start { get; set; }
        public required DateTime End { get; set; }
        public List<int>? DaysOfWeek { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public int? MinParticipants { get; set; }
        public int? MaxParticipants { get; set; }
        public string ClassName { get; set; }

        public DateTime? StartRecur { get; set; }
        public DateTime? EndRecur { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
    }
}
