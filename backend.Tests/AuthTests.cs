using System.Threading.Tasks;
using Google.Apis.Auth;
using Xunit;

namespace backend.Tests
{
    public class AuthTests
    {
        [Fact]
        public void PasswordHashing_ShouldValidate()
        {
            var password = "secret";
            var hash = BCrypt.Net.BCrypt.HashPassword(password);
            Assert.True(BCrypt.Net.BCrypt.Verify(password, hash));
        }

        [Fact]
        public async Task GoogleToken_Invalid_ShouldThrow()
        {
            await Assert.ThrowsAsync<InvalidJwtException>(() => GoogleJsonWebSignature.ValidateAsync("invalid"));
        }

        [Fact(Skip = "Requires database setup")]
        public void Register_Login_Profile_Flow()
        {
            // Integration test placeholder
        }
    }
}