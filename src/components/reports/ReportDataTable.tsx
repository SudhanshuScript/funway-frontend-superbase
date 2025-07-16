
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ReportData, ReportType } from '@/utils/reportUtils';

interface ReportDataTableProps {
  reportType: ReportType;
  data: ReportData[];
}

const ReportDataTable: React.FC<ReportDataTableProps> = ({ reportType, data }) => {
  return (
    <Card>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Franchise</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Revenue ($)</TableHead>
              <TableHead>GST ($)</TableHead>
              <TableHead>Add-ons ($)</TableHead>
              <TableHead>Offers Used</TableHead>
              <TableHead>Occupancy %</TableHead>
              <TableHead>Guest Types</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.franchise}</TableCell>
                <TableCell>{row.session}</TableCell>
                <TableCell>{row.bookings}</TableCell>
                <TableCell>${row.revenue.toLocaleString()}</TableCell>
                <TableCell>${row.gst.toLocaleString()}</TableCell>
                <TableCell>${row.addons.toLocaleString()}</TableCell>
                <TableCell>{row.offers}</TableCell>
                <TableCell>{row.occupancy}%</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        Regular: {row.guestTypes.regular}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        VIP: {row.guestTypes.vip}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
                        First Time: {row.guestTypes.firstTime}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReportDataTable;
