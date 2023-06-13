import React from 'react'
import Card from 'react-bootstrap/Card'
import { Player } from '@livepeer/react'
function BroadcastCard({ stream, handleShow, showAssets }) {
  return (
    <Card
      style={{ width: '20rem', color: 'white' }}
      onClick={() => handleShow(stream, showAssets)}
    >
      <h3>asfajksfdjkhajk;</h3>
      {/* <Card.Body>
        <Card.Title className="pb-2">{stream.name} </Card.Title>
        {stream.isActive ? (
          <div>
            <Player
              playbackId={`${stream.playbackId}`}
              className="videoplayer"
              autoPlay={false}
              loop
              muted
            />
          </div>
        ) : (
          <img
            src={
              stream.image ||
              'https://cdn2.unrealengine.com/Unreal+Engine%2Findustry%2Fgames%2FNews_UEWeb_Games_blog_share_img3-1200x630-1fbacc68fcbff51163d2ecf620015252ad841aee.jpg'
            }
            alt="Livepeer Studio Logo"
            style={{ width: '100%', height: '140px' }}
            className="img-responsive"
          />
        )}

        <Card.Subtitle className="mt-4  mb-2 text-muted">
          Stream Status:
        </Card.Subtitle>

        {stream.isActive ? (
          <Card.Text
            style={{
              fontSize: '1.25rem',
              lineHeight: '1.5',
              color: '#22c55e',
            }}
          >
            Live Now!
          </Card.Text>
        ) : (
          <Card.Text
            style={{
              fontSize: '1.25rem',
              lineHeight: '1.5',
              color: '#ef4444',
            }}
          >
            Not Live
          </Card.Text>
        )}
      </Card.Body> */}
    </Card>
  )
}

export default BroadcastCard
