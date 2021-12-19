import {json,useLoaderData,Link} from 'remix'
import {gql} from 'graphql-request'

import {graphcmsClient} from '../lib/graphcms'

const GetAllVideosQuery = gql`
 {
   videos{
     id
     title
   }
 }
`
export const meta = ()=>({
   title:'Video Reactions'
})

export const loader =async ()=>{
 const data =await graphcmsClient.request(GetAllVideosQuery)

 return json(data)
}

export default ()=>{
  const data = useLoaderData()
  return(
    <div>
      <h1>videos </h1>
      {data?.videos && 
        (
          <ul>
            {data.videos.map(video=>(<li key={video.id} >
              <Link to={`/video/${video.id}`} >{video.title}</Link>

            </li>))}
          </ul>
        )
      }
    </div>
  )
}