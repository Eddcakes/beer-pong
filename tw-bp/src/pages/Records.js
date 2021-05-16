import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Container, Header } from '../components';

/* like premier league stats centre */

export function Records({ updatePageTitle }) {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const getRecords = await fetchRecords();
      if (getRecords.length > 0) {
        let groupedRecords = {};
        getRecords.forEach((record) => {
          if (groupedRecords[record.label]) {
            groupedRecords[record.label].push(record);
          } else {
            groupedRecords[record.label] = record.label;
            groupedRecords[record.label] = [record];
          }
        });
        setRecords(groupedRecords);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    updatePageTitle(`Records`);
  }, [updatePageTitle]);
  return (
    <>
      <Header />
      <Container maxW='max-w-screen-md'>
        <div className='p-6 space-y-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {Object.entries(records).map(([key, value]) => {
              return <RecordList key={key} recordType={key} records={value} />;
            })}
          </div>
        </div>
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

async function fetchRecords() {
  try {
    const records = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/records/`,
      {
        credentials: 'include',
      }
    );
    const resp = await records.json();
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}
