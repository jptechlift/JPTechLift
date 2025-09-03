using Backend.Services;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace backend.Tests;

public class FakeCaptchaService : CaptchaService
{
    public FakeCaptchaService() : base(new HttpClient(), new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string> { { "Recaptcha:SecretKey", "dummy" } }).Build()) { }
    public override Task<bool> IsCaptchaValid(string? token) => Task.FromResult(!string.IsNullOrEmpty(token));
}