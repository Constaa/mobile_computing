
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

                                list.Add(calendarEvent);
                            }
                            mysqlconnection.Close();
                        }
                    }
                }
                catch (MySqlException ex)
                {
                    //TODO: Add error handling
                }
                catch (Exception ex)
                {
                    //TODO: Add error handling
                }
                finally
                {

                }

                //Samples for testing
                //TODO: Get events from MariaDB
                //List<CalendarEvent> list = [
                //    new CalendarEvent() {
                //        Id = 1,
                //        AllDay = false,
                //        Start = DateTime.Now,
                //        End = DateTime.Now.AddHours(3),
                //        Title = "First test event",
                //        Description = "Beschreibung 1"
                //    }, new CalendarEvent() {
                //        Id = 2,
                //        AllDay = true,
                //        Start = DateTime.Now.AddDays(4),
                //        End = DateTime.Now.AddDays(4),
                //        Title = "Second Test event",
                //        Description = "Beschreibung 2"
                //    },
                //    new CalendarEvent() {
                //        Id = 3,
                //        AllDay = false,
                //        Start = DateTime.Now.AddDays(4),
                //        End = DateTime.Now.AddDays(6),
                //        Title = "Third Test event",
                //        Description = "Beschreibung 3"
                //    }
                //];

                return TypedResults.Ok(list);
            })
            .WithName("Get events")
            .WithTags("Event")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get calendar events",
                Description = "Function for getting event data from the database."
            })
            .Produces<List<CalendarEvent>>(StatusCodes.Status200OK);

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
            .Produces<List<CalendarEvent>>(StatusCodes.Status200OK);

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

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            app.MapGet("api/mariaDBExample", (HttpContext httpContext) =>
            {
                //Used to not actually execute the function, as the underlying MariaDB does not exist.
                return StatusCodes.Status501NotImplemented;

                //Demo
                List<string> list = new();

                try
                {
                    using (var mysqlconnection = new MySqlConnection("CONNECTION_STRING"))
                    {
                        mysqlconnection.Open();
                        using (MySqlCommand cmd = mysqlconnection.CreateCommand())
                        {
                            cmd.CommandType = CommandType.Text;
                            cmd.CommandTimeout = 300;
                            cmd.CommandText = "Select * From tokens Where user=@user";
                            cmd.Parameters.AddWithValue("@user", "USER_NAME");

                            MySqlDataReader reader = cmd.ExecuteReader();

                            while (reader.Read())
                            {
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    {
                                        if (i < 2)
                                        {
                                            list.Add(reader.GetString(i));
                                        }
                                        else
                                        {
                                            list.Add(reader.GetDateTime(i).ToString());
                                        }
                                    }
                                }
                            }
                            reader.Close();
                            mysqlconnection.Close();
                        }
                    }
                }
                catch (MySqlException ex)
                {
                    //return false;
                }
                catch (Exception ex)
                {
                    //return false;
                }
                finally
                {

                }

            })
            .WithName("MariaDB Example")
            .WithTags("System")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Demonstration of a MariaDB access call",
                Description = "Function that demonstrates how data from MariaDB can be accessed."
            })
            .Produces<bool>(StatusCodes.Status200OK);
            //.RequireAuthorization();

            #endregion

            app.Run();
        }
    }
}
