using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// Entity Framework Core context configuring the application's
/// relational mappings. The naming convention follows snake_case in
/// PostgreSQL as documented in READMEFORBE.md.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<ProductBlog> ProductBlogs => Set<ProductBlog>();
    public DbSet<TopicBlog> TopicBlogs => Set<TopicBlog>();

    /// <summary>
    /// Configure table names and relationships.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Explicitly map to snake_case table names for clarity.
        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Blog>().ToTable("blogs");
        modelBuilder.Entity<ProductBlog>().ToTable("product_blogs");
        modelBuilder.Entity<TopicBlog>().ToTable("topic_blogs");

        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().HasAlternateKey(u => u.Username);
        modelBuilder.Entity<Blog>().Property(b => b.Author).HasColumnName("author");
        modelBuilder.Entity<Blog>().Property(b => b.Content).HasColumnName("content");


        modelBuilder.Entity<Blog>().HasAlternateKey(b => b.Slug);
        modelBuilder.Entity<Blog>()
            .HasOne(b => b.User)
            .WithMany(u => u.Blogs)
            .HasForeignKey(b => b.Username)
            .HasPrincipalKey(u => u.Username);

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