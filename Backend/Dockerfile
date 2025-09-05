# Stage 1: Build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sao chép file project và restore các package
COPY ["backend.csproj", "."]
RUN dotnet restore "./backend.csproj"

# Sao chép toàn bộ code và build
COPY . .
WORKDIR "/src/."
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# Stage 2: Chạy ứng dụng
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Dòng này chính là "Start Command" của bạn, được định nghĩa bên trong Dockerfile
ENTRYPOINT ["dotnet", "backend.dll"]