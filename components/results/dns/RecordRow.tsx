import type { FC, ReactNode } from 'react';
import reactStringReplace from 'react-string-replace';

import { TableCell, TableRow } from '@/components/ui/table';

import DomainLink from '@/components/results/DomainLink';
import IpLink from '@/components/results/IpLink';
import { cn } from '@/lib/utils';

const DOMAIN_REGEX = /([a-zA-Z0-9-_]+\.)+[a-z]+\.?/gi;
const IPV4_REGEX = /(\d{1,3}\.){3}\d{1,3}/g;
const IPV6_REGEX =
  /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?/gi;

type RecordRowProps = {
  name: string;
  TTL: number;
  value: string;
  subvalue?: string;
};

const RecordRow: FC<RecordRowProps> = async ({
  name,
  TTL,
  value,
  subvalue,
}) => {
  let interpolatedValue: ReactNode[] | string | null = value;

  const domainMatches = value.match(DOMAIN_REGEX);
  for (const domain of domainMatches ?? []) {
    interpolatedValue = reactStringReplace(
      interpolatedValue,
      domain,
      (match) => {
        const normalizedMatch = match.endsWith('.')
          ? match.slice(0, -1)
          : match;
        return <DomainLink domain={normalizedMatch} />;
      }
    );
  }

  const ipv4Matches = value.match(IPV4_REGEX);
  for (const domain of ipv4Matches ?? []) {
    interpolatedValue = reactStringReplace(
      interpolatedValue,
      domain,
      (match) => <IpLink value={match} />
    );
  }

  const ipv6Matches = value.match(IPV6_REGEX);
  for (const domain of ipv6Matches ?? []) {
    interpolatedValue = reactStringReplace(
      interpolatedValue,
      domain,
      (match) => <IpLink value={match} />
    );
  }

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell className="pl-0">{name}</TableCell>
      <TableCell>{TTL}</TableCell>
      <TableCell className={cn('pr-0', { ['py-1']: subvalue })}>
        {interpolatedValue}
        {subvalue && (
          <span className="mt-1 block text-xs text-muted-foreground">
            {subvalue}
          </span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default RecordRow;
