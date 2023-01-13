import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import LivestreamDetails from './LivestreamDetails'
import chat from './chat.png'

function LivestreamContainer({
  show,
  fullscreen,
  setShow,
  selectedStream,
  showAssets,
}) {
  console.log('🚀 ~ file: LivestreamContainer.js:14 ~ showAssets', showAssets)
  return (
    <>
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Now Watching:{' '}
            {selectedStream.name ? selectedStream.name : 'Processing'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={8}>
              <LivestreamDetails
                selectedStream={selectedStream}
                showAssets={showAssets}
              />
            </Col>
            <Col sm={4}>
              <img src={chat} alt="chat" />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default LivestreamContainer
