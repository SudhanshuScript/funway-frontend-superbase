
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Offer } from '@/types/offerTypes';
import OfferTableRow from './table/OfferTableRow';
import EmptyOrLoadingState from './table/EmptyOrLoadingState';

interface OffersTableProps {
  offers: Offer[];
  isLoading: boolean;
  isSuperAdmin: boolean;
}

const OffersTable = ({ offers, isLoading, isSuperAdmin }: OffersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer ID</TableHead>
            <TableHead>Name & Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Validity</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || offers.length === 0 ? (
            <EmptyOrLoadingState isLoading={isLoading} colSpan={8} />
          ) : (
            offers.map((offer) => (
              <OfferTableRow key={offer.id} offer={offer} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OffersTable;
