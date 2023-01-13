import React from 'react'
import BroadcastCard from './BroadcastCard'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function GetAllStreams({ streams, handleShow, showAssets }) {
  return (
    <div>
      <Row>
        {streams.length > 0 ? (
          streams.map((stream, index) => (
            <Col key={index} className="pb-5">
              <BroadcastCard
                stream={stream}
                handleShow={handleShow}
                showAssets={showAssets}
              />
            </Col>
          ))
        ) : (
          <h1>No Upcoming Streams</h1>
        )}
      </Row>
    </div>
  )
}

export default GetAllStreams
