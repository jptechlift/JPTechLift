
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;


public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                builder => builder.WithOrigins("http://localhost:3000")  // URL của frontend
                                  .AllowAnyMethod()
                                  .AllowAnyHeader());
        });

        services.AddControllers();
        services.AddAuthorization();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();

        app.UseCors("AllowFrontend");  // Kích hoạt CORS
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();  // Định nghĩa các API endpoint
        });
    }
}
