/* eslint-disable prettier/prettier */
import { useEffect } from 'react';
import {Link} from '@shopify/hydrogen';
export function Filters({
    uniqueProductTypes,
    handle, 
  ...props
}: {
    uniqueProductTypes?: any[]; 
    handle:string; 
    [key: string]: any;
}) {
  //  useEffect(()=>{
  //   console.log(handle)
  //  },[])
  // console.log("HANDLE INSIDE FILTER:",handle)
  return <div>
    {uniqueProductTypes?.map(productType=><div key={productType}>
        <Link to={`/filter/${handle}?type=${productType}`}>
          <p className="underline">{productType}</p>
        </Link>
  </div>)}
  </div>;
}
