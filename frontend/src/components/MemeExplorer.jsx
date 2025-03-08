import React from 'react'
import { useSelector } from 'react-redux';
import './css/MemeExplorer.css'

function MemeExplorer() {
  const { posts } = useSelector((store) => store.post);
  console.log(typeof(posts))

  return (
    <>
      <div className='MemeExplorer text-black'> 
        {
          posts.map((m)=>{
            <div key={m?.author?._id} className='MemeCard'>
              <div className='MemeAuthorInfo'>
                <div className="MemeAuthorImage">
                  <img src={m?.author?.profilePicture} alt="" />
                </div>
                <div className="MemeAuthorName">{console.log(m.author)}</div>
              </div>
              <div className="MemeDisplay"></div>
            </div>
          })
        }
      </div>
    </>
  )
}

export default MemeExplorer