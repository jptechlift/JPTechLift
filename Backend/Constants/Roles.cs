namespace Backend.Constants;

public static class Roles
{
    public const string Admin = "admin";
    public const string Author = "author";
    public const string User = "user";

    public const string NonAdminPattern = "^(" + User + "|" + Author + ")$";
}