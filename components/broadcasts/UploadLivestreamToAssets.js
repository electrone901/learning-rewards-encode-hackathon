import { useStream, useUpdateStream } from '@livepeer/react'
import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

function UploadLivestreamToAssets({ newStreamId }) {
  const streamId = newStreamId || 'b3cbb178-d9af-4878-a500-68e649186513'
  const { data: stream } = useStream(streamId)

  const { mutate: updateStream, status, error } = useUpdateStream({
    streamId,
    record: true,
    playbackPolicy: {
      type: 'jwt',
    },
  })

  return (
    <div className=" container pt-5 d-flex align-items-center justify-content-center ">
      <Card className="p-0 mt-4" style={{ width: '75%' }}>
        <Card.Header style={{ backgroundColor: 'lime' }}>
          Congratulations your stream has been created🎉
        </Card.Header>
        <Card.Body>
          <Card.Title className="mt-3" size="lg">
            Would you like to enable recording?
          </Card.Title>
          <Card.Text className="mt-3" size="sm">
            Enable Recording allows your livestream to be save and upload as an
            asset at the end of the stream.
          </Card.Text>
          <br />
          {stream && (
            <>
              <Card.Text className="fs-6 text">
                Stream Name: {stream?.name}
              </Card.Text>
              <Card.Text className="fs-6 text">
                Recording: {String(Boolean(stream.record))}
              </Card.Text>
              <br />
              <Card.Text className="">Input Your Stream Settings</Card.Text>

              <Card.Text className="fs-6 text">
                1. Select Stream settings.
              </Card.Text>

              <Card.Text className="fs-6 text">
                2. Select Custom for services.
              </Card.Text>

              <Card.Text className="fs-6 text">
                3. Copy and paste the RTMP ingest URL and Stream Key and paste
                it into the correct fields.
                <br />
                <span className="bold"> Server: </span>{' '}
                rtmp://rtmp.livepeer.com/live
                <br />
                <span className="bold"> Stream Key: </span> {stream.streamKey}
              </Card.Text>
            </>
          )}
          {error && <Card.Text>{error.message}</Card.Text>}
          <Button
            variant="primary"
            className="mt-5"
            disabled={status === 'loading' || stream?.record || !updateStream}
            onClick={() => {
              updateStream?.()
            }}
          >
            Enable Recording
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}

export default UploadLivestreamToAssets
