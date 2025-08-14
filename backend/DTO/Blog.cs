public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Username { get; set; }  // Thuộc tính Username trong Blog

    public User User { get; set; }  // Quan hệ với User
}
