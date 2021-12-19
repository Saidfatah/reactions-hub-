import {json,useLoaderData,Form,useActionData,redirect} from 'remix'
import {useState} from 'react'
import {gql} from 'graphql-request'
import YouTubePlayer from 'react-player/youtube'
import {graphcmsClient} from '../../lib/graphcms'
import Reaction from "../../components/Reaction";
 
const GetVideoById = gql`
   query GetVideoById($videoId: ID!){
       video(where:{ id:$videoId}){
           id
           title
           url
           reactions{
             id
             timeStamp
             duration
             emoji  
           }
       }
   }
`
const CreateReaction = gql`
  mutation CreateReaction(
    $timeStamp: Float!
    $duration: Int!
    $emoji: Emoji!
    $videoId: ID!
  ) {
    createReaction(
      data: {
        timeStamp: $timeStamp
        duration: $duration
        emoji: $emoji
        video: { connect: { id: $videoId } }
      }
    ) {
      id
      timeStamp
      duration
      emoji
    }
  }
`;


export const meta = ({data})=>({
   title:data.video.title
})

export const loader =async ({params})=>{
  const {videoId}=params
 const data =await graphcmsClient.request(GetVideoById,
  {
  videoId  
  })

 return json(data)
}
export let action = async ({ request, params }) => {
  const { videoId } = params;
  const formData = await request.formData();
  const { timeStamp, duration, emoji } = Object.fromEntries(formData);
  console.log({ timeStamp, duration, emoji } )
  await graphcmsClient.request(CreateReaction, {
    timeStamp: Number(timeStamp),
    duration: Number(duration),
    emoji: String(emoji),
    videoId,
  });

  return redirect(`/video/${videoId}`);
};

export default ()=>{
  const actionMessage = useActionData();
  const data = useLoaderData()
  const [duration, setDuration] = useState(0)
  const [secondsEnlapsed, setSecondsEnlapsed] = useState(0)
  const handleProgress =({playedSeconds})=>{setSecondsEnlapsed(playedSeconds)}
  const handleDuration =(dur)=>{setDuration(dur)}

  return(
    <div>
      <h1>videos </h1>
      {data.video.title}
      <div style={{ position: "relative" }} className='video-player-container' >
          {data?.video?.url && (
            <YouTubePlayer
              url={data.video.url}
              onProgress={handleProgress}
              onDuration={handleDuration}
              controls
              style={
                {
                  width:'100%'
                }
              }
            />
          )}

          <div
            style={{
              marginTop: "10px",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "25px",
              zIndex: 100,
            }}
          >
            <div style={{ position: "relative", zIndex: 100 }}>
              {data?.video?.reactions?.map(
                ({
                  id,
                  ...reaction
                }) => (
                  <Reaction key={id} {...reaction} />
                )
              )}
            </div>
          </div>
        </div>

      <Form
          method="post"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <input type="hidden" name="timeStamp" value={secondsEnlapsed} />
          <input type="hidden" name="duration" value={duration} />

          <button name="emoji" type="submit" value="CLAP">
            👏
          </button>

          <button name="emoji" type="submit" value="HEART">
            ❤️
          </button>

          <button name="emoji" type="submit" value="SHOCK">
            😱
          </button>

          <button name="emoji" type="submit" value="EYE">
            👁
          </button>

          {actionMessage ? (
            <p>
              <b>{actionMessage}</b>
            </p>
          ) : null}
        </Form>
    </div>
  )
}