
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Data;

namespace calendar_backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
                options.AddPolicy(
                  name: "CorsPolicy",
                  builder =>
                  {
                      builder.AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials()
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

            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseCors("CorsPolicy");

            app.UseAuthorization();


            #region routes
            app.MapGet("api/getEvents", (HttpContext httpContext) =>
            {
                //Samples for testing
                //TODO: Get events from MariaDB
                List<CalendarEvent> events = [
                    new CalendarEvent() {
                        Id = 1,
                        AllDay = false,
                        Start = DateTime.Now,
                        End = DateTime.Now.AddHours(3),
                        Title = "First test event"
                    }, new CalendarEvent() {
                        Id = 2,
                        AllDay = true,
                        Start = DateTime.Now.AddDays(4),
                        End = DateTime.Now.AddDays(4),
                        Title = "Second Test event"
                    },
                    new CalendarEvent() {
                        Id = 3,
                        AllDay = false,
                        Start = DateTime.Now.AddDays(4),
                        End = DateTime.Now.AddDays(6),
                        Title = "Third Test event"
                    }
                ];


                return TypedResults.Ok(events);
            })
            .WithName("Get events")
            .WithTags("Event")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get calendar events",
                Description = "Function for getting event data from the database."
            })
            .Produces<List<CalendarEvent>>(StatusCodes.Status200OK);

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

            //////////////////

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
