using MtgApp.Domain.Entities;

namespace MtgApp.ImageProcessing.Services;

public interface IBinderScanService
{
    Task<BinderScan> CreateScanAsync(string name, string? description = null);
    Task<ScanImage> UploadImageAsync(int binderScanId, Stream imageStream, string fileName, string? originalFileName = null);
    Task<BinderScan?> ProcessScanAsync(int binderScanId);
    Task<BinderScan?> GetScanAsync(int binderScanId);
    Task<List<BinderScan>> GetScansAsync(int limit = 50);
    Task<BinderScanStats> GetScanStatsAsync(int binderScanId);
    Task<bool> DeleteScanAsync(int binderScanId);
}

public class BinderScanStats
{
    public int TotalImages { get; set; }
    public int ProcessedImages { get; set; }
    public int FailedImages { get; set; }
    public int TotalDetectedCards { get; set; }
    public int ConfirmedCards { get; set; }
    public int CorrectedCards { get; set; }
    public double AverageConfidence { get; set; }
    public TimeSpan TotalProcessingTime { get; set; }
    public Dictionary<string, int> ProviderUsage { get; set; } = [];
}