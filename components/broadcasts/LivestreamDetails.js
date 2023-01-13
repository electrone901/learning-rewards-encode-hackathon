import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Player } from '@livepeer/react'

function LivestreamDetails({ selectedStream, showAssets }) {
  console.log('selectedStream  here', selectedStream)
  console.log('__showAssets ', showAssets)
  const [stream, setStream] = useState('')

  useEffect(() => {
    const getStream = async () => {
      const res = await fetch(
        `https://livepeer.studio/api/stream/${selectedStream?.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('+res', res)
      const resData = await res.json()
      setStream(resData)
    }
    if (selectedStream) {
      getStream()
    }
  }, [setStream])

  return (
    <Card style={{ color: 'black', padding: '0px' }}>
      {showAssets !== true ? (
        <>
          {selectedStream.isActive ? (
            <div>
              <Player
                playbackId={`${selectedStream.playbackId}`}
                className="videoplayer"
                autoPlay={true}
                loop
                muted
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '75px',
              }}
            >
              <img
                src="https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg"
                alt="Livepeer Studio Logo"
                width="256"
                height="256"
                layout="fixed"
              />
            </div>
          )}

          <Card.Body>
            <h2> Stream Name: {selectedStream.name} </h2>
            <p>Status:</p>
            {selectedStream.isActive ? (
              <p
                style={{
                  fontSize: '1.25rem',
                  lineHeight: '1.5',
                  color: '#22c55e',
                }}
              >
                Stream is live
              </p>
            ) : (
              <p
                style={{
                  fontSize: '1.25rem',
                  lineHeight: '1.5',
                  color: '#ef4444',
                }}
              >
                Stream is not live
              </p>
            )}
            <p>Stream Record Status:</p>

            <p
              style={{
                fontSize: '1.5rem',
                lineHeight: '1.5',
                color: '#05911c',
              }}
            >
              {String(Boolean(selectedStream.record))}
            </p>

            <p>Stream Id:</p>
            {selectedStream.id}
            <p>Stream Id:</p>
            {selectedStream.id}
            <p>Stream Key:</p>
            {selectedStream.streamKey}
            <p>Playback Id:</p>
            {selectedStream.playbackId}
            <p>PlaybackURL:</p>
            {`https://livepeercdn.com/hls/${stream.playbackId}/index.m3u8`}
            <p>Recording:</p>
            {selectedStream.record
              ? 'Recording stream'
              : 'Not recording stream'}
          </Card.Body>
        </>
      ) : (
        ''
      )}

      {/* ASSETS */}
      {showAssets === true ? (
        <>
          {selectedStream.downloadUrl ? (
            <div>
              <Player
                playbackId={`${selectedStream.playbackId}`}
                className="videoplayer"
                autoPlay={true}
                loop
                muted
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '75px',
              }}
            >
              <img
                src="https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg"
                alt="Livepeer Studio Logo"
                width="256"
                height="256"
                layout="fixed"
              />
            </div>
          )}

          <Card.Body>
            <h2> Stream Name: {selectedStream.name} </h2>
            <p>Status:</p>
            {selectedStream?.source?.type ? (
              <p
                style={{
                  fontSize: '1.25rem',
                  lineHeight: '1.5',
                  color: '#22c55e',
                }}
              >
                This asset was a stream {selectedStream?.source?.type}
              </p>
            ) : (
              <p
                style={{
                  fontSize: '1.25rem',
                  lineHeight: '1.5',
                  color: '#ef4444',
                }}
              >
                Stream is not live
              </p>
            )}
            <p>Stream Id:</p>
            {selectedStream.id}
            <p>Stream Key:</p>
            {selectedStream.streamKey}
            <p>Playback Id:</p>
            {selectedStream.playbackId}
            <p>PlaybackURL:</p>
            {`https://livepeercdn.com/hls/${stream.playbackId}/index.m3u8`}
            <p>Recording:</p>
            {selectedStream.record
              ? 'Recording stream'
              : 'Not recording stream'}
          </Card.Body>
        </>
      ) : (
        ''
      )}
    </Card>
  )
}

export default LivestreamDetails
