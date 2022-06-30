import { Header } from '../components';
import { usePageTitle } from '../hooks/usePageTitle';

export function E404() {
  usePageTitle('Error 404 page was not found');
  return (
    <>
      <Header />
      <div className='h-full'>E404 page not found</div>
    </>
  );
}
