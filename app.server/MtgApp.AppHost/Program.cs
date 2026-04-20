using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// Database
var postgres = builder.AddPostgreSql("postgres")
    .WithPgAdmin();

var mtgdb = postgres.AddDatabase("mtgdb");

// API
var api = builder.AddProject("api", "../MtgApp.Api/MtgApp.Api.csproj")
    .WithReference(mtgdb);

var app = builder.Build();

app.Run();
