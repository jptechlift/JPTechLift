public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Blog> Blogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình mối quan hệ giữa Blog và User
        modelBuilder.Entity<Blog>()
            .HasOne(b => b.User)  // Blog có một User
            .WithMany(u => u.Blogs)  // Một User có nhiều Blog
            .HasForeignKey(b => b.Username)  // Foreign key là Username
            .OnDelete(DeleteBehavior.Cascade);  // Xóa Blog khi xóa User

        // Cấu hình lại khóa chính cho User nếu cần thiết
        modelBuilder.Entity<User>()
            .HasKey(u => u.Username);  // Đảm bảo Username là khóa chính của User
    }
}
