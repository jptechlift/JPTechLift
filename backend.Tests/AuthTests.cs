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

        [Fact(Skip = "Requires database setup")]
        public void Register_Login_Profile_Flow()
        {
            // Integration test placeholder
        }
    }
}