using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// PostgreSQL database
var postgres = builder.AddPostgres("postgres", port: 5432)
    .AddDatabase("mtgapp");

// Ingest worker
var ingest = builder.AddProject("ingest", "../MtgApp.Ingest/MtgApp.Ingest.csproj")
    .WithReference(postgres)
    .WaitFor(postgres);

// API
var api = builder.AddProject("api", "../MtgApp.Api/MtgApp.Api.csproj")
    .WithReference(postgres);

var app = builder.Build();

app.Run();
