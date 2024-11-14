
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

            app.UseHttpsRedirection();

            app.UseAuthorization();


            #region routes

            app.MapGet("/test", (HttpContext httpContext) =>
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

            app.MapGet("/mariaDBExample", (HttpContext httpContext) =>
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
