import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { Container, Header } from '../components';
import { fetchRecords } from '../queries';

/* like premier league stats centre */

export function Records({ updatePageTitle }) {
  const { isLoading, error, data } = useQuery('tournaments', fetchRecords);
  const groupedRecords = useMemo(() => {
    let grouped = {};
    if (data) {
      data.forEach((record) => {
        if (grouped[record.label]) {
          grouped[record.label].push(record);
        } else {
          grouped[record.label] = record.label;
          grouped[record.label] = [record];
        }
      });
    }
    return grouped;
  }, [data]);

  useEffect(() => {
    updatePageTitle(`Records`);
  }, [updatePageTitle]);
  return (
    <>
      <Header />
      <Container maxW='max-w-screen-md'>
        {error && <div>Error loading records</div>}
        {isLoading && <div>loading...</div>}
        {!isLoading && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {Object.entries(groupedRecords).map(([key, value]) => {
              return <RecordList key={key} recordType={key} records={value} />;
            })}
          </div>
        )}
      </Container>
      <div className='spacer py-8'></div>
    </>
  );
}

// order by value
function RecordList({ records, recordType }) {
  return (
    <div className='flex flex-col shadow p-4 space-y-4'>
      <h2 className='text-lg pb-4'>{recordType}</h2>
      {records.map((record, idx) => {
        return <DisplayRecords key={`${record.label}${idx}`} record={record} />;
      })}
    </div>
  );
}

function DisplayRecords({ record }) {
  return (
    <div className='flex flex-row justify-between border-b relative'>
      <Link
        className={`${
          record.current && 'psudo-winner'
        } text-link-text underline`}
        to={`/players/${record.player_ID}`}
      >
        {record.name}
      </Link>
      <div>{record.value}</div>
    </div>
  );
}
