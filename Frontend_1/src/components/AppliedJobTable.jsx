import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(store => store.job);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'rejected') {
      return <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold text-xs px-2.5 py-0.5 rounded-full">Rejected</Badge>;
    } else if (s === 'pending') {
      return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-semibold text-xs px-2.5 py-0.5 rounded-full">Pending</Badge>;
    } else {
      return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs px-2.5 py-0.5 rounded-full">Accepted</Badge>;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
      <Table className="w-full min-w-[500px]">
        <TableCaption className="my-2 text-xs text-gray-500">A list of your applied jobs</TableCaption>
        <TableHeader className="bg-gray-50/60">
          <TableRow>
            <TableHead className="text-xs font-bold text-gray-600">Date</TableHead>
            <TableHead className="text-xs font-bold text-gray-600">Job Role</TableHead>
            <TableHead className="text-xs font-bold text-gray-600">Company</TableHead>
            <TableHead className="text-right text-xs font-bold text-gray-600">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!allAppliedJobs || allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-xs text-gray-500 italic">
                You haven't applied to any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedjob) => (
              <TableRow key={appliedjob?._id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                  {appliedjob?.createdAt ? appliedjob.createdAt.split("T")[0] : 'N/A'}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                  {appliedjob?.job?.title || 'N/A'}
                </TableCell>
                <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                  {appliedjob?.job?.company?.name || 'N/A'}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {getStatusBadge(appliedjob?.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;

