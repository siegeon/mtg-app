using MtgApp.ImageProcessing.Services;
using MtgApp.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults
builder.AddServiceDefaults();

// Add database
builder.AddNpgsqlDbContext<AppDbContext>("mtgdb");

// Add HTTP clients
builder.Services.AddHttpClient<ScryfallApiService>(client =>
{
    client.BaseAddress = new Uri("https://api.scryfall.com/");
    client.DefaultRequestHeaders.Add("User-Agent", "MTG-App-ImageProcessing/1.0");
})
.AddStandardResilienceHandler();

// Add AI/ML services configuration
builder.Services.Configure<OpenAIOptions>(
    builder.Configuration.GetSection("OpenAI"));
builder.Services.Configure<AzureVisionOptions>(
    builder.Configuration.GetSection("AzureVision"));
builder.Services.Configure<ScryfallOptions>(
    builder.Configuration.GetSection("Scryfall"));

// Add services
builder.Services.AddScoped<IImageAnalysisService, ImageAnalysisService>();
builder.Services.AddScoped<ICardDetectionService, CardDetectionService>();
builder.Services.AddScoped<IBinderScanService, BinderScanService>();
builder.Services.AddScoped<ScryfallApiService>();

// Add controllers and API documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapDefaultEndpoints();

app.UseRouting();
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Service = "ImageProcessing" }));

app.Run();
