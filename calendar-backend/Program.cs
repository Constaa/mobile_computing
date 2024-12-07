
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;

namespace calendar_backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var _configuration = builder.Configuration;
            var _connectionString = _configuration.GetConnectionString("base");

            // Add CORS
            builder.Services.AddCors(options =>
                options.AddPolicy(
                  name: "CorsPolicy",
                  builder =>
                  {
                      builder.AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials()
                      //Allow origin of Angular frontend in local testing
                      .WithOrigins("http://localhost:4200");
                  })
            );

            // Add services to the container.
            builder.Services.AddAuthorization();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Https redirection is used conditionally to fix access issues in local test environments
            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            #region routes
            app.MapGet("api/getEvents", (HttpContext httpContext) =>
            {
                List<CalendarEvent> list = [];

                try
                {
                    using (var mysqlconnection = new MySqlConnection(_connectionString))
                    {
                        mysqlconnection.Open();
                        using (MySqlCommand cmd = mysqlconnection.CreateCommand())
                        {
                            cmd.CommandType = CommandType.Text;
                            cmd.CommandTimeout = 300;
                            cmd.CommandText = "Select * From calendarEvents Where _year=@year";
                            cmd.Parameters.AddWithValue("@year", DateTime.Now.Year);

                            //Convert received data into a usable format.
                            MySqlDataAdapter adapter = new(cmd);
                            DataTable data = new();
                            adapter.Fill(data);

                            //Iterate over all received rows and create the return list.
                            foreach (DataRow row in data.Rows)
                            {
                                CalendarEvent calendarEvent = new()
                                {
                                    Id = Convert.ToInt32(row["id"].ToString()),
                                    AllDay = Convert.ToBoolean(row["allDay"]),
                                    Start = DateTime.Parse(row["start"].ToString() + "Z"),
                                    End = DateTime.Parse(row["end"].ToString() + "Z"),
                                    //When daysOfWeek is unset => set it to null. Setting to an empty list results in events not being rendered in frontend
                                    DaysOfWeek = row["daysOfWeek"].ToString() == "" ? null : row["daysOfWeek"].ToString()!.Split(',').Select(int.Parse).ToList(),
                                    Title = row["title"].ToString()!,
                                    Description = row["description"].ToString()!,
                                    MinParticipants = Convert.ToInt32(row["minParticipants"].ToString()) == null ? 0 : Convert.ToInt32(row["minParticipants"].ToString()),
                                    MaxParticipants = Convert.ToInt32(row["maxParticipants"].ToString()) == null ? 0 : Convert.ToInt32(row["minParticipants"].ToString()),
                                    ClassName = row["className"].ToString()
                                };

                                if (!String.IsNullOrWhiteSpace(row["startRecur"].ToString()))
                                {
                                    calendarEvent.StartRecur = DateTime.Parse(row["startRecur"].ToString() + "Z");
                                }

                                if (!String.IsNullOrWhiteSpace(row["endRecur"].ToString()))
                                {
                                    calendarEvent.EndRecur = DateTime.Parse(row["endRecur"].ToString() + "Z");
                                }

                                if (!String.IsNullOrWhiteSpace(row["startTime"].ToString()))
                                {
                                    var test = TimeSpan.Parse(row["endTime"].ToString());
                                    calendarEvent.StartTime = TimeSpan.Parse(row["startTime"].ToString()).ToString();
                                }

                                if (!String.IsNullOrWhiteSpace(row["endTime"].ToString()))
                                {
                                    var test = TimeSpan.Parse(row["endTime"].ToString());
                                    calendarEvent.EndTime = TimeSpan.Parse(row["endTime"].ToString()).ToString();
                                }

                                list.Add(calendarEvent);
                            }
                            mysqlconnection.Close();
                        }
                    }
                }
                catch (MySqlException ex)
                {
                    return Results.BadRequest();
                }
                catch (Exception ex)
                {
                    return Results.BadRequest();
                }
                finally
                {

                }

                return TypedResults.Ok(list);
            })
            .WithName("Get events")
            .WithTags("Event")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get calendar events",
                Description = "Function for getting event data from the database."
            })
            .Produces<List<CalendarEvent>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            app.MapPost("api/addEvent", (HttpContext httpContext, [FromBody] CalendarEvent calendarEvent) =>
            {
                try
                {
                    using (var mysqlconnection = new MySqlConnection(_connectionString))
                    {
                        mysqlconnection.Open();
                        using (MySqlCommand cmd = mysqlconnection.CreateCommand())
                        {
                            cmd.CommandType = CommandType.Text;
                            cmd.CommandTimeout = 300;

                            if (calendarEvent.StartRecur != null)
                            {
                                cmd.CommandText = "INSERT INTO calendarEvents (allDay, start, end, daysOfWeek, title, description, className, minParticipants, maxParticipants, startRecur, endRecur, startTime, endTime) VALUES (@allDay, @start, @end, @daysOfWeek, @title, @description, @className, @minParticipants, @maxParticipants, @startRecur, @endRecur, @startTime, @endTime)";
                                cmd.Parameters.AddWithValue("@allDay", calendarEvent.AllDay);
                                cmd.Parameters.AddWithValue("@start", calendarEvent.Start);
                                cmd.Parameters.AddWithValue("@end", calendarEvent.End);
                                cmd.Parameters.AddWithValue("@daysOfWeek", String.Join(",", calendarEvent.DaysOfWeek));
                                cmd.Parameters.AddWithValue("@title", calendarEvent.Title);
                                cmd.Parameters.AddWithValue("@description", calendarEvent.Description);
                                cmd.Parameters.AddWithValue("@className", calendarEvent.ClassName);
                                cmd.Parameters.AddWithValue("@minParticipants", calendarEvent.MinParticipants);
                                cmd.Parameters.AddWithValue("@maxParticipants", calendarEvent.MaxParticipants);
                                cmd.Parameters.AddWithValue("@startRecur", calendarEvent.StartRecur);
                                cmd.Parameters.AddWithValue("@endRecur", calendarEvent.EndRecur);
                                cmd.Parameters.AddWithValue("@startTime", calendarEvent.StartRecur.Value.TimeOfDay.ToString());
                                cmd.Parameters.AddWithValue("@endTime", calendarEvent.EndRecur.Value.TimeOfDay.ToString());
                            }
                            else
                            {

                                cmd.CommandText = "INSERT INTO calendarEvents (allDay, start, end, daysOfWeek, title, description, className, minParticipants, maxParticipants) VALUES (@allDay, @start, @end, @daysOfWeek, @title, @description, @className, @minParticipants, @maxParticipants)";
                                cmd.Parameters.AddWithValue("@allDay", calendarEvent.AllDay);
                                cmd.Parameters.AddWithValue("@start", calendarEvent.Start);
                                cmd.Parameters.AddWithValue("@end", calendarEvent.End);
                                cmd.Parameters.AddWithValue("@daysOfWeek", String.Join(",", calendarEvent.DaysOfWeek));
                                cmd.Parameters.AddWithValue("@title", calendarEvent.Title);
                                cmd.Parameters.AddWithValue("@description", calendarEvent.Description);
                                cmd.Parameters.AddWithValue("@className", calendarEvent.ClassName);
                                cmd.Parameters.AddWithValue("@minParticipants", calendarEvent.MinParticipants);
                                cmd.Parameters.AddWithValue("@maxParticipants", calendarEvent.MaxParticipants);
                            }

                            var rowsAffected = cmd.ExecuteNonQuery();

                            if (rowsAffected != 1)
                            {
                                cmd.Dispose();
                                return Results.BadRequest();
                            }
                            else
                            {
                                cmd.Dispose();
                            }

                            mysqlconnection.Close();

                            return TypedResults.Ok();
                        }
                    }
                }
                catch (MySqlException ex)
                {
                    return Results.BadRequest();
                }
                catch (Exception ex)
                {
                    return Results.BadRequest();
                }
                finally
                {

                }
            })
            .WithName("Add event")
            .WithTags("Event")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Add calendar event",
                Description = "Function for adding an event to the database."
            })
            .Produces<List<CalendarEvent>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            app.MapDelete("api/deleteEvent", (HttpContext httpContext, [FromQuery] int id) =>
            {
                try
                {
                    using (var mysqlconnection = new MySqlConnection(_connectionString))
                    {
                        mysqlconnection.Open();
                        using (MySqlCommand cmd = mysqlconnection.CreateCommand())
                        {
                            cmd.CommandType = CommandType.Text;
                            cmd.CommandTimeout = 300;
                            cmd.CommandText = "DELETE FROM calendarEvents WHERE id = @id";
                            cmd.Parameters.AddWithValue("@id", id);

                            var rowsAffected = cmd.ExecuteNonQuery();

                            if (rowsAffected != 1)
                            {
                                cmd.Dispose();
                                return Results.BadRequest();
                            }
                            else
                            {
                                cmd.Dispose();
                            }

                            mysqlconnection.Close();

                            return TypedResults.Ok();
                        }
                    }
                }
                catch (MySqlException ex)
                {
                    return Results.BadRequest();
                }
                catch (Exception ex)
                {
                    return Results.BadRequest();
                }
                finally
                {

                }
            })
            .WithName("Delete event")
            .WithTags("Event")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Delete calendar event",
                Description = "Function for deleting an event to the database via its ID."
            })
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            app.MapGet("api/test", (HttpContext httpContext) =>
            {
                return TypedResults.Ok(true);
            })
            .WithName("Test")
            .WithTags("System")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Test for checking access",
                Description = "Function that simply returns 'true' when the request succeeds. Used for testing initial API access."
            })
            .Produces<bool>(StatusCodes.Status200OK);
            //.RequireAuthorization();

            #endregion

            app.Run();
        }
    }
}
