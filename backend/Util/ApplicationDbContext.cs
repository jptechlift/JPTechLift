using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<ProductBlog> ProductBlogs { get; set; }
    public DbSet<TopicBlog> TopicBlogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình mối quan hệ giữa Blog và User
        modelBuilder.Entity<Blog>()
            .HasOne(b => b.User)
            .WithMany(u => u.Blogs)
            .HasForeignKey(b => b.Username)
            .OnDelete(DeleteBehavior.Cascade);

        // Cấu hình quan hệ 1-1 giữa Blog và ProductBlog
        modelBuilder.Entity<ProductBlog>()
            .HasOne(pb => pb.Blog)
            .WithOne(b => b.ProductBlog)
            .HasForeignKey<ProductBlog>(pb => pb.BlogId)
            .OnDelete(DeleteBehavior.Cascade);

        // Cấu hình quan hệ 1-1 giữa Blog và TopicBlog
        modelBuilder.Entity<TopicBlog>()
            .HasOne(tb => tb.Blog)
            .WithOne(b => b.TopicBlog)
            .HasForeignKey<TopicBlog>(tb => tb.BlogId)
            .OnDelete(DeleteBehavior.Cascade);

        // Cấu hình lại khóa chính cho User
        modelBuilder.Entity<User>()
            .HasKey(u => u.Username);
    }
}