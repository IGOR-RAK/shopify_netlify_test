/* eslint-disable prettier/prettier */
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
 
  console.log("HANDLE INSIDE FILTER:",handle)
  return <div>
    {uniqueProductTypes?.map(productType=><div key={productType}>
        <Link to={`/filter/${handle}?type=${productType}`}>
          <p className="underline">{productType}</p>
        </Link>
  </div>)}
  </div>;
}
