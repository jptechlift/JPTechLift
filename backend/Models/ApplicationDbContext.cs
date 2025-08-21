using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<ProductBlog> ProductBlogs => Set<ProductBlog>();
    public DbSet<TopicBlog> TopicBlogs => Set<TopicBlog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasKey(u => u.Username);

        modelBuilder.Entity<Blog>()
            .HasOne(b => b.User)
            .WithMany(u => u.Blogs)
            .HasForeignKey(b => b.Username);

        modelBuilder.Entity<Blog>()
            .HasOne(b => b.ProductBlog)
            .WithOne(pb => pb.Blog)
            .HasForeignKey<ProductBlog>(pb => pb.BlogId);

        modelBuilder.Entity<Blog>()
            .HasOne(b => b.TopicBlog)
            .WithOne(tb => tb.Blog)
            .HasForeignKey<TopicBlog>(tb => tb.BlogId);
    }
}