# Stage 1: Build application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore dependencies
COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"

# Build and publish
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# Stage 2: Run application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]