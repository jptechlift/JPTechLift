using System.Text.Json;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;

namespace Backend.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ICorsService _corsService;
    private readonly ICorsPolicyProvider _corsPolicyProvider;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ICorsService corsService,
        ICorsPolicyProvider corsPolicyProvider
    )
    {
        _next = next;
        _corsService = corsService;
        _corsPolicyProvider = corsPolicyProvider;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception)
        {
            if (!context.Response.HasStarted)
            {
                var policy = await _corsPolicyProvider.GetPolicyAsync(context, "AllowFrontend");
                if (policy != null)
                {
                    var result = _corsService.EvaluatePolicy(context, policy);
                    _corsService.ApplyResult(result, context.Response);
                }

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";
            }

            var payload = JsonSerializer.Serialize(new { error = "An unexpected error occurred." });
            await context.Response.WriteAsync(payload);
        }
    }
}
