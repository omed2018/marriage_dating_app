import { getPendingReports } from "@/features/report/admin-actions";
import { Card, CardContent } from "@/components/ui/Card";

export default async function AdminReportsPage() {
  const reports = await getPendingReports();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin — Reports</h1>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No pending reports</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    {report.status}
                  </span>
                </div>
                <p className="text-sm">
                  <strong>{report.reporter.name}</strong> reported{" "}
                  <strong>{report.reported.name}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Reason: {report.reason.replace(/_/g, " ")}
                </p>
                {report.description && (
                  <p className="text-sm text-gray-500 italic">
                    &quot;{report.description}&quot;
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
