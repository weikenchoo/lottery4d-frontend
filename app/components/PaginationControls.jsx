'use client';


import { Button} from 'flowbite-react';
import {useRouter, useSearchParams } from 'next/navigation';

export default function PaginationControls({hasNextPage,hasPrevPage,total,pathName}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('per_page') ?? '5';



    

  return (
    <div className='flex gap-2 items-center'>
      <Button
        className='bg-blue-500 text-white p-1'
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`${pathName}?page=${Number(page) - 1}&per_page=${perPage}`);
        }}
      >
        Previous 
      </Button>

      <div className='items-center' >
        <h5>{page} / {Math.ceil(total / Number(perPage))}</h5>
        
      </div>

      <Button
        className='bg-blue-500 text-white p-1'
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`${pathName}?page=${Number(page) + 1}&per_page=${perPage}`);
        }}
      >
        Next
      </Button>
    </div>
  )
}
